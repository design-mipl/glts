export type PortalHelpArticleCategory =
  | 'Applications'
  | 'Documents'
  | 'Tracking'
  | 'Marine'
  | 'Finance'
  | 'Delivery'

export interface PortalHelpArticle {
  id: string
  title: string
  description: string
  category: PortalHelpArticleCategory
  readingTimeMinutes: number
  lastUpdated: string
}

export const PORTAL_HELP_ARTICLES: PortalHelpArticle[] = [
  {
    id: 'article-first-application',
    title: 'Creating Your First Visa Application',
    description:
      'Walk through country selection, visa type, applicant details, and submission checklist for a single application.',
    category: 'Applications',
    readingTimeMinutes: 6,
    lastUpdated: '2026-03-10',
  },
  {
    id: 'article-bulk-upload',
    title: 'Bulk Applicant Upload',
    description:
      'Prepare your spreadsheet, validate mandatory fields, and upload multiple applicants in one batch.',
    category: 'Applications',
    readingTimeMinutes: 8,
    lastUpdated: '2026-03-06',
  },
  {
    id: 'article-document-upload',
    title: 'Uploading Documents Correctly',
    description:
      'File formats, size limits, naming conventions, and how to fix common document rejection reasons.',
    category: 'Documents',
    readingTimeMinutes: 5,
    lastUpdated: '2026-03-04',
  },
  {
    id: 'article-statuses',
    title: 'Understanding Application Statuses',
    description:
      'Decode each status from draft to embassy submission, including holds, corrections, and approvals.',
    category: 'Tracking',
    readingTimeMinutes: 7,
    lastUpdated: '2026-02-28',
  },
  {
    id: 'article-marine',
    title: 'Marine Workflow Process',
    description:
      'Crew upload, vessel linkage, expedited processing paths, and marine-specific document requirements.',
    category: 'Marine',
    readingTimeMinutes: 9,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'article-invoice',
    title: 'Invoice & Payment Guide',
    description:
      'View invoices, understand line items, upload payment proof, and track outstanding balances.',
    category: 'Finance',
    readingTimeMinutes: 6,
    lastUpdated: '2026-02-22',
  },
  {
    id: 'article-passport',
    title: 'Passport Delivery Process',
    description:
      'Courier dispatch, collection options, and how to track passport return after visa stamping.',
    category: 'Delivery',
    readingTimeMinutes: 4,
    lastUpdated: '2026-02-18',
  },
]
