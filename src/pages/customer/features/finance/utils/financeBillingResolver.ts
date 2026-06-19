import { mockBillingAgreementData } from '@/pages/customer/features/profile/data/billingAgreement.mock'
import type { CustomerBillingInfo } from '../types/customerFinance.types'

export function resolveCustomerBillingInfo(companyName?: string): CustomerBillingInfo {
  const billing = mockBillingAgreementData.billingEntity
  const primaryContact = mockBillingAgreementData.financeContactPersons[0]
  return {
    companyName: companyName ?? billing.billingEntityName,
    billingContact: primaryContact?.contactPerson ?? 'Finance Team',
    billingEmail: primaryContact?.email ?? billing.billingEmail,
    gstNumber: billing.gstNumber,
  }
}
