import type { PortalFaqCategory } from './portalFaqCategories'

export type PortalFaqSortOption = 'newest' | 'most_viewed' | 'alphabetical'

export interface PortalFaqItem {
  id: string
  question: string
  answer: string
  category: PortalFaqCategory
  lastUpdated: string
  viewCount: number
}

export const PORTAL_FAQS: PortalFaqItem[] = [
  {
    id: 'faq-track-application',
    question: 'How do I track my visa application?',
    answer:
      'Open Application management, select your application, or use the Tracking page with your application ID to view the current status, embassy updates, and timeline milestones.',
    category: 'Tracking',
    lastUpdated: '2026-03-12',
    viewCount: 1842,
  },
  {
    id: 'faq-submit-documents',
    question: 'How do I submit documents for an application?',
    answer:
      'From Application management, open the application and follow the document checklist. Upload required files directly in the applicant workflow. Supported formats include PDF, JPG, and PNG up to 10 MB per file.',
    category: 'Document Upload',
    lastUpdated: '2026-03-08',
    viewCount: 1560,
  },
  {
    id: 'faq-billing-access',
    question: 'Who can access invoice and payment information?',
    answer:
      'Corporate accounts with billing access can view invoices and payments under Invoice & payments in the sidebar. Super Admins and Finance users typically have full access; bookers may have read-only or no access depending on role settings.',
    category: 'Billing & Payments',
    lastUpdated: '2026-02-28',
    viewCount: 920,
  },
  {
    id: 'faq-manage-bookers',
    question: 'How do I add or manage bookers and admins?',
    answer:
      'Corporate admins can manage users under User management. Add bookers with scoped permissions, reset access, or deactivate accounts. Access depends on your assigned role and permissions.',
    category: 'Corporate Users',
    lastUpdated: '2026-02-20',
    viewCount: 740,
  },
  {
    id: 'faq-application-hold',
    question: 'What should I do if my application is on hold?',
    answer:
      'Review the hold reason on the application detail page, upload any requested documents, and contact support if you need clarification. Holds are often resolved once missing information is provided.',
    category: 'Applications',
    lastUpdated: '2026-03-01',
    viewCount: 1105,
  },
  {
    id: 'faq-reset-password',
    question: 'How do I reset my portal password?',
    answer:
      'Use Forgot password on the sign-in page. A reset link is sent to your registered email. If you no longer have access to that email, contact your corporate admin or GLTS support to verify your account.',
    category: 'Account',
    lastUpdated: '2026-01-15',
    viewCount: 680,
  },
  {
    id: 'faq-bulk-upload',
    question: 'Can I create multiple applications at once?',
    answer:
      'Yes. Corporate users can use bulk application upload from Application management. Download the template, fill applicant details, and upload the spreadsheet to create multiple applications in one batch.',
    category: 'Applications',
    lastUpdated: '2026-02-10',
    viewCount: 890,
  },
  {
    id: 'faq-passport-delivery',
    question: 'How does passport delivery work after visa approval?',
    answer:
      'Once your passport is ready, you will see a delivery status update on the application. Choose courier pickup or office collection based on your agreement. Tracking details appear on the application detail page.',
    category: 'Passport Delivery',
    lastUpdated: '2026-03-05',
    viewCount: 620,
  },
  {
    id: 'faq-payment-methods',
    question: 'Which payment methods are accepted for invoices?',
    answer:
      'Invoices can be paid via bank transfer, UPI, or approved corporate credit terms. Upload payment proof from the invoice detail page. Finance teams verify payments before applications proceed to the next stage.',
    category: 'Billing & Payments',
    lastUpdated: '2026-02-25',
    viewCount: 540,
  },
  {
    id: 'faq-corporate-roles',
    question: 'What is the difference between Admin and Booker roles?',
    answer:
      'Admins manage users, billing configuration, and master data. Bookers create and manage applications within assigned scopes. Super Admins have full account access including exports and user management.',
    category: 'Corporate Users',
    lastUpdated: '2026-01-28',
    viewCount: 430,
  },
]
