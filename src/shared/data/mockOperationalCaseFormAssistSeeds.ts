import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'

export interface OperationalCaseFormAssistSeed {
  applicationId: string
  passengerSequence: number
  submission: Pick<
    FormAssistSubmissionDraft,
    | 'vfsServiceCharges'
    | 'paymentDate'
    | 'paymentMode'
    | 'paymentReferenceNumber'
    | 'amountPaid'
    | 'receiptStatus'
    | 'submissionDate'
    | 'submissionReferenceNumber'
    | 'submittedBy'
    | 'vfsSubmissionDate'
  >
}

/** Demo submission snapshots aligned with `mockOperationalCases` application fee selections. */
export const OPERATIONAL_CASE_FORM_ASSIST_SEEDS: OperationalCaseFormAssistSeed[] = [
  {
    applicationId: 'GLTS-M-2026-0142',
    passengerSequence: 1,
    submission: {
      vfsServiceCharges: [
        { id: 'seed-142-1', serviceName: 'VFS fees', amount: 1200, gstIncluded: false },
        { id: 'seed-142-2', serviceName: 'Visa fees', amount: 8500, gstIncluded: false },
        { id: 'seed-142-3', serviceName: 'Biometrics', amount: 2500, gstIncluded: false },
      ],
      submissionDate: '2026-06-10',
      submissionReferenceNumber: 'VFS-ONL-2026-0142',
      submittedBy: 'Ananya Mehta',
      vfsSubmissionDate: '2026-06-11',
      paymentDate: '2026-06-10',
      paymentMode: 'card',
      paymentReferenceNumber: 'CCAV-2026-0142',
      amountPaid: '12200',
      receiptStatus: 'received',
    },
  },
  {
    applicationId: 'GLTS-M-2026-0155',
    passengerSequence: 1,
    submission: {
      vfsServiceCharges: [
        { id: 'seed-155-1', serviceName: 'VFS fees', amount: 1200, gstIncluded: false },
        { id: 'seed-155-2', serviceName: 'Visa fees', amount: 6200, gstIncluded: false },
      ],
      submissionDate: '2026-06-08',
      submissionReferenceNumber: 'VFS-ONL-2026-0155',
      submittedBy: 'Riya Sharma',
      vfsSubmissionDate: '2026-06-09',
      paymentDate: '2026-06-08',
      paymentMode: 'upi',
      paymentReferenceNumber: 'UPI-88442211',
      amountPaid: '7400',
      receiptStatus: 'received',
    },
  },
  {
    applicationId: 'GLTS-M-2026-0162',
    passengerSequence: 1,
    submission: {
      vfsServiceCharges: [
        { id: 'seed-162-1', serviceName: 'VFS fees', amount: 1200, gstIncluded: false },
        { id: 'seed-162-2', serviceName: 'Biometrics', amount: 2500, gstIncluded: false },
        { id: 'seed-162-3', serviceName: 'Priority', amount: 1800, gstIncluded: true },
      ],
      submissionDate: '2026-06-07',
      submissionReferenceNumber: 'VFS-ONL-2026-0162',
      submittedBy: 'Vikram Patel',
      vfsSubmissionDate: '2026-06-08',
      paymentDate: '2026-06-07',
      paymentMode: 'bank_transfer',
      paymentReferenceNumber: 'NEFT-20260607-162',
      amountPaid: '5500',
      receiptStatus: 'received',
    },
  },
  {
    applicationId: 'GLTS-M-2026-0172',
    passengerSequence: 1,
    submission: {
      vfsServiceCharges: [
        { id: 'seed-172-1', serviceName: 'VFS fees', amount: 1200, gstIncluded: false },
        { id: 'seed-172-2', serviceName: 'Visa fees', amount: 8500, gstIncluded: false },
      ],
      submissionDate: '2026-06-06',
      submissionReferenceNumber: 'VFS-ONL-2026-0172',
      submittedBy: 'Sana Iqbal',
      vfsSubmissionDate: '2026-06-07',
      paymentDate: '2026-06-06',
      paymentMode: 'card',
      paymentReferenceNumber: 'CCAV-2026-0172',
      amountPaid: '9700',
      receiptStatus: 'awaited',
    },
  },
  {
    applicationId: 'GLTS-M-2026-0180',
    passengerSequence: 1,
    submission: {
      vfsServiceCharges: [
        { id: 'seed-180-1', serviceName: 'VFS fees', amount: 1200, gstIncluded: false },
        { id: 'seed-180-2', serviceName: 'Biometrics', amount: 2500, gstIncluded: false },
        { id: 'seed-180-3', serviceName: 'Visa fees', amount: 9200, gstIncluded: false },
      ],
      submissionDate: '2026-06-05',
      submissionReferenceNumber: 'VFS-ONL-2026-0180',
      submittedBy: 'Documentation Team',
      vfsSubmissionDate: '2026-06-06',
      paymentDate: '2026-06-05',
      paymentMode: 'cash',
      paymentReferenceNumber: 'CASH-VFS-DEL-180',
      amountPaid: '12900',
      receiptStatus: 'received',
    },
  },
]
