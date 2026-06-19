/** Minimal valid PDF bytes — mock template placeholder for demo uploads. */
const MOCK_PDF_DATA_URI =
  'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA0Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoxNzMKJSVFT0YK'

export interface MockDocumentSample {
  fileName: string
  url: string
}

function mockSample(fileName: string): MockDocumentSample {
  return { fileName, url: MOCK_PDF_DATA_URI }
}

/** Reusable mock sample/template files for jurisdiction document rules. */
export const MOCK_DOCUMENT_SAMPLE_TEMPLATES = {
  companyCoveringLetter: mockSample('Company-Covering-Letter-Template.pdf'),
  invitationLetter: mockSample('Invitation-Letter-Template.pdf'),
  letterOfInvitation: mockSample('Letter-of-Invitation-LOI-Template.pdf'),
  authorityLetter: mockSample('Authority-Letter-Template.pdf'),
  itrDeclaration: mockSample('ITR-Declaration-Template.pdf'),
  scheduleOfStay: mockSample('Schedule-of-Stay-Template.pdf'),
  letterOfGuarantee: mockSample('Letter-of-Guarantee-Template.pdf'),
} as const
