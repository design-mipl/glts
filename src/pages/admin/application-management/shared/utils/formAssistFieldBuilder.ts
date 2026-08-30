import { readApplicationFlowDraftFromSession } from '@/pages/customer/features/applications/utils/applicationFlowDraftStorage'
import type { FlowDraftLikeState } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { getSingleApplicationFlowExtras } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { SingleApplicationFlowExtras } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import { resolveApplicantAdditionalDetails } from '@/pages/customer/features/applications/config/applicantAdditionalDetailsConfig'
import {
  ensureRowBasicDetails,
  resolveApplicantBasicDetails,
} from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'

export interface FormAssistField {
  id: string
  label: string
  value: string
}

export interface FormAssistFieldSection {
  id: string
  title: string
  fields: FormAssistField[]
}

interface CatalogFieldDef {
  id: string
  label: string
}

interface CatalogSectionDef {
  id: string
  title: string
  fields: CatalogFieldDef[]
}

export interface FormAssistStepDefinition {
  id: string
  label: string
}

/** Canonical copy-assist steps (Submission is appended separately and always visible). */
export const FORM_ASSIST_COPY_STEPS: FormAssistStepDefinition[] = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'passport', label: 'Passport & Identity' },
  { id: 'travel', label: 'Travel Details' },
  { id: 'accommodation', label: 'Accommodation & Invitation' },
  { id: 'employment', label: 'Employment & Financial' },
  { id: 'family', label: 'Family & Relationships' },
  { id: 'immigration', label: 'Immigration & Legal' },
  { id: 'medical', label: 'Medical & Insurance' },
  { id: 'education', label: 'Education' },
  { id: 'maritime', label: 'Maritime / Crew Details' },
  { id: 'declaration', label: 'Declaration & Consent' },
]

export const FORM_ASSIST_SUBMISSION_STEP: FormAssistStepDefinition = {
  id: 'submission',
  label: 'Submission & Payment',
}

/** Full catalog including submission — used as the static step registry. */
export const GENERIC_FORM_ASSIST_STEPS: FormAssistStepDefinition[] = [
  ...FORM_ASSIST_COPY_STEPS,
  FORM_ASSIST_SUBMISSION_STEP,
]

const FORM_ASSIST_COPY_STEP_IDS = new Set(FORM_ASSIST_COPY_STEPS.map(step => step.id))

