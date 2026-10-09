export const visaGuideCategories = [
  { id: 'business', label: 'Business Visa' },
  { id: 'transit', label: 'Connecting / Transit Visa' },
  { id: 'employment', label: 'Employment Visa' },
  { id: 'seamen', label: 'Seamen Visa' },
  { id: 'tourist', label: 'Tourist Visa' },
] as const

export type VisaGuideCategoryId = (typeof visaGuideCategories)[number]['id']

export type ExpandedVisaGuideRequirements = Partial<Record<VisaGuideCategoryId, string[]>>

export function toggleVisaGuideRequirement(
  previous: ExpandedVisaGuideRequirements,
  categoryId: VisaGuideCategoryId,
  requirementId: string,
): ExpandedVisaGuideRequirements {
  const current = previous[categoryId] ?? []
  const next = current.includes(requirementId)
    ? current.filter(id => id !== requirementId)
    : [...current, requirementId]
  return { ...previous, [categoryId]: next }
}

export interface VisaGuideRequirement {
  id: string
  title: string
  summary: string
  details: string[]
}

export interface VisaGuideCategoryContent {
  description: string
  requirements: VisaGuideRequirement[]
  sourceNote: string
  manualReviewNotes?: string[]
}

export interface VisaGuideCountry {
  slug: string
  name: string
  flag: string
  bannerImage: string
  travelImage: string
  categories: Record<VisaGuideCategoryId, VisaGuideCategoryContent>
}

// Transcribed from the four user-supplied old GLTS portal screenshots. These
// statements describe historical source content, not current immigration rules.
const legacyDisclaimer = [
  'Please note GLTS has compiled the visa documentation list basis current requirements, however the Consulate/Embassy retains the rights to ask for additional documents. Applicant has to ensure that all documents are submitted as per specified requirements. Additional documents may be requested at a later stage upon request from the Consulate/Embassy.',
  'The issuance of any visa is entirely at the discretion of the issuing authority and cannot be guaranteed. In case of a visa refusal, visa fees and GLTS fees are non-refundable. Reasons for visa refusals cannot be conveyed in cases where the Consulate/Embassy have not informed GLTS of the same.',
  'Time frame advised for visa processing is subject to change and is at the sole discretion of the Consulate/Embassy. GLTS makes every effort to ensure that the visa(s) requested is (are) correct. Upon receiving documents from GLTS, the applicant is requested to verify that the visa dates cover the intended stay with the appropriate number of entries and that the passport is valid for the period abroad.',
  'Applicant is advised that holding a valid visa for any country does not automatically entitle the traveler guaranteed entry into that country. Entry into any foreign nation is the final decision of the local Immigration Authorities upon arrival.',
  'GLTS acts as a service agent only and is not liable for negligent actions or omissions of a Foreign Consular office, Passport Agency, other Government Agencies, or delivery services. GLTS shall in no event be liable for indirect claims, damages, or lost profits resulting from a failure to obtain a visa in a timely manner.',
]

