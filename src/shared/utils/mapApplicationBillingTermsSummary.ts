import type { AgreementBillingType, CommercialAgreement } from '@/shared/types/commercialAgreement'

export type ApplicationBillingTermsTone = 'success' | 'warning' | 'info' | 'critical' | 'neutral'

const BILLING_TYPE_LABEL: Record<AgreementBillingType, string> = {
  credit: 'Credit',
  advance: 'Advance',
  mixed: 'Mixed',
}

const DEFAULT_ADVANCE_SERVICES = ['Visa Processing', 'Appointment Booking']
const DEFAULT_MIXED_ADVANCE_SERVICES = ['Visa Processing']
const DEFAULT_MIXED_CREDIT_SERVICES = ['Courier', 'Additional Services']

export interface ApplicationBillingTermsField {
  label: string
  value: string
}

interface ApplicationBillingTermsBase {
  billingType: AgreementBillingType
  billingTypeLabel: string
  tone: ApplicationBillingTermsTone
}

export interface ApplicationBillingTermsCredit extends ApplicationBillingTermsBase {
  billingType: 'credit'
  fields: ApplicationBillingTermsField[]
  helperText: string
}

export interface ApplicationBillingTermsAdvance extends ApplicationBillingTermsBase {
  billingType: 'advance'
  fields: ApplicationBillingTermsField[]
  infoText: string
  applicableServices: string[]
}

export interface ApplicationBillingTermsMixed extends ApplicationBillingTermsBase {
  billingType: 'mixed'
  fields: ApplicationBillingTermsField[]
  advanceApplicableServices: string[]
  creditApplicableServices: string[]
}

export type ApplicationBillingTermsViewModel =
  | ApplicationBillingTermsCredit
  | ApplicationBillingTermsAdvance
  | ApplicationBillingTermsMixed

function formatCreditLimit(amount: number): string {
  if (amount <= 0) return '—'
  return `INR ${amount.toLocaleString('en-IN')}`
}

function servicesByRule(
  agreement: CommercialAgreement,
  rule: 'advance' | 'credit',
  fallback: string[],
): string[] {
  const fromRules = agreement.billingConfig.serviceWiseBillingRules
    .filter(r => r.billingRule === rule)
    .map(r => r.servicePresetName)
  return fromRules.length > 0 ? fromRules : fallback
}

function formatAdvanceRequired(agreement: CommercialAgreement): string {
  const { advanceType, advancePercentage, fixedAdvanceAmount } = agreement.billingConfig
  if (advanceType === 'full') return 'Full advance'
  if (advanceType === 'fixed' && fixedAdvanceAmount > 0) {
    return `INR ${fixedAdvanceAmount.toLocaleString('en-IN')} fixed`
  }
  if (advancePercentage > 0) return `${advancePercentage}%`
  return 'As per agreement'
}

export function mapApplicationBillingTermsSummary(
  agreement: CommercialAgreement,
): ApplicationBillingTermsViewModel {
  const billingType = agreement.billingType
  const billingTypeLabel = BILLING_TYPE_LABEL[billingType]
  const { creditPeriodDays, creditLimit } = agreement.billingConfig

  if (billingType === 'credit') {
    return {
      billingType: 'credit',
      billingTypeLabel,
      tone: 'info',
      fields: [
        { label: 'Billing type', value: billingTypeLabel },
        { label: 'Credit period', value: `${creditPeriodDays} days` },
        { label: 'Credit limit', value: formatCreditLimit(creditLimit) },
      ],
      helperText: 'Invoices are payable as per agreed credit terms.',
    }
  }

  if (billingType === 'advance') {
    return {
      billingType: 'advance',
      billingTypeLabel,
      tone: 'warning',
      fields: [{ label: 'Billing type', value: billingTypeLabel }],
      infoText: 'Advance payment may be required before processing continues.',
      applicableServices: servicesByRule(agreement, 'advance', DEFAULT_ADVANCE_SERVICES),
    }
  }

  return {
    billingType: 'mixed',
    billingTypeLabel,
    tone: 'info',
    fields: [
      { label: 'Billing type', value: billingTypeLabel },
      { label: 'Advance required', value: formatAdvanceRequired(agreement) },
      { label: 'Remaining credit period', value: `${creditPeriodDays} days` },
    ],
    advanceApplicableServices: servicesByRule(agreement, 'advance', DEFAULT_MIXED_ADVANCE_SERVICES),
    creditApplicableServices: servicesByRule(agreement, 'credit', DEFAULT_MIXED_CREDIT_SERVICES),
  }
}
