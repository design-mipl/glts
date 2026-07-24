/** @deprecated Use companyProfile.mock / billingAgreement.mock / personalAccount.mock */
export { mockCompanyProfileData as mockCompanyProfile } from './companyProfile.mock'
export { mockBillingAgreementData as mockAgreement } from './billingAgreement.mock'

export const mockVisaRules = {
  countries: ['Kenya', 'UAE', 'France', 'Japan', 'Singapore', 'UK'],
  visaTypes: ['Tourist', 'Business', 'Crew / Marine', 'Transit'],
  marineRules: 'CDC + seaman book mandatory for crew manifests',
  nonMarineRules: 'Standard passport + itinerary for corporate travelers',
  documents: ['Passport', 'Photo', 'Bank statements', 'Travel insurance', 'Invitation letter'],
  timelines: 'e-Visa 3–7d · Sticker 10–21d · Marine crew 5–12d',
}