/** Full field taxonomy shown in form assist (values filled when available, otherwise —). */
const FORM_ASSIST_CATALOG: Record<string, CatalogSectionDef[]> = {
  personal: [
    {
      id: 'personal-details',
      title: 'Personal Details',
      fields: [
        { id: 'applicantFirstName', label: 'Applicant First Name' },
        { id: 'applicantMiddleName', label: 'Applicant Middle Name' },
        { id: 'applicantLastName', label: 'Applicant Last Name' },
        { id: 'applicantName', label: 'Applicant Name' },
        { id: 'applicantDateOfBirth', label: 'Applicant Date of Birth' },
        { id: 'applicantGender', label: 'Applicant Gender' },
        { id: 'applicantMaritalStatus', label: 'Applicant Marital Status' },
        { id: 'applicantNationality', label: 'Applicant Nationality' },
        { id: 'applicantCountryOfBirth', label: 'Applicant Country of Birth' },
        { id: 'applicantStateOfBirth', label: 'Applicant State/Province of Birth' },
        { id: 'applicantCityOfBirth', label: 'Applicant City of Birth' },
        { id: 'applicantPlaceOfBirth', label: 'Applicant Place of Birth' },
      ],
    },
    {
      id: 'contact-details',
      title: 'Contact Details',
      fields: [
        { id: 'applicantPhoneNumber', label: 'Applicant Phone Number' },
        { id: 'applicantMobileNumber', label: 'Applicant Mobile Number' },
        { id: 'applicantEmail', label: 'Applicant Email' },
      ],
    },
    {
      id: 'address-details',
      title: 'Address Details',
      fields: [
        { id: 'applicantResidentialAddress', label: 'Applicant Residential Address' },
        { id: 'applicantCity', label: 'Applicant City' },
        { id: 'applicantStateProvince', label: 'Applicant State/Province' },
        { id: 'applicantPostalCode', label: 'Applicant Postal Code' },
        { id: 'applicantCountry', label: 'Applicant Country' },
      ],
    },
  ],
  passport: [
    {
      id: 'passport-details',
      title: 'Passport Details',
      fields: [
        { id: 'passportDocumentType', label: 'Passport Document Type' },
        { id: 'passportNumber', label: 'Passport Number' },
        { id: 'passportDocumentNumber', label: 'Passport Document Number' },
        { id: 'passportIssuingCountry', label: 'Passport Issuing Country' },
        { id: 'passportPlaceOfIssue', label: 'Passport Place of Issue' },
        { id: 'passportIssueDate', label: 'Passport Issue Date' },
        { id: 'passportExpiryDate', label: 'Passport Expiry Date' },
        { id: 'passportIssuingAuthority', label: 'Passport Issuing Authority' },
        { id: 'previousPassportNumber', label: 'Previous Passport Number' },
        { id: 'previousPassportIssuingCountry', label: 'Previous Passport Issuing Country' },
        { id: 'previousPassportPlaceOfIssue', label: 'Previous Passport Place of Issue' },
        { id: 'previousPassportIssueDate', label: 'Previous Passport Issue Date' },
        { id: 'previousPassportExpiryDate', label: 'Previous Passport Expiry Date' },
        { id: 'previousPassportAvailable', label: 'Previous Passport Available' },
      ],
    },
    {
      id: 'identity-details',
      title: 'Identity Details',
      fields: [
        { id: 'nationalIdentityNumber', label: 'Applicant National Identity Number' },
        { id: 'nationalIdIssueDate', label: 'National ID Issue Date' },
        { id: 'nationalIdExpiryDate', label: 'National ID Expiry Date' },
        { id: 'aadhaarNumber', label: 'Applicant Aadhaar Number' },
        { id: 'panNumber', label: 'Applicant PAN Number' },
        { id: 'drivingLicenceNumber', label: 'Applicant Driving Licence Number' },
        { id: 'birthCertificateNumber', label: 'Birth Certificate Number' },
        { id: 'marriageCertificateNumber', label: 'Marriage Certificate Number' },
        { id: 'otherIdentityDocumentType', label: 'Other Identity Document Type' },
        { id: 'otherIdentityDocumentNumber', label: 'Other Identity Document Number' },
        { id: 'otherIdentityDocumentIssueDate', label: 'Other Identity Document Issue Date' },
        { id: 'otherIdentityDocumentExpiryDate', label: 'Other Identity Document Expiry Date' },
        { id: 'otherIdentityDocumentIssuingCountry', label: 'Other Identity Document Issuing Country' },
        { id: 'otherIdentityDocumentIssuingAuthority', label: 'Other Identity Document Issuing Authority' },
      ],
    },
    {
      id: 'travel-document-details',
      title: 'Travel Document Details',
      fields: [
        { id: 'previousPassportTravelDocumentNumber', label: 'Previous Passport/Travel Document Number' },
        { id: 'previousPassportTravelDocumentType', label: 'Previous Passport/Travel Document Type' },
        { id: 'previousPassportTravelDocumentDetails', label: 'Previous Passport/Travel Document Details' },
        { id: 'previousImmigrationDocumentDetails', label: 'Previous Immigration Document Details' },
        { id: 'previousVisaTravelDocumentDetails', label: 'Previous Visa / Travel Document Details' },
        { id: 'previousTaiwanTravelDocumentDetails', label: 'Previous Taiwan Travel Document Details' },
      ],
    },
  ],
  travel: [
    {
      id: 'travel-details',
      title: 'Travel Details',
      fields: [
        { id: 'purposeOfVisit', label: 'Purpose of Visit' },
        { id: 'intendedArrivalDate', label: 'Intended Arrival Date' },
        { id: 'intendedDepartureDate', label: 'Intended Departure Date' },
        { id: 'arrivalDate', label: 'Arrival Date' },
        { id: 'departureDate', label: 'Departure Date' },
        { id: 'plannedArrivalDate', label: 'Planned Arrival Date' },
        { id: 'travelDate', label: 'Travel Date' },
        { id: 'travelDates', label: 'Travel Dates' },
        { id: 'intendedLengthOfStay', label: 'Intended Length of Stay' },
        { id: 'intendedStay', label: 'Intended Stay' },
        { id: 'destination', label: 'Destination' },
        { id: 'destinationCity', label: 'Destination City' },
        { id: 'departureCity', label: 'Departure City' },
        { id: 'firstEntry', label: 'First Entry' },
        { id: 'portOfEntry', label: 'Port of Entry' },
        { id: 'portOfDeparture', label: 'Port of Departure' },
        { id: 'expectedEntryDate', label: 'Expected Entry Date' },
        { id: 'expectedEntryFlightVessel', label: 'Expected Entry Flight/Vessel Number' },
        { id: 'travelCommencementCountry', label: 'Travel Commencement Country' },
        { id: 'lastCityAirport', label: 'Last City/Airport' },
        { id: 'transitDate', label: 'Transit Date' },
        { id: 'transitRoute', label: 'Transit Route' },
        { id: 'departurePort', label: 'Departure Port' },
        { id: 'joiningDateTravel', label: 'Joining Date' },
        { id: 'previousTravelDetails', label: 'Previous Travel Details' },
        { id: 'previousTravelHistory', label: 'Previous Travel History' },
        { id: 'previousStayDetails', label: 'Previous Stay Details' },
        { id: 'plannedActivities', label: 'Planned Activities' },
      ],
    },
    {
      id: 'transportation-details',
      title: 'Transportation Details',
      fields: [
        { id: 'arrivalFlightNumber', label: 'Arrival Flight Number' },
        { id: 'departureFlightNumber', label: 'Departure Flight Number' },
        { id: 'flightNumber', label: 'Flight Number' },
        { id: 'flightDetails', label: 'Flight Details' },
        { id: 'meansOfTransport', label: 'Means of Transport' },
        { id: 'incomingAirline', label: 'Incoming Airline' },
        { id: 'incomingFlightNumber', label: 'Incoming Flight Number' },
        { id: 'arrivalAirport', label: 'Arrival Airport' },
        { id: 'airlineShipName', label: 'Airline / Ship Name' },
        { id: 'shipName', label: 'Ship Name' },
        { id: 'entryFlightVesselNumber', label: 'Entry Flight / Vessel Number' },
        { id: 'entryVesselNumber', label: 'Entry Vessel Number' },
        { id: 'vesselNameTravel', label: 'Vessel Name' },
        { id: 'vesselIdTravel', label: 'Vessel ID' },
        { id: 'vesselIdImoTravel', label: 'Vessel ID / IMO' },
        { id: 'flightTrainShipNumber', label: 'Flight/Train/Ship Number' },
        { id: 'trainNumber', label: 'Train Number' },
        { id: 'transportDetails', label: 'Transport Details' },
      ],
    },
  ],
  accommodation: [
    {
      id: 'accommodation-details',
      title: 'Accommodation Details',
      fields: [
        { id: 'accommodationType', label: 'Accommodation Type' },
        { id: 'accommodationName', label: 'Accommodation Name' },
        { id: 'hotelName', label: 'Hotel Name' },
        { id: 'hotelHostName', label: 'Hotel / Host Name' },
        { id: 'placeOfStay', label: 'Place of Stay' },
        { id: 'accommodationAddress', label: 'Accommodation Address' },
        { id: 'accommodationCity', label: 'Accommodation City' },
        { id: 'accommodationProvinceState', label: 'Accommodation Province/State' },
        { id: 'accommodationPostalCode', label: 'Accommodation Postal Code' },
        { id: 'accommodationCountry', label: 'Accommodation Country' },
        { id: 'buildingName', label: 'Building Name' },
        { id: 'blockHouseNumber', label: 'Block/House Number' },
        { id: 'floorNumber', label: 'Floor Number' },
        { id: 'unitNumber', label: 'Unit Number' },
        { id: 'checkInDate', label: 'Check-in Date' },
        { id: 'checkOutDate', label: 'Check-out Date' },
        { id: 'stayDates', label: 'Stay Dates' },
        { id: 'accommodationDetails', label: 'Accommodation Details' },
      ],
    },
    {
      id: 'host-inviter-details',
      title: 'Host / Inviter Details',
      fields: [
        { id: 'hostFirstName', label: 'Host First Name' },
        { id: 'hostMiddleName', label: 'Host Middle Name' },
        { id: 'hostLastName', label: 'Host Last Name' },
        { id: 'hostGender', label: 'Host Gender' },
        { id: 'contactPersonFirstName', label: 'Contact Person First Name' },
        { id: 'contactPersonMiddleName', label: 'Contact Person Middle Name' },
        { id: 'contactPersonLastName', label: 'Contact Person Last Name' },
        { id: 'contactPersonPhoneNumber', label: 'Contact Person Phone Number' },
        { id: 'contactPersonMobileNumber', label: 'Contact Person Mobile Number' },
        { id: 'contactPersonAddress', label: 'Contact Person Address' },
        { id: 'cityCounty', label: 'City/County' },
        { id: 'inviterFirstName', label: 'Inviter First Name' },
        { id: 'inviterMiddleName', label: 'Inviter Middle Name' },
        { id: 'inviterLastName', label: 'Inviter Last Name' },
        { id: 'inviterPhoneNumber', label: 'Inviter Phone Number' },
        { id: 'inviterEmail', label: 'Inviter Email' },
        { id: 'inviterAddress', label: 'Inviter Address' },
        { id: 'inviterCity', label: 'Inviter City' },
        { id: 'inviterProvinceState', label: 'Inviter Province/State' },
        { id: 'inviterPostalCode', label: 'Inviter Postal Code' },
        { id: 'inviterCountry', label: 'Inviter Country' },
      ],
    },
    {
      id: 'guarantor-details',
      title: 'Guarantor Details',
      fields: [
        { id: 'guarantorName', label: 'Guarantor Name' },
        { id: 'guarantorFirstName', label: 'Guarantor First Name' },
        { id: 'guarantorMiddleName', label: 'Guarantor Middle Name' },
        { id: 'guarantorLastName', label: 'Guarantor Last Name' },
        { id: 'guarantorDob', label: 'Guarantor DOB' },
        { id: 'guarantorGender', label: 'Guarantor Gender' },
        { id: 'guarantorNationality', label: 'Guarantor Nationality' },
        { id: 'guarantorOccupation', label: 'Guarantor Occupation' },
        { id: 'guarantorAddress', label: 'Guarantor Address' },
        { id: 'guarantorTelephone', label: 'Guarantor Telephone' },
        { id: 'guarantorImmigrationStatus', label: 'Guarantor Immigration Status' },
      ],
    },
    {
      id: 'sponsorship-details',
      title: 'Sponsorship Details',
      fields: [
        { id: 'sponsorName', label: 'Sponsor Name' },
        { id: 'sponsorOccupationEmployer', label: 'Sponsor Occupation / Employer' },
        { id: 'sponsorImmigrationStatus', label: 'Sponsor Immigration Status' },
        { id: 'sponsorOrganisation', label: 'Sponsor Organisation' },
        { id: 'sponsorshipAmount', label: 'Sponsorship Amount' },
        { id: 'fundingDetails', label: 'Funding Details' },
        { id: 'financialResponsibility', label: 'Financial Responsibility' },
        { id: 'sponsorshipDetails', label: 'Sponsorship Details' },
        { id: 'sponsorshipStatement', label: 'Sponsorship Statement' },
        { id: 'guaranteeStatement', label: 'Guarantee Statement' },
      ],
    },
    {
      id: 'relationship-details-accommodation',
      title: 'Relationship Details',
      fields: [
        { id: 'relationshipToApplicant', label: 'Relationship to Applicant' },
        { id: 'spouseRelationship', label: 'Spouse Relationship' },
        { id: 'spousePartnerRelationship', label: 'Spouse/Partner Relationship' },
        { id: 'partnerRelationship', label: 'Partner Relationship' },
        { id: 'parentChildRelationship', label: 'Parent-Child Relationship' },
      ],
    },
  ],
  employment: [
    {
      id: 'employment-details',
      title: 'Employment Details',
      fields: [
        { id: 'occupation', label: 'Occupation' },
        { id: 'position', label: 'Position' },
        { id: 'jobTitle', label: 'Job Title' },
        { id: 'jobPosition', label: 'Job/Position' },
        { id: 'designation', label: 'Designation' },
        { id: 'profession', label: 'Profession' },
        { id: 'employmentStatus', label: 'Employment Status' },
        { id: 'employmentStartDate', label: 'Employment Start Date' },
        { id: 'employmentEndDate', label: 'Employment End Date' },
        { id: 'employmentDates', label: 'Employment Dates' },
        { id: 'employmentPeriod', label: 'Employment Period' },
        { id: 'jobDuties', label: 'Job Duties' },
        { id: 'employmentDetails', label: 'Employment Details' },
        { id: 'employmentBusinessStatus', label: 'Employment/Business Status' },
        { id: 'employmentAssignmentStatus', label: 'Employment/Assignment Status' },
        { id: 'supervisorFirstName', label: 'Supervisor First Name' },
        { id: 'supervisorMiddleName', label: 'Supervisor Middle Name' },
        { id: 'supervisorLastName', label: 'Supervisor Last Name' },
        { id: 'supervisorPhone', label: 'Supervisor Phone' },
        { id: 'seaCrewPosition', label: 'Sea Crew Position' },
        { id: 'seaCrewJobTitle', label: 'Sea Crew Job Title' },
        { id: 'seaCrewPositionRank', label: 'Sea Crew Position / Rank' },
        { id: 'crewPosition', label: 'Crew Position' },
        { id: 'crewPositionRank', label: 'Crew Position / Rank' },
      ],
    },
    {
      id: 'employer-details',
      title: 'Employer Details',
      fields: [
        { id: 'employerName', label: 'Employer Name' },
        { id: 'employerAddress', label: 'Employer Address' },
        { id: 'employerCity', label: 'Employer City' },
        { id: 'employerZipPostalCode', label: 'Employer ZIP/Postal Code' },
        { id: 'employerTelephone', label: 'Employer Telephone' },
        { id: 'employerPhone', label: 'Employer Phone' },
        { id: 'employerContact', label: 'Employer Contact' },
        { id: 'shippingCompanyEmployment', label: 'Shipping Company' },
        { id: 'shippingCompanyContactEmployment', label: 'Shipping Company Contact' },
        { id: 'companyContact', label: 'Company Contact' },
      ],
    },
    {
      id: 'financial-details',
      title: 'Financial Details',
      fields: [
        { id: 'fundingSource', label: 'Funding Source' },
        { id: 'estimatedTravelCost', label: 'Estimated Travel Cost' },
        { id: 'travelCost', label: 'Travel Cost' },
        { id: 'accountBalance', label: 'Account Balance' },
        { id: 'income', label: 'Income' },
        { id: 'sponsorshipAmountFinancial', label: 'Sponsorship Amount' },
        { id: 'salary', label: 'Salary' },
        { id: 'salaryPeriod', label: 'Salary Period' },
        { id: 'monthlySalary', label: 'Monthly Salary' },
        { id: 'annualIncome', label: 'Annual Income' },
        { id: 'financialResponsibilityEmployment', label: 'Financial Responsibility' },
        { id: 'sponsorshipDetailsFinancial', label: 'Sponsorship Details' },
        { id: 'fundingDetailsFinancial', label: 'Funding Details' },
      ],
    },
    {
      id: 'organisation-details',
      title: 'Organisation Details',
      fields: [
        { id: 'organisationName', label: 'Organisation Name' },
        { id: 'organisationNumber', label: 'Organisation Number' },
        { id: 'organisationAddress', label: 'Organisation Address' },
        { id: 'organisationContact', label: 'Organisation Contact' },
        { id: 'organisationHost', label: 'Organisation / Host' },
        { id: 'organisationHostAddress', label: 'Organisation / Host Address' },
        { id: 'organisationHostDetails', label: 'Organisation / Host Details' },
        { id: 'businessDetails', label: 'Business Details' },
        { id: 'businessActivity', label: 'Business Activity' },
        { id: 'invitingOrganisation', label: 'Inviting Organisation' },
        { id: 'sponsorOrganisationEmployment', label: 'Sponsor Organisation' },
      ],
    },
  ],
  family: [
    {
      id: 'family-details',
      title: 'Family Details',
      fields: [
        { id: 'fatherFirstName', label: 'Father First Name' },
        { id: 'fatherMiddleName', label: 'Father Middle Name' },
        { id: 'fatherLastName', label: 'Father Last Name' },
        { id: 'motherFirstName', label: "Mother's First Name" },
        { id: 'motherMiddleName', label: "Mother's Middle Name" },
        { id: 'motherLastName', label: "Mother's Last Name" },
        { id: 'spouseFirstName', label: 'Spouse First Name' },
        { id: 'spouseMiddleName', label: 'Spouse Middle Name' },
        { id: 'spouseLastName', label: 'Spouse Last Name' },
        { id: 'spouseName', label: 'Spouse Name' },
        { id: 'spouseDob', label: 'Spouse DOB' },
        { id: 'spouseGender', label: 'Spouse Gender' },
        { id: 'spouseNationality', label: 'Spouse Nationality' },
        { id: 'spouseCountryOfBirth', label: 'Spouse Country of Birth' },
        { id: 'spousePlaceOfBirth', label: 'Spouse Place of Birth' },
        { id: 'spouseDetails', label: 'Spouse Details' },
        { id: 'partnerName', label: 'Partner Name' },
        { id: 'partnerDob', label: 'Partner DOB' },
        { id: 'partnerGender', label: 'Partner Gender' },
        { id: 'partnerNationality', label: 'Partner Nationality' },
        { id: 'partnerDetails', label: 'Partner Details' },
        { id: 'childName', label: 'Child Name' },
        { id: 'childDob', label: 'Child DOB' },
        { id: 'childNationality', label: 'Child Nationality' },
        { id: 'childDetails', label: 'Child Details' },
        { id: 'familyMemberName', label: 'Family Member Name' },
        { id: 'familyMemberDob', label: 'Family Member DOB' },
        { id: 'familyMemberNationality', label: 'Family Member Nationality' },
        { id: 'familyMemberDetails', label: 'Family Member Details' },
      ],
    },
    {
      id: 'relationship-details-family',
      title: 'Relationship Details',
      fields: [
        { id: 'relationshipToApplicantFamily', label: 'Relationship to Applicant' },
        { id: 'spouseRelationshipFamily', label: 'Spouse Relationship' },
        { id: 'spousePartnerRelationshipFamily', label: 'Spouse/Partner Relationship' },
        { id: 'partnerRelationshipFamily', label: 'Partner Relationship' },
        { id: 'parentChildRelationshipFamily', label: 'Parent-Child Relationship' },
      ],
    },
    {
      id: 'address-details-family',
      title: 'Address Details',
      fields: [
        { id: 'spouseAddress', label: 'Spouse Address' },
        { id: 'partnerAddress', label: 'Partner Address' },
        { id: 'childAddress', label: 'Child Address' },
        { id: 'familyAddress', label: 'Family Address' },
      ],
    },
  ],
  immigration: [
    {
      id: 'immigration-visa-details',
      title: 'Immigration / Visa Details',
      fields: [
        { id: 'visaType', label: 'Visa Type' },
        { id: 'visaNumber', label: 'Visa Number' },
        { id: 'previousVisaNumber', label: 'Previous Visa Number' },
        { id: 'previousVisaType', label: 'Previous Visa Type' },
        { id: 'visaIssueDate', label: 'Visa Issue Date' },
        { id: 'visaExpiryDate', label: 'Visa Expiry Date' },
        { id: 'previousVisaDetails', label: 'Previous Visa Details' },
        { id: 'previousVisaFingerprintCaptureDate', label: 'Previous Visa / Fingerprint Capture Date' },
        { id: 'australianVisaGrantNumber', label: 'Australian Visa Grant Number' },
        { id: 'visaGrantNumber', label: 'Visa Grant Number' },
        { id: 'visaGrantDate', label: 'Visa Grant Date' },
        { id: 'grantDate', label: 'Grant Date' },
        { id: 'visaConditions', label: 'Visa Conditions' },
        { id: 'immigrationStatus', label: 'Immigration Status' },
        { id: 'permissionToStay', label: 'Permission to Stay' },
        { id: 'permitNumber', label: 'Permit Number' },
        { id: 'permitType', label: 'Permit Type' },
        { id: 'validity', label: 'Validity' },
        { id: 'residencePermitNumber', label: 'Residence Permit Number' },
        { id: 'residenceCountry', label: 'Residence Country' },
        { id: 'residenceStatus', label: 'Residence Status' },
        { id: 'permanentResidenceStatus', label: 'Permanent Residence Status' },
        { id: 'residencePermitIdNumber', label: 'Residence Permit / ID Number' },
        { id: 'leaveToRemainDetails', label: 'Leave to Remain Details' },
        { id: 'previousApplicationDetails', label: 'Previous Application Details' },
        { id: 'applicationReference', label: 'Application Reference' },
        { id: 'supportingVisaCountry', label: 'Supporting Visa Country' },
        { id: 'supportingVisaResidenceDetails', label: 'Supporting Visa / Residence Details' },
        { id: 'previousImmigrationDetails', label: 'Previous Immigration Details' },
        { id: 'visaRefusal', label: 'Visa Refusal' },
        { id: 'refusalDate', label: 'Refusal Date' },
        { id: 'refusalReason', label: 'Refusal Reason' },
        { id: 'visaCancellation', label: 'Visa Cancellation' },
        { id: 'refusalCancellationDate', label: 'Refusal/Cancellation Date' },
        { id: 'immigrationReference', label: 'Immigration Reference' },
        { id: 'removalStatus', label: 'Removal Status' },
      ],
    },
    {
      id: 'legal-character-details',
      title: 'Legal / Character Details',
      fields: [
        { id: 'criminalRecordStatus', label: 'Criminal Record Status' },
        { id: 'criminalRecord', label: 'Criminal Record' },
        { id: 'clearanceStatus', label: 'Clearance Status' },
        { id: 'offenceDetails', label: 'Offence Details' },
        { id: 'convictionDetails', label: 'Conviction Details' },
        { id: 'convictionDate', label: 'Conviction Date' },
        { id: 'caseNumber', label: 'Case Number' },
        { id: 'caseStatus', label: 'Case Status' },
        { id: 'judgementDetails', label: 'Judgement Details' },
        { id: 'courtDecision', label: 'Court Decision' },
        { id: 'sentence', label: 'Sentence' },
        { id: 'removalDetails', label: 'Removal Details' },
        { id: 'removalReason', label: 'Removal Reason' },
        { id: 'deportationDetails', label: 'Deportation Details' },
        { id: 'militaryServiceHistory', label: 'Military Service History' },
        { id: 'serviceHistory', label: 'Service History' },
      ],
    },
    {
      id: 'military-security-details',
      title: 'Military / Security Details',
      fields: [
        { id: 'militaryService', label: 'Military Service' },
        { id: 'militaryPoliceIntelligenceService', label: 'Military/Police/Intelligence Service' },
        { id: 'armedForces', label: 'Armed Forces' },
        { id: 'government', label: 'Government' },
        { id: 'securityService', label: 'Security Service' },
        { id: 'militaryRank', label: 'Rank' },
        { id: 'militaryOrganisation', label: 'Organisation' },
        { id: 'serviceDates', label: 'Service Dates' },
        { id: 'militaryServiceOrganisation', label: 'Military/Service Organisation' },
        { id: 'militaryServiceDetails', label: 'Military/Service Details' },
      ],
    },
    {
      id: 'address-details-immigration',
      title: 'Address Details',
      fields: [
        { id: 'courtApplicantAddress', label: 'Court / Applicant Address' },
        { id: 'previousCountryAddress', label: 'Previous Country / Address' },
      ],
    },
  ],
  medical: [
    {
      id: 'medical-details',
      title: 'Medical Details',
      fields: [
        { id: 'examinationDate', label: 'Examination Date' },
        { id: 'medicalResult', label: 'Medical Result' },
        { id: 'medicalConditions', label: 'Medical Conditions' },
        { id: 'infectiousDiseaseStatus', label: 'Infectious Disease Status' },
        { id: 'tbStatus', label: 'TB Status' },
        { id: 'chestXRayResult', label: 'Chest X-Ray Result' },
        { id: 'vaccineName', label: 'Vaccine Name' },
        { id: 'vaccinationDate', label: 'Vaccination Date' },
      ],
    },
    {
      id: 'medical-document-details',
      title: 'Medical Document Details',
      fields: [
        { id: 'medicalCertificateNumber', label: 'Medical Certificate Number' },
        { id: 'certificateNumber', label: 'Certificate Number' },
        { id: 'medicalIssueDate', label: 'Issue Date' },
      ],
    },
    {
      id: 'medical-provider-details',
      title: 'Medical Provider Details',
      fields: [
        { id: 'doctorClinicName', label: 'Doctor / Clinic Name' },
        { id: 'medicalProvider', label: 'Medical Provider' },
      ],
    },
    {
      id: 'insurance-details',
      title: 'Insurance Details',
      fields: [
        { id: 'policyNumber', label: 'Policy Number' },
        { id: 'insuranceProvider', label: 'Insurance Provider' },
        { id: 'insuranceCompany', label: 'Insurance Company' },
        { id: 'coverageAmount', label: 'Coverage Amount' },
        { id: 'insuranceStartDate', label: 'Start Date' },
        { id: 'insuranceEndDate', label: 'End Date' },
        { id: 'coveredDestination', label: 'Covered Destination' },
      ],
    },
  ],
  education: [
    {
      id: 'education-details',
      title: 'Education Details',
      fields: [
        { id: 'highestQualification', label: 'Highest Qualification' },
        { id: 'qualification', label: 'Qualification' },
        { id: 'academicQualification', label: 'Academic Qualification' },
        { id: 'institutionName', label: 'Institution Name' },
        { id: 'institutionAddress', label: 'Institution Address' },
        { id: 'institutionCity', label: 'Institution City' },
        { id: 'institutionStateProvince', label: 'Institution State/Province' },
        { id: 'institutionCountry', label: 'Institution Country' },
        { id: 'degree', label: 'Degree' },
        { id: 'major', label: 'Major' },
        { id: 'fieldOfStudy', label: 'Field of Study' },
        { id: 'courseFieldOfStudy', label: 'Course/Field of Study' },
        { id: 'course', label: 'Course' },
        { id: 'educationStartDate', label: 'Education Start Date' },
        { id: 'educationCompletionDate', label: 'Education Completion Date' },
        { id: 'educationEndDate', label: 'Education End Date' },
        { id: 'educationDates', label: 'Education Dates' },
        { id: 'enrollmentStatus', label: 'Enrollment Status' },
        { id: 'studentId', label: 'Student ID' },
        { id: 'studentStatus', label: 'Student Status' },
      ],
    },
  ],
  maritime: [
    {
      id: 'maritime-details',
      title: 'Maritime Details',
      fields: [
        { id: 'seamanBookNumber', label: 'Seaman Book Number' },
        { id: 'seamanStatus', label: 'Seaman Status' },
        { id: 'crewPositionMaritime', label: 'Crew Position' },
        { id: 'crewPositionRankMaritime', label: 'Crew Position / Rank' },
        { id: 'seaCrewPositionMaritime', label: 'Sea Crew Position' },
        { id: 'seaCrewPositionRankMaritime', label: 'Sea Crew Position / Rank' },
        { id: 'vesselName', label: 'Vessel Name' },
        { id: 'vesselId', label: 'Vessel ID' },
        { id: 'vesselIdImo', label: 'Vessel ID / IMO' },
        { id: 'vesselType', label: 'Vessel Type' },
        { id: 'countryOfRegistration', label: 'Country of Registration' },
        { id: 'vesselRegistrationDetails', label: 'Vessel Registration Details' },
        { id: 'signOnDate', label: 'Sign-on Date' },
        { id: 'signOffDate', label: 'Sign-off Date' },
        { id: 'joiningPort', label: 'Joining Port' },
        { id: 'departurePortMaritime', label: 'Departure Port' },
        { id: 'crewAssignmentStatus', label: 'Crew Assignment Status' },
        { id: 'maritimeCrewVisa', label: 'Maritime Crew Visa' },
        { id: 'maritimeCrewVisaReference', label: 'Maritime Crew Visa Reference' },
      ],
    },
    {
      id: 'maritime-employment-details',
      title: 'Maritime Employment Details',
      fields: [
        { id: 'crewMemberName', label: 'Crew Member Name' },
        { id: 'employmentStartDateMaritime', label: 'Employment Start Date' },
        { id: 'employmentEndDateMaritime', label: 'Employment End Date' },
        { id: 'employmentStatusMaritime', label: 'Employment Status' },
        { id: 'crewPositionMaritimeEmployment', label: 'Crew Position' },
        { id: 'seaCrewPositionMaritimeEmployment', label: 'Sea Crew Position' },
        { id: 'shippingCompany', label: 'Shipping Company' },
        { id: 'contractNumber', label: 'Contract Number' },
        { id: 'vesselNameMaritimeEmployment', label: 'Vessel Name' },
        { id: 'vesselIdImoMaritimeEmployment', label: 'Vessel ID / IMO' },
        { id: 'crewAssignmentStatusEmployment', label: 'Crew Assignment Status' },
        { id: 'employmentAssignmentStatusMaritime', label: 'Employment / Assignment Status' },
      ],
    },
    {
      id: 'maritime-travel-details',
      title: 'Maritime Travel Details',
      fields: [
        { id: 'joiningDate', label: 'Joining Date' },
        { id: 'departureDateMaritime', label: 'Departure Date' },
        { id: 'signOnDateTravel', label: 'Sign-on Date' },
        { id: 'signOffDateTravel', label: 'Sign-off Date' },
        { id: 'joiningPortTravel', label: 'Joining Port' },
        { id: 'departurePortTravel', label: 'Departure Port' },
        { id: 'portOfDepartureMaritime', label: 'Port of Departure' },
        { id: 'portOfEntryMaritime', label: 'Port of Entry' },
      ],
    },
    {
      id: 'maritime-company-details',
      title: 'Maritime Company Details',
      fields: [
        { id: 'shippingCompanyCompany', label: 'Shipping Company' },
        { id: 'shippingCompanyContact', label: 'Shipping Company Contact' },
        { id: 'companyContactMaritime', label: 'Company Contact' },
        { id: 'contractNumberCompany', label: 'Contract Number' },
        { id: 'vesselRegistrationDetailsCompany', label: 'Vessel Registration Details' },
      ],
    },
  ],
  declaration: [
    {
      id: 'declaration-details',
      title: 'Declaration Details',
      fields: [
        { id: 'applicantStatement', label: 'Applicant Statement' },
        { id: 'applicantExplanation', label: 'Applicant Explanation' },
        { id: 'declarationResponses', label: 'Declaration Responses' },
        { id: 'declaration', label: 'Declaration' },
        { id: 'consent', label: 'Consent' },
        { id: 'declarationDate', label: 'Declaration Date' },
        { id: 'applicationDate', label: 'Application Date' },
        { id: 'applicantSignature', label: 'Applicant Signature' },
        { id: 'signature', label: 'Signature' },
        { id: 'signatureDate', label: 'Signature / Date' },
        { id: 'biometricConsent', label: 'Biometric Consent' },
        { id: 'privacyConsent', label: 'Privacy Consent' },
        { id: 'immigrationDataConsent', label: 'Immigration / Data Consent' },
        { id: 'biometricApplicationConsent', label: 'Biometric / Application Consent' },
        { id: 'visaApplicationConsent', label: 'Visa / Application Consent' },
        { id: 'immigrationVisaConsent', label: 'Immigration / Visa Consent' },
      ],
    },
  ],
}