// The business titles and notes come from the earlier supplied GLTS mockup.
// None of these checklists has a confirmed verification date.
const australia: VisaGuideCountry = {
  slug: 'australia',
  name: 'Australia',
  flag: '🇦🇺',
  bannerImage: '/images/visa-guide/australia-sydney-harbour.png',
  travelImage: '/images/visa-guide/australia-coast.png',
  categories: {
    business: {
      description: 'Document checklist and guidance from a legacy GLTS Business Visa reference. Please confirm the exact requirements for your application before submitting documents.',
      sourceNote: 'Legacy GLTS reference — content verification required',
      requirements: [
        {
          id: 'passport',
          title: 'Passport',
          summary: 'Original passport and copies of its pages.',
          details: ['The legacy reference requests at least six months of passport validity and a notarized copy of the full passport, including blank pages.', 'Confirm whether copies of previous passports are also needed.'],
        },
        {
          id: 'application-form',
          title: 'Visa Application Form',
          summary: 'Complete and sign the applicable application and authorization forms.',
          details: ['The legacy reference mentions Form 1415 and additional authorization or family information forms where applicable.', 'Form numbers and the submission process must be checked before use.'],
        },
        {
          id: 'photo',
          title: 'Photo Specification',
          summary: 'Recent color passport photographs on a white background.',
          details: ['The legacy reference describes two recent color photographs with a plain white background and a 35 mm × 45 mm size.', 'Confirm the current photo format and digital upload rules.'],
        },
        {
          id: 'covering-letter',
          title: 'Covering Letter',
          summary: 'A letter outlining the travel purpose, dates, and who will cover the expenses.',
          details: ['The legacy reference asks for a letter from the applicant or an authorized company signatory, on company letterhead where relevant.', 'Confirm the required addressee and letter format.'],
        },
        {
          id: 'invitation-letter',
          title: 'Invitation Letter',
          summary: 'An invitation from the Australian host or company, where applicable.',
          details: ['The legacy reference describes a host letter stating the purpose and duration of the visit, signed with the inviter’s name and designation.', 'Confirm whether evidence of business correspondence is also required.'],
        },
        {
          id: 'ticket',
          title: 'Ticket',
          summary: 'Travel booking information, if available.',
          details: ['The legacy reference lists a confirmed air ticket as not mandatory.', 'Confirm current booking expectations before paying for non-refundable travel.'],
        },
        {
          id: 'financials',
          title: 'Financials',
          summary: 'Financial evidence appropriate to the applicant’s circumstances.',
          details: ['The legacy reference mentions income tax returns, bank statements, and other financial evidence.', 'The required period and document format need verification.'],
        },
        {
          id: 'occupation',
          title: 'Proof of Occupation',
          summary: 'Evidence of current employment, business, or other occupation.',
          details: ['The legacy reference lists different supporting records for employed, self-employed, and business applicants.', 'Confirm the documents that apply to the individual applicant.'],
        },
        {
          id: 'medical-insurance',
          title: 'Medical / Insurance',
          summary: 'Health or insurance evidence may be requested in some cases.',
          details: ['The legacy reference mentions health insurance and medical evidence for certain applicants.', 'Whether either is needed must be confirmed for the applicant’s circumstances.'],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          summary: 'Review the current requirements before applying.',
          details: ['The legacy GLTS checklist may be incomplete or outdated. Requirements can change, and the relevant authority may request additional documents.'],
        },
      ],
    },
    transit: {
      description: 'Historical GLTS document list for an Australia connecting or transit visa. Confirm every item against the current rules before applying.',
      sourceNote: 'Old GLTS portal: Connecting / Transit Visa screenshot — not currently verified',
      requirements: [
        {
          id: 'passport',
          title: 'Passport',
          summary: 'Original passport with at least six months of validity and a notarized copy of all pages.',
          details: ['The old checklist asks for the original passport with a minimum of six months’ validity and a notarized copy of the full passport, including blank pages.', 'Check with the GLTS team whether copies of old passports are also required.'],
        },
        {
          id: 'application-form',
          title: 'Visa Application Form',
          summary: 'Legacy Form 876 and authorization Form 956A.',
          details: ['Visa Application Form 876 was to be duly filled and signed by the applicant.', 'Authorization Form 956A was to be duly filled and signed to authorize an agent to submit and collect documents on the applicant’s behalf. The current form process needs verification.'],
        },
        {
          id: 'photo',
          title: 'Photo Specification',
          summary: 'Two recent 35 mm × 45 mm color passport photographs.',
          details: ['The old checklist specifies a matt or semi-matt finish, 60%–80% face coverage, a plain background, and no border.', 'Confirm the current photograph specification before submission.'],
        },
        {
          id: 'covering-letter',
          title: 'Covering Letter',
          summary: 'Company letterhead with the applicant’s details and transit purpose.',
          details: ['The old checklist asks for a letter on the company’s letterhead stating the applicant’s name, designation, passport number, purpose, and duration of visit.', 'It was to be signed by an authorized signatory and addressed to the Visa Officer, Australian High Commission, New Delhi.'],
        },
        {
          id: 'ticket',
          title: 'Ticket',
          summary: 'Confirmed flight reservation showing the transit port of entry in Australia.',
          details: ['The old checklist specifies a ticket reservation with all flights confirmed, proving that the transit port of entry is Australia.'],
        },
        {
          id: 'financials',
          title: 'Financials',
          summary: 'Case-specific financial documents may be requested.',
          details: ['The old checklist says the Embassy may ask for financial documents on a case-specific basis: bank statements for the last six months, in original with the bank’s seal and signature; income tax returns for the last three years; and business or employment proof.'],
        },
        {
          id: 'valid-visa',
          title: 'Valid Visa',
          summary: 'A valid visa for the main destination was listed.',
          details: ['The old checklist says the applicant should have a valid visa for the main destination.', 'Its note describes transit through Australia for no longer than 72 hours and a processing time of at least 7 to 15 working days. These historical limits and timelines require current verification.'],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          summary: 'Legacy GLTS notice on additional documents, decisions, timing, and liability.',
          details: legacyDisclaimer,
        },
        {
          id: 'insurance',
          title: 'Insurance',
          summary: 'Legacy text refers to Member States and EUR 30,000 coverage; manual review required.',
          details: ['The screenshot says insurance should be valid throughout the territory of the “Member States” and cover the entire intended stay or transit, with minimum coverage of EUR 30,000. It says multiple-entry applicants may prove adequate travel medical insurance for the first intended visit.', 'Manual review: this language appears to concern a different jurisdiction and must not be relied on as an Australia transit requirement.'],
        },
        {
          id: 'self-employed',
          title: 'Self Employed',
          summary: 'Evidence of an established business for a self-employed applicant.',
          details: ['The old checklist lists a letter from a lawyer or chartered accountant, or confirmation from a Chamber of Commerce, together with evidence of the established business and the company registration certificate.'],
        },
      ],
      manualReviewNotes: ['The Insurance paragraph names “Member States” and EUR 30,000, which may have been pasted from another jurisdiction in the old portal.'],
    },
    employment: {
      description: 'Historical GLTS employment visa document list for Australia. Forms and health conditions in this source need current verification.',
      sourceNote: 'Old GLTS portal: Employment Visa screenshot — trailing duplicate Form 876/photo text needs manual review',
      requirements: [
        {
          id: 'passport',
          title: 'Passport',
          summary: 'Original passport and notarized copy of the full passport.',
          details: ['The old checklist requests at least six months’ passport validity and a notarized copy of the full passport, including blank pages.', 'Check with GLTS whether old passport copies are also required.'],
        },
        {
          id: 'application-form',
          title: 'Visa Application Form',
          summary: 'Legacy Forms 1066, 956A, 1196S, 1196N, 1281, and possibly 1229.',
          details: ['Form 1066 was to be duly filled and signed by the applicant.', 'The screenshot also lists authorization Form 956A for an agent to submit and collect documents; company sponsorship and nomination Forms 1196S and 1196N; and Value Statement Form 1281.', 'Form 1229 was listed if children were accompanying their parents. All form numbers and applicability need current verification.'],
        },
        {
          id: 'photo',
          title: 'Photo Specification',
          summary: 'Two recent 35 mm × 45 mm color passport photographs.',
          details: ['The old checklist specifies a matt or semi-matt finish, 60%–80% face coverage, a white background, and no border.'],
        },
        {
          id: 'covering-letter',
          title: 'Covering Letter',
          summary: 'Company letterhead stating the applicant’s details and purpose of visit.',
          details: ['The screenshot asks for a covering letter from the applicant or an authorized company signatory on company letterhead, stating the applicant’s name, designation, passport number, purpose, and duration of visit.', 'It was to be signed by an authorized signatory and addressed to the Visa Officer, Australian High Commission, New Delhi.'],
        },
        {
          id: 'employment-proof',
          title: 'Employment Proof',
          summary: 'Appointment letter and earlier employment details.',
          details: ['The old checklist lists an appointment letter and details of earlier employment.'],
        },
        {
          id: 'financials',
          title: 'Financials',
          summary: 'Three months of salary slips and six months of personal bank statements.',
          details: ['The screenshot specifies salary slips for the last three months and a personal bank statement for the last six months, in original with the bank’s seal and signature.'],
        },
        {
          id: 'certificates',
          title: 'Certificates',
          summary: 'Educational and professional certificates plus applicant bio-data.',
          details: ['The old checklist lists originals and photocopies of all relevant educational and professional certificates, and the applicant’s bio-data.'],
        },
        {
          id: 'ticket',
          title: 'Ticket',
          summary: 'Confirmed air ticket was listed as not mandatory.',
          details: ['The screenshot says “Confirmed Air Ticket (not mandatory).”'],
        },
        {
          id: 'aged-over-75',
          title: 'If Aged Over 75 Years',
          summary: 'Legacy age-specific insurance and health-check conditions.',
          details: ['For applicants over 75, the screenshot says DIAC would request evidence of health insurance for the entire stay and an “Aged Visitor Health Check” completed by a DIAC-appointed panel doctor.', 'Manual review: this visitor-specific wording appears on an Employment Visa screenshot and its current relevance must be confirmed.'],
        },
        {
          id: 'medical',
          title: 'Medical',
          summary: 'The old checklist lists circumstances in which a medical examination may be requested.',
          details: ['The screenshot says an Embassy-authorized panel doctor may be requested if the applicant is aged 75 or above, plans to stay more than three months, is entering a hospital, is likely to enter a hospital, health-care setting or classroom, is likely to work in a child-care centre, or is likely to work as a doctor, dentist, nurse, or paramedic (including students of those professions).', 'It advises applicants to use the then-new electronic medical service and complete “My Health Declarations” before lodging a visa application. The historical link shown is http://www.immi.gov.au/allforms/health-requirements/my-health-declarations.htm. Confirm current health rules and the current official link.'],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          summary: 'Legacy GLTS notice on additional documents, decisions, timing, and liability.',
          details: legacyDisclaimer,
        },
      ],
      manualReviewNotes: [
        'After the Employment Visa disclaimer, the screenshot repeats “Visa Application Form” with Form 876 and Form 956A, followed by another “Photo Specification” line. Form 876 also appears in the Connecting / Transit screenshot. These two trailing fragments are preserved here for manual review rather than inserted into the Employment checklist as duplicate requirements.',
        'The “If Aged Over 75 Years” entry uses visitor-specific wording despite appearing on the Employment screenshot.',
      ],
    },
    seamen: {
      description: 'Historical GLTS document list for crew travelling to Australia. Confirm the checklist and document formats before applying.',
      sourceNote: 'Old GLTS portal: Seamen Visa screenshot — not currently verified',
      requirements: [
        {
          id: 'passport',
          title: 'Passport',
          summary: 'Passport copy with at least six months of validity and copies of stamped pages.',
          details: ['The screenshot requests a passport copy with a minimum of six months’ validity and a copy of all stamped pages.'],
        },
        {
          id: 'covering-letter',
          title: 'Covering Letter',
          summary: 'Letter from the authorized company signatory on company letterhead.',
          details: ['The old checklist asks for a letter stating the applicant’s name, designation, passport number, purpose, and duration of visit.', 'It was to be signed by an authorized signatory and addressed to the Visa Officer, Australian High Commission, New Delhi.'],
        },
        {
          id: 'invitation-letter',
          title: 'Invitation Letter',
          summary: 'Invitation from the Australian host or inviting company.',
          details: ['The screenshot asks for a letter on the Australian host or company’s letterhead stating the travel purpose and duration of stay, signed with the signatory’s name and designation.'],
        },
        {
          id: 'ticket',
          title: 'Ticket',
          summary: 'Confirmed air ticket.',
          details: ['The old checklist states “Confirmed Air Ticket.”'],
        },
        {
          id: 'financials',
          title: 'Financials',
          summary: 'Six months of personal bank statements and a contract copy.',
          details: ['The screenshot lists a personal bank statement for the last six months mentioning the bank’s name and telephone number, plus a contract copy.'],
        },
        {
          id: 'original-cdc',
          title: 'Original CDC',
          summary: 'Original CDC listed as a separate document.',
          details: ['The old checklist contains the standalone line “Original CDC.” The screenshot gives no further specification; confirm whether this means the Continuous Discharge Certificate and whether a copy is also required.'],
        },
        {
          id: 'mcv-copy',
          title: 'MCV Copy',
          summary: 'MCV copy listed as a separate document.',
          details: ['The old checklist contains the standalone line “MCV copy.” It does not expand the abbreviation or specify a format; manual review is required.'],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          summary: 'Legacy GLTS notice on additional documents, decisions, timing, and liability.',
          details: legacyDisclaimer,
        },
        {
          id: 'photo',
          title: 'Photo Specification',
          summary: 'Two recent 35 mm × 45 mm color passport photographs.',
          details: ['The screenshot lists a matt or semi-matt finish, 80% face coverage, a white background, and no border. This entry appears after the disclaimer in the legacy page.'],
        },
        {
          id: 'government-id',
          title: 'Government ID Card Copy',
          summary: 'Aadhar card copy.',
          details: ['The screenshot states “Aadhar card copy.” The exact identity-document requirement should be confirmed.'],
        },
        {
          id: 'documents-required',
          title: 'Documents Required',
          summary: 'Signed contract copy and passenger contact details.',
          details: ['The old checklist asks for a contract copy duly signed by the applicant, plus the passenger’s contact number and email address. This entry appears after the disclaimer in the legacy page.'],
        },
      ],
      manualReviewNotes: ['The screenshot does not expand “MCV” and gives no details for “Original CDC”; confirm both document names and formats.'],
    },
    tourist: {
      description: 'Historical GLTS visitor visa document list for Australia. Confirm applicable documents, forms, fees, and health conditions before applying.',
      sourceNote: 'Old GLTS portal: Tourist Visa screenshot — not currently verified',
      requirements: [
        {
          id: 'passport',
          title: 'Passport',
          summary: 'Original passport and notarized copy of the full passport.',
          details: ['The old checklist asks for at least six months’ passport validity and a notarized copy of the full passport, including blank pages.', 'Check with GLTS whether old passport copies are also required.'],
        },
        {
          id: 'application-form',
          title: 'Visa Application Form',
          summary: 'Legacy Form 1419, Family Information Form, and authorization Form 956A.',
          details: ['Form 1419 was to be duly filled and signed by the applicant. The Family Information Form was also to be filled and signed.', 'Authorization Form 956A was to be filled and signed to authorize an agent to submit and collect documents on the applicant’s behalf. Confirm current forms and submission method.'],
        },
        {
          id: 'photo',
          title: 'Photo Specification',
          summary: 'Two recent 35 mm × 45 mm passport photographs.',
          details: ['The screenshot specifies a matt or semi-matt finish, 60%–80% face coverage, a white background, and no border.'],
        },
        {
          id: 'covering-letter',
          title: 'Covering Letter',
          summary: 'A letter stating the applicant’s details, travel purpose, and duration.',
          details: ['The old checklist asks for a letter on business letterhead mentioning the applicant’s name, designation, passport number, purpose, and duration of visit.', 'It was to be signed by an authorized signatory with a company stamp and addressed to the Visa Officer, Australian High Commission, New Delhi.'],
        },
        {
          id: 'invitation-letter',
          title: 'Invitation Letter',
          summary: 'For visits to relatives or friends, an invitation and host details.',
          details: ['If visiting relatives or friends in Australia, the screenshot asks for an invitation from the relative or friend and proof of the host’s legal status in Australia, such as passport and visa copies.', 'If that person is paying for the visit, it also lists the host’s bank statement for the last three months, residence proof, and employment proof.'],
        },
        {
          id: 'ticket',
          title: 'Ticket',
          summary: 'Ticket itinerary, tour itinerary, and tour confirmation.',
          details: ['The screenshot lists ticket itinerary, tour itinerary, and tour confirmation.'],
        },
        {
          id: 'accommodation',
          title: 'Proof of Accommodation',
          summary: 'Hotel confirmation.',
          details: ['The old checklist states “Hotel Confirmation.”'],
        },
        {
          id: 'financials',
          title: 'Financials',
          summary: 'Tax, salary, bank, and travel-fund records according to work status.',
          details: ['If employed: personal income tax returns for the last three years; salary slips for the last three months; personal bank statements for the last six months showing the bank’s name and telephone number; and a credit card copy, foreign-exchange endorsement, or traveller’s cheque.', 'If self-employed: personal and company income tax returns for the last three years; personal and company bank statements for the last six months showing the bank’s name and telephone number; and a credit card copy, foreign-exchange endorsement, or traveller’s cheque.'],
        },
        {
          id: 'occupation',
          title: 'Proof of Occupation',
          summary: 'Company records or employment and academic records, as applicable.',
          details: ['If self-employed: company registration certificate or certificate of incorporation; brief company profile; articles of memorandum if the applicant is a managing director or director; proof of proprietorship or partnership if applicable; and an import/export licence if applicable.', 'If employed: copies of academic certificates and an appointment letter showing the joining date, designation, and salary drawn, plus previous work history.'],
        },
        {
          id: 'minor-travelling-alone',
          title: 'Individuals / Children (Minor) Travelling Alone',
          summary: 'Additional records for a child travelling without one or both parents or guardians.',
          details: ['For a child under 18 whose Australia stay would not be in the company of either or both parents or guardians, the old checklist lists Form 1229, a consent or no-objection letter, passport or election-card copies of both parents to confirm signatures, and the parents’ proof of financial solvency, occupation, and income tax returns.'],
        },
        {
          id: 'aged-over-75',
          title: 'If Aged Over 75 Years',
          summary: 'Legacy travel insurance and health-check conditions.',
          details: ['The screenshot says 12 months of medical or travel insurance is required and, if aged over 75, an “Aged Visitor Health Check” completed by a DIAC-appointed panel doctor.', 'It also says DIAC would request a chest X-ray for a stay over three months or a hospital visit for any reason. Applicants were advised to complete “My Health Declarations” before lodging the application. The historical link shown is http://www.immi.gov.au/allforms/health-requirements/my-health-declarations.htm. Confirm current rules and the current official link.'],
        },
        {
          id: 'priority-service',
          title: 'Premium Service for Priority Processing',
          summary: 'Historical fast-track service details and fee; manual verification required.',
          details: ['The screenshot says Indian Tourist and Business Visitor (Subclass 600) applicants could request priority processing for an additional fee. It lists INR 50,500 (AUD 1,000), a 48-hour processing timeline from receipt by the Australian High Commission, a 10:00 a.m. submission cut-off, and availability at Australian visa application centres except Cochin.', 'It says the fee was additional to visa application fees, subject to eligibility and legal, health, character, and security checks, and non-refundable if the application was delayed or refused by DIBP.', 'Manual review: these are historical commercial terms. The screenshot mentions a “Fast Track” link but does not provide its destination. Do not treat the listed price, turnaround, or availability as current.'],
        },
        {
          id: 'disclaimer',
          title: 'Disclaimer',
          summary: 'Legacy GLTS notice on additional documents, decisions, timing, and liability.',
          details: legacyDisclaimer,
        },
      ],
      manualReviewNotes: ['The screenshot’s priority-processing fee, cut-off, timeline, and centre availability are historical and require direct confirmation; the “Fast Track” link target is not visible.'],
    },
  },
}

export const visaGuideCountries: Record<string, VisaGuideCountry> = {
  [australia.slug]: australia,
}

export function getVisaGuideCountry(slug?: string): VisaGuideCountry | undefined {
  return visaGuideCountries[slug || 'australia']
}
