export type AdditionalDetailFieldType = 'text' | 'date' | 'email' | 'tel'

export interface AdditionalDetailFieldDef {
  key: keyof ApplicantAdditionalDetails
  label: string
  type: AdditionalDetailFieldType
}

export interface AdditionalDetailSectionDef {
  id: string
  title: string
  fields: AdditionalDetailFieldDef[]
}

export interface ApplicantAdditionalDetails {
  paxContactNo: string
  paxEmailId: string
  fatherName: string
  fatherDob: string
  fatherOccupation: string
  fatherNationality: string
  motherName: string
  motherDob: string
  motherOccupation: string
  motherNationality: string
  spouseName: string
  spouseDob: string
  spousePlaceOfBirth: string
  spouseOccupation: string
  spouseNationality: string
  childName: string
  childDob: string
  childPlaceOfBirth: string
  lastContractSignDate: string
  employmentOccupation: string
  educationInstituteName: string
  previousChinaVisaDetails: string
  previousChinaVisaCategory: string
  previousChinaVisaPlaceIssued: string
  previousChinaVisaIssueDate: string
  previousChinaVisaNo: string
  validVisaInPassport: string
  last12MonthsVisitedCountry: string
}

export function emptyApplicantAdditionalDetails(): ApplicantAdditionalDetails {
  return {
    paxContactNo: '',
    paxEmailId: '',
    fatherName: '',
    fatherDob: '',
    fatherOccupation: '',
    fatherNationality: '',
    motherName: '',
    motherDob: '',
    motherOccupation: '',
    motherNationality: '',
    spouseName: '',
    spouseDob: '',
    spousePlaceOfBirth: '',
    spouseOccupation: '',
    spouseNationality: '',
    childName: '',
    childDob: '',
    childPlaceOfBirth: '',
    lastContractSignDate: '',
    employmentOccupation: '',
    educationInstituteName: '',
    previousChinaVisaDetails: '',
    previousChinaVisaCategory: '',
    previousChinaVisaPlaceIssued: '',
    previousChinaVisaIssueDate: '',
    previousChinaVisaNo: '',
    validVisaInPassport: '',
    last12MonthsVisitedCountry: '',
  }
}

export const APPLICANT_ADDITIONAL_DETAIL_SECTIONS: AdditionalDetailSectionDef[] = [
  {
    id: 'passengerContact',
    title: 'Passenger Contact Details',
    fields: [
      { key: 'paxContactNo', label: 'PAX Contact No', type: 'tel' },
      { key: 'paxEmailId', label: 'PAX Email ID', type: 'email' },
    ],
  },
  {
    id: 'father',
    title: 'Father Details',
    fields: [
      { key: 'fatherName', label: "Father's Name", type: 'text' },
      { key: 'fatherDob', label: 'Date of Birth', type: 'date' },
      { key: 'fatherOccupation', label: 'Occupation', type: 'text' },
      { key: 'fatherNationality', label: 'Nationality', type: 'text' },
    ],
  },
  {
    id: 'mother',
    title: 'Mother Details',
    fields: [
      { key: 'motherName', label: "Mother's Name", type: 'text' },
      { key: 'motherDob', label: 'Date of Birth', type: 'date' },
      { key: 'motherOccupation', label: 'Occupation', type: 'text' },
      { key: 'motherNationality', label: 'Nationality', type: 'text' },
    ],
  },
  {
    id: 'spouse',
    title: 'Spouse Details',
    fields: [
      { key: 'spouseName', label: 'Spouse Name', type: 'text' },
      { key: 'spouseDob', label: 'Date of Birth', type: 'date' },
      { key: 'spousePlaceOfBirth', label: 'Place of Birth', type: 'text' },
      { key: 'spouseOccupation', label: 'Occupation', type: 'text' },
      { key: 'spouseNationality', label: 'Nationality', type: 'text' },
    ],
  },
  {
    id: 'child',
    title: 'Child Details',
    fields: [
      { key: 'childName', label: 'Child Name', type: 'text' },
      { key: 'childDob', label: 'Date of Birth', type: 'date' },
      { key: 'childPlaceOfBirth', label: 'Place of Birth', type: 'text' },
    ],
  },
  {
    id: 'employment',
    title: 'Employment / Contract Details',
    fields: [
      { key: 'lastContractSignDate', label: 'Last Contract Sign Date', type: 'date' },
      { key: 'employmentOccupation', label: 'Occupation', type: 'text' },
    ],
  },
  {
    id: 'education',
    title: 'Education Details',
    fields: [{ key: 'educationInstituteName', label: 'Education / Institute Name', type: 'text' }],
  },
  {
    id: 'previousChinaVisa',
    title: 'Previous China Visa Details',
    fields: [
      { key: 'previousChinaVisaDetails', label: 'Previous China Visa Details', type: 'text' },
      { key: 'previousChinaVisaCategory', label: 'Visa Category', type: 'text' },
      { key: 'previousChinaVisaPlaceIssued', label: 'Place of Visa Issued', type: 'text' },
      { key: 'previousChinaVisaIssueDate', label: 'Visa Issue Date', type: 'date' },
      { key: 'previousChinaVisaNo', label: 'Visa No', type: 'text' },
    ],
  },
  {
    id: 'currentPassportVisa',
    title: 'Current Passport Visa Details',
    fields: [{ key: 'validVisaInPassport', label: 'Valid Visa in Passport', type: 'text' }],
  },
  {
    id: 'travelHistory',
    title: 'Travel History',
    fields: [
      {
        key: 'last12MonthsVisitedCountry',
        label: 'Last 12 Months Visited Country Name',
        type: 'text',
      },
    ],
  },
]

export function resolveApplicantAdditionalDetails(
  details: ApplicantAdditionalDetails | undefined,
): ApplicantAdditionalDetails {
  return { ...emptyApplicantAdditionalDetails(), ...details }
}