export interface FormAssistContext {
  row: UploadQueueRow
  detail: ApplicationDetailViewModel
  flowExtras?: {
    entityName?: string
    location?: string
    billingAddress?: string
    vesselName?: string
    imoNumber?: string
    joiningPort?: string
    poCidNo?: string
    compassNo?: string
    issuedPassportState?: string
    placeOfResidence?: string
    jurisdiction?: string
  }
}

const PLACEHOLDER = '—'

function display(value: string | undefined | null): string {
  const trimmed = (value ?? '').trim()
  return trimmed.length === 0 || trimmed === PLACEHOLDER ? PLACEHOLDER : trimmed
}

function resolveKnownValues(ctx: FormAssistContext): Record<string, string> {
  const row = ensureRowBasicDetails(ctx.row)
  const basic = resolveApplicantBasicDetails(row)
  const additional = resolveApplicantAdditionalDetails(row.additionalDetails)
  const app = ctx.detail.application
  const extras = ctx.flowExtras ?? {}

  const phone = additional.paxContactNo || basic.phoneNumber
  const email = additional.paxEmailId || basic.email
  const applicantName = basic.applicantName || row.travelerName
  const nationality = basic.nationality || row.nationality
  const passportNo = basic.passportNumber || row.passportNo
  const occupation = additional.employmentOccupation || basic.designation
  const rank = basic.rank
  const designation = basic.designation

  return {
    applicantName: display(applicantName),
    applicantDateOfBirth: display(basic.dateOfBirth),
    applicantNationality: display(nationality),
    applicantPhoneNumber: display(basic.phoneNumber || phone),
    applicantMobileNumber: display(additional.paxContactNo || phone),
    applicantEmail: display(email),
    applicantResidentialAddress: display(extras.placeOfResidence),

    passportNumber: display(passportNo),
    passportDocumentNumber: display(passportNo),
    passportExpiryDate: display(row.expiry),
    passportPlaceOfIssue: display(extras.issuedPassportState),

    travelDate: display(app?.travelDate),
    destination: display(app?.country),
    previousTravelHistory: display(additional.last12MonthsVisitedCountry),

    occupation: display(occupation),
    designation: display(designation),
    crewPositionRank: display(rank),
    seaCrewPositionRank: display(rank),
    crewPosition: display(rank),
    employmentStartDate: display(additional.lastContractSignDate),
    organisationName: display(extras.entityName),
    organisationAddress: display(extras.location),
    organisationHostAddress: display(extras.billingAddress),
    employerName: display(extras.entityName),
    employerAddress: display(extras.location),
    shippingCompanyEmployment: display(extras.entityName),

    fatherLastName: display(additional.fatherName),
    motherLastName: display(additional.motherName),
    spouseName: display(additional.spouseName),
    spouseDob: display(additional.spouseDob),
    spouseNationality: display(additional.spouseNationality),
    spousePlaceOfBirth: display(additional.spousePlaceOfBirth),
    childName: display(additional.childName),
    childDob: display(additional.childDob),
    childDetails: display(additional.childPlaceOfBirth),

    visaType: display(app?.visaType),
    applicationReference: display(app?.jurisdiction ?? extras.jurisdiction),
    previousVisaDetails: display(additional.previousChinaVisaDetails),
    previousVisaType: display(additional.previousChinaVisaCategory),
    visaIssueDate: display(additional.previousChinaVisaIssueDate),
    previousVisaNumber: display(additional.previousChinaVisaNo),
    previousVisaTravelDocumentDetails: display(
      additional.previousChinaVisaPlaceIssued || additional.validVisaInPassport,
    ),

    institutionName: display(additional.educationInstituteName),

    seamanBookNumber: display(basic.cdcNumber),
    crewPositionRankMaritime: display(rank),
    seaCrewPositionRankMaritime: display(rank),
    vesselName: display(extras.vesselName),
    vesselIdImo: display(extras.imoNumber),
    vesselId: display(extras.imoNumber),
    joiningPort: display(extras.joiningPort),
    joiningPortTravel: display(extras.joiningPort),
    crewMemberName: display(applicantName),
    employmentStartDateMaritime: display(additional.lastContractSignDate),
    shippingCompany: display(extras.entityName),
    shippingCompanyCompany: display(extras.entityName),
    contractNumber: display(extras.poCidNo),
    contractNumberCompany: display(extras.poCidNo),
    joiningDate: display(additional.lastContractSignDate),
    joiningDateTravel: display(additional.lastContractSignDate),
    shippingCompanyContact: display(extras.location),
    maritimeCrewVisaReference: display(extras.compassNo),
    vesselNameMaritimeEmployment: display(extras.vesselName),
    vesselIdImoMaritimeEmployment: display(extras.imoNumber),
    vesselNameTravel: display(extras.vesselName),
    vesselIdImoTravel: display(extras.imoNumber),
  }
}

