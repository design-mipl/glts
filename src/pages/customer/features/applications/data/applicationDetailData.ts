import { GLTS_APPLICANT_IDS } from '../../../data/portalIds'

export const mockApplicants = [
  { id: GLTS_APPLICANT_IDS.priya, name: 'Priya Sharma', passport: 'Z1234567', status: 'Verified' },
  { id: GLTS_APPLICANT_IDS.jamie, name: 'Jamie Sharma', passport: 'Z7654321', status: 'Pending review' },
]

export const mockDocuments = [
  { name: 'Passport · Priya', status: 'Valid', tone: 'success' as const },
  { name: 'Applicant Photo', status: 'Uploaded', tone: 'success' as const },
  { name: 'Bank Statement', status: 'Missing', tone: 'warning' as const },
  { name: 'Travel Ticket', status: 'Missing', tone: 'warning' as const },
  { name: 'Insurance', status: 'Uploaded', tone: 'neutral' as const },
]

export const mockGlobalDocumentUploads = {
  'company-covering-letter': {
    fileName: 'Company_Covering_Letter.pdf',
    uploadedAt: '2026-05-10T08:00:00.000Z',
  },
  invitation: {
    fileName: 'Invitation_Letter.pdf',
    uploadedAt: '2026-05-10T08:05:00.000Z',
  },
  loi: {
    fileName: 'Letter_of_Invitation_LOI.pdf',
    uploadedAt: '2026-05-10T08:10:00.000Z',
  },
}

export const mockCorrections = [
  { id: 'GLTS-COR-001', field: 'Photo', reason: 'Resolution below 600×600', status: 'Open' },
]
