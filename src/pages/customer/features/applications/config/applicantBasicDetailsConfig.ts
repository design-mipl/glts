export interface ApplicantBasicDetails {
  crewId: string
  applicantName: string
  passportNumber: string
  nationality: string
  dateOfBirth: string
  cdcNumber: string
  phoneNumber: string
  email: string
}

export const BASIC_DETAIL_REQUIRED_KEYS = [
  'applicantName',
  'passportNumber',
  'nationality',
  'dateOfBirth',
] as const satisfies ReadonlyArray<keyof ApplicantBasicDetails>

export function emptyApplicantBasicDetails(): ApplicantBasicDetails {
  return {
    crewId: '',
    applicantName: '',
    passportNumber: '',
    nationality: '',
    dateOfBirth: '',
    cdcNumber: '',
    phoneNumber: '',
    email: '',
  }
}