export function buildFormAssistFieldsForStep(
  stepId: string,
  ctx: FormAssistContext,
): FormAssistField[] {
  const sections = FORM_ASSIST_CATALOG[stepId]
  if (!sections) return []

  const known = resolveKnownValues(ctx)
  return sections.flatMap(section =>
    section.fields.map(def => ({
      id: def.id,
      label: def.label,
      value: known[def.id] ?? PLACEHOLDER,
    })),
  )
}

export function buildFormAssistFieldSectionsForStep(
  stepId: string,
  ctx: FormAssistContext,
): FormAssistFieldSection[] {
  if (stepId === 'submission') return []
  const sections = FORM_ASSIST_CATALOG[stepId]
  if (!sections) return []

  const known = resolveKnownValues(ctx)
  return sections.map(section => ({
    id: section.id,
    title: section.title,
    fields: section.fields.map(def => ({
      id: def.id,
      label: def.label,
      value: known[def.id] ?? PLACEHOLDER,
    })),
  }))
}

/**
 * Full step list for the form-assist nav.
 * Always returns every taxonomy step + Submission (no data/document filtering yet).
 */
export function resolveVisibleFormAssistSteps(
  _ctx?: FormAssistContext | null,
): FormAssistStepDefinition[] {
  return GENERIC_FORM_ASSIST_STEPS
}

