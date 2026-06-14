import type {
  ApplicationExpenseBillTo,
  ApplicationExpensePaidBy,
  ApplicationExpensePassengerMappingScope,
  ApplicationExpenseProofDocumentType,
  ApplicationExpenseType,
} from '@/shared/types/applicationExpenseManagement'

export interface AddExpenseFormValue {
  service: ApplicationExpenseType
  vendorProvider: string
  mappingScope: ApplicationExpensePassengerMappingScope
  passengerId: string
  passengerIds: string[]
  amount: string
  gstApplicable: boolean
  gstValue: string
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
    service: 'visa_processing_fee',
    vendorProvider: 'GLTS Operations',
    mappingScope: isSinglePassenger ? 'passenger' : 'application',
    passengerId: defaultPassengerId,
    passengerIds: defaultPassengerId ? [defaultPassengerId] : [],
    amount: '',
    gstApplicable: false,
    gstValue: '0',
    paidBy: 'glts_team',
    billTo: 'client',
    notes: '',
    proofDocumentType: '',
    proofFileName: '',
  }
}
