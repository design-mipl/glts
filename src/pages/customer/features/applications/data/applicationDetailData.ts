import { GLTS_APPLICANT_IDS } from '../../../data/portalIds'

export const mockApplicants = [
  { id: GLTS_APPLICANT_IDS.priya, name: 'Priya Sharma', passport: 'Z1234567', status: 'Verified' },
  { id: GLTS_APPLICANT_IDS.jamie, name: 'Jamie Sharma', passport: 'Z7654321', status: 'Pending review' },
]

export const mockDocuments = [
  { name: 'Passport · Priya', status: 'Valid', tone: 'success' as const },
  { name: 'Bank statements', status: 'Missing', tone: 'warning' as const },
  { name: 'Travel insurance', status: 'Uploaded', tone: 'neutral' as const },
]

export const mockGlobalDocumentUploads = {
  loi: {
    fileName: 'LOI_GLTS_Company.pdf',
    uploadedAt: '2026-05-10T08:00:00.000Z',
  },
}

export const mockCorrections = [
  { id: 'GLTS-COR-001', field: 'Photo', reason: 'Resolution below 600×600', status: 'Open' },
]
