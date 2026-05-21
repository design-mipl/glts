export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'pending_documents'

export interface Application {
  id: string
  applicantName: string
  countryId: string
  countryName: string
  visaType: string
  status: ApplicationStatus
  submittedAt: string
  updatedAt: string
  price: number
  travelDate?: string
}