export function collectAllFormAssistFields(ctx: FormAssistContext): FormAssistField[] {
  return FORM_ASSIST_COPY_STEPS.filter(step => FORM_ASSIST_COPY_STEP_IDS.has(step.id)).flatMap(
    step => buildFormAssistFieldsForStep(step.id, ctx),
  )
}

function readSavedFlowState(): FlowDraftLikeState | null {
  return readApplicationFlowDraftFromSession()
}

export function resolveFormAssistFlowExtras(applicationId: string): SingleApplicationFlowExtras {
  const fromSeed: SingleApplicationFlowExtras = getSingleApplicationFlowExtras(applicationId) ?? {
    entityName: '',
    location: '',
    billingAddress: '',
    vesselName: '',
    imoNumber: '',
    joiningPort: '',
    poCidNo: '',
    compassNo: '',
    issuedPassportState: '',
    placeOfResidence: '',
    jurisdiction: '',
  }
  const flowState = readSavedFlowState()
  if (!flowState) return fromSeed
  if (flowState.gltsApplicationId !== applicationId && flowState.gltsBatchId !== applicationId) {
    return fromSeed
  }
  return {
    entityName: flowState.entityName || fromSeed.entityName,
    location: flowState.location || fromSeed.location,
    billingAddress: flowState.billingAddress || fromSeed.billingAddress,
    vesselName: flowState.vesselName || fromSeed.vesselName,
    imoNumber: flowState.imoNumber || fromSeed.imoNumber,
    joiningPort: flowState.joiningPort || fromSeed.joiningPort,
    poCidNo: flowState.poCidNo || fromSeed.poCidNo,
    compassNo: flowState.compassNo || fromSeed.compassNo,
    issuedPassportState: flowState.issuedPassportState || fromSeed.issuedPassportState,
    placeOfResidence: flowState.placeOfResidence || fromSeed.placeOfResidence,
    jurisdiction: flowState.jurisdiction || fromSeed.jurisdiction,
  }
}
