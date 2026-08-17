import type { AgreementBillingType, CommercialAgreement } from '@/shared/types/commercialAgreement'

export type ApplicationBillingTermsTone = 'success' | 'warning' | 'info' | 'critical' | 'neutral'

const BILLING_TYPE_LABEL: Record<AgreementBillingType, string> = {
  credit: 'Credit',
  advance: 'Advance',
}

const DEFAULT_ADVANCE_SERVICES = ['Visa Processing', 'Appointment Booking']

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

export type ApplicationBillingTermsViewModel =
  | ApplicationBillingTermsCredit
  | ApplicationBillingTermsAdvance

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

  return {
    billingType: 'advance',
    billingTypeLabel,
    tone: 'warning',
    fields: [{ label: 'Billing type', value: billingTypeLabel }],
    infoText: 'Advance payment may be required before processing continues.',
    applicableServices: servicesByRule(agreement, 'advance', DEFAULT_ADVANCE_SERVICES),
  }
}
