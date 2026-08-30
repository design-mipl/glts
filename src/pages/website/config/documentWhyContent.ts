/**
 * Trust copy for “Why we ask” drawers — keyed by document master id / name heuristics.
 */

export interface DocumentWhyContent {
  title: string
  why: string
  format: string
}

const BY_DOCUMENT_ID: Record<string, DocumentWhyContent> = {
  passport: {
    title: 'Passport',
    why: 'The consulate needs a clear bio-page scan to verify identity, nationality, and remaining validity against your travel dates.',
    format:
      'Colour scan of the bio-data page. Passport should be valid at least 6 months beyond travel, with blank pages if a sticker visa is required.',
  },
  photo: {
    title: 'Photograph',
    why: 'Embassy systems and visa stickers use a compliant portrait. Wrong size or background is a common rejection reason.',
    format: 'Recent passport-size photo (typically 35×45 mm), plain light background, face clearly visible, no filters.',
  },
  photograph: {
    title: 'Photograph',
    why: 'Embassy systems and visa stickers use a compliant portrait. Wrong size or background is a common rejection reason.',
    format: 'Recent passport-size photo (typically 35×45 mm), plain light background, face clearly visible, no filters.',
  },
  bank: {
    title: 'Bank statement',
    why: 'Consulates use recent statements to confirm you can fund the trip and return — gaps or insufficient balance raise follow-ups.',
    format: 'Last 3 months from the same account, PDF preferred, name matching the passport, continuous date range.',
  },
  bank_statement: {
    title: 'Bank statement',
    why: 'Consulates use recent statements to confirm you can fund the trip and return — gaps or insufficient balance raise follow-ups.',
    format: 'Last 3 months from the same account, PDF preferred, name matching the passport, continuous date range.',
  },
  bank_statements: {
    title: 'Bank statements',
    why: 'Consulates use recent statements to confirm you can fund the trip and return — gaps or insufficient balance raise follow-ups.',
    format: 'Last 3 months from the same account, PDF preferred, name matching the passport, continuous date range.',
  },
  bank_balance_certificate: {
    title: 'Bank balance certificate',
    why: 'Some embassies require a bank-issued balance letter in addition to statements to prove funds on a specific date.',
    format: 'Official certificate on bank letterhead, recent (usually within 7–15 days), matching the account holder name on the passport.',
  },
  travel_ticket: {
    title: 'Travel ticket',
    why: 'Entry and exit dates must align with the visa requested and other supporting documents.',
    format: 'Confirmed booking or provisional itinerary showing passenger name, route, and dates matching your application.',
  },
  invitation: {
    title: 'Invitation letter',
    why: 'Business and visit categories often require host confirmation of purpose, dates, and who covers costs.',
    format: 'Signed letter on host letterhead (or embassy template where specified), with contact details and travel dates.',
  },
  flight: {
    title: 'Flight itinerary',
    why: 'Entry and exit dates must align with the visa requested and other supporting documents.',
    format: 'Confirmed booking or provisional itinerary showing passenger name, route, and dates matching your application.',
  },
  hotel: {
    title: 'Accommodation proof',
    why: 'Consulates check that your first-night stay matches what you declare on the form — mismatches trigger clarification.',
    format: 'Booking confirmation with traveller name, address, and stay dates covering the trip (or first night at minimum).',
  },
  insurance: {
    title: 'Travel insurance',
    why: 'Many destinations require minimum medical coverage for the full stay before they will issue a visa.',
    format: 'Policy certificate covering the full trip dates, with required medical coverage amount for the destination.',
  },
}

const BY_NAME_KEYWORD: Array<{ match: RegExp; content: DocumentWhyContent }> = [
  {
    match: /passport/i,
    content: BY_DOCUMENT_ID.passport,
  },
  {
    match: /photo|photograph/i,
    content: BY_DOCUMENT_ID.photo,
  },
  {
    match: /bank/i,
    content: BY_DOCUMENT_ID.bank_statement,
  },
  {
    match: /invitation/i,
    content: BY_DOCUMENT_ID.invitation,
  },
  {
    match: /flight|ticket|itinerary/i,
    content: BY_DOCUMENT_ID.flight,
  },
  {
    match: /hotel|accommodation|stay/i,
    content: BY_DOCUMENT_ID.hotel,
  },
  {
    match: /insurance/i,
    content: BY_DOCUMENT_ID.insurance,
  },
]

export function resolveDocumentWhyContent(input: {
  documentId?: string
  name: string
  description?: string
}): DocumentWhyContent {
  const idKey = input.documentId?.trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (idKey && BY_DOCUMENT_ID[idKey]) return BY_DOCUMENT_ID[idKey]

  for (const entry of BY_NAME_KEYWORD) {
    if (entry.match.test(input.name)) return { ...entry.content, title: input.name }
  }

  return {
    title: input.name,
    why:
      input.description?.trim() ||
      'The consulate uses this document to verify your identity, travel purpose, or financial readiness before deciding on your visa.',
    format:
      'Upload a clear, complete copy (PDF or image). Names and dates should match your passport and application answers.',
  }
}
