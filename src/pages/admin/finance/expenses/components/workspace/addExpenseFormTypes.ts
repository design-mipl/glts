import type {
  ApplicationExpenseBillTo,
  ApplicationExpensePaidBy,
  ApplicationExpensePassengerMappingScope,
  ApplicationExpenseProofDocumentType,
} from '@/shared/types/applicationExpenseManagement'

export interface AddExpenseFormValue {
  /** Selected commercial-agreement service option id. */
  agreementServiceId: string
  vendorProvider: string
  mappingScope: ApplicationExpensePassengerMappingScope
  passengerId: string
  passengerIds: string[]
  amount: string
  gstApplicable: boolean
  /** Tax master GST rate id (percentage comes from GST master). */
  gstRateId: string
  paidBy: ApplicationExpensePaidBy
  billTo: ApplicationExpenseBillTo
  notes: string
  proofDocumentType: ApplicationExpenseProofDocumentType | ''
  proofFileName: string
}

export function createEmptyAddExpenseForm(
  isSinglePassenger: boolean,
  defaultPassengerId = '',
): AddExpenseFormValue {
  return {
    agreementServiceId: '',
    vendorProvider: 'GLTS Operations',
    mappingScope: isSinglePassenger ? 'passenger' : 'application',
    passengerId: defaultPassengerId,
    passengerIds: defaultPassengerId ? [defaultPassengerId] : [],
    amount: '',
    gstApplicable: false,
    gstRateId: '',
    paidBy: 'glts_team',
    billTo: 'client',
    notes: '',
    proofDocumentType: '',
    proofFileName: '',
  }
}
