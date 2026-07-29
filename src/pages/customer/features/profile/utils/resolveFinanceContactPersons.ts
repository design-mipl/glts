import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import {
  financeContactsSummaryFromPersons,
  getSelectedFinanceContactPersons,
  resolveFinanceContactPersons,
} from '@/shared/utils/agreementFinanceContacts'
import { mapAgreementDocumentsForPortal } from '@/shared/utils/mapAgreementDocumentsForPortal'
import type { BillingAgreementData, FinanceContactPerson } from '../types/accountWorkspace'
import { CUSTOMER_PORTAL_AGREEMENT_ID } from '@/shared/utils/resolveCustomerPortalAgreement'
import { deriveCountryVisaCoverageFromCommercialRules } from './deriveAgreementOperations'
import { mapAgreementPricingToPortalGroups } from './mapAgreementPricingToPortalGroups'

export { CUSTOMER_PORTAL_AGREEMENT_ID }

function mapPerson(person: FinanceContactPerson): FinanceContactPerson {
  return { ...person }
}

export function resolvePortalFinanceContactPersons(
  agreement: CommercialAgreement | undefined,
  fallback: FinanceContactPerson[] = [],
): FinanceContactPerson[] {
  if (!agreement) return fallback

  const stored = resolveFinanceContactPersons(agreement)
  if (stored.length > 0) {
    const selectedIds = agreement.selectedFinanceContactIds
    if (selectedIds?.length) {
      return stored.filter(person => selectedIds.includes(person.id)).map(mapPerson)
    }
    return stored.map(mapPerson)
  }

  const formData = commercialAgreementService.agreementToFormData(agreement)
  return getSelectedFinanceContactPersons(formData).map(mapPerson)
}

export function enrichBillingAgreementFromCommercialAgreement(
  billing: BillingAgreementData,
  agreementId = CUSTOMER_PORTAL_AGREEMENT_ID,
): BillingAgreementData {
  const agreement = commercialAgreementService.getById(agreementId)
  const financeContactPersons = resolvePortalFinanceContactPersons(
    agreement,
    billing.financeContactPersons,
  )

  const financeContacts =
    financeContactPersons.length > 0
      ? (() => {
          const summary = financeContactsSummaryFromPersons(financeContactPersons)
          return {
            accountsSpocName: summary.accountsSpocName,
            accountsContactNumber: summary.accountsContactNumber || undefined,
            invoiceSubmissionEmail: summary.invoiceSubmissionEmail,
            paymentFollowUpContact: summary.paymentFollowUpContact,
          }
        })()
      : billing.financeContacts

  const billingSummary = agreement
    ? {
        ...billing.billingSummary,
        creditPeriodDays: String(agreement.billingConfig.creditPeriodDays || billing.billingSummary.creditPeriodDays),
        creditLimit:
          agreement.billingConfig.creditLimit > 0
            ? `INR ${agreement.billingConfig.creditLimit.toLocaleString('en-IN')}`
            : billing.billingSummary.creditLimit,
        gracePeriodDays: String(agreement.billingConfig.gracePeriodDays || billing.billingSummary.gracePeriodDays),
        ...(agreement.billingType === 'mixed'
          ? { advancePercentage: `${agreement.billingConfig.advancePercentage}%` }
          : {}),
      }
    : billing.billingSummary

  const mappedDocuments = mapAgreementDocumentsForPortal(agreement)
  const fallbackOnboarding = billing.onboardingDocuments.length > 0 ? billing.onboardingDocuments : billing.documents
  const onboardingDocuments =
    mappedDocuments.onboardingDocuments.length > 0 ? mappedDocuments.onboardingDocuments : fallbackOnboarding
  const agreementDocument = mappedDocuments.agreementDocument ?? billing.agreementDocument

  const pricingSource = agreement ? commercialAgreementService.agreementToFormData(agreement) : null
  const hasStructuredPricing =
    pricingSource &&
    (pricingSource.commercialVisaPricing.length > 0 ||
      pricingSource.miscellaneousServices.length > 0 ||
      pricingSource.pricingMatrix.length > 0)

  const commercialVisaPricing = hasStructuredPricing
    ? pricingSource.commercialVisaPricing
    : billing.commercialVisaPricing
  const miscellaneousServices = hasStructuredPricing
    ? pricingSource.miscellaneousServices
    : billing.miscellaneousServices

  const pricingGroups =
    hasStructuredPricing && pricingSource
      ? mapAgreementPricingToPortalGroups(
          pricingSource.pricingMatrix,
          pricingSource.billingType,
          pricingSource.miscellaneousCosts,
        )
      : billing.pricingGroups

  return {
    ...billing,
    financeContactPersons,
    financeContacts,
    billingSummary,
    documents: onboardingDocuments,
    onboardingDocuments,
    agreementDocument,
    commercialVisaPricing,
    miscellaneousServices,
    pricingGroups,
    supportedOperations: {
      countryCoverage: deriveCountryVisaCoverageFromCommercialRules(commercialVisaPricing),
    },
  }
}
