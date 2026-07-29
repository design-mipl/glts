import type { SupportTicketPriority } from '@/shared/types/supportTicket'

export const SUPPORT_PRIORITY_OPTIONS: { value: SupportTicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export const SUPPORT_CATEGORY_LABELS: Record<string, string> = {
  'login-access': 'Login & Access',
  'application-creation': 'Application Creation',
  'document-upload': 'Document Upload',
  'document-verification': 'Document Verification',
  'visa-processing': 'Visa Processing',
  'appointment-biometrics': 'Appointment & Biometrics',
  'invoice-billing': 'Invoice & Billing',
  'payment-issues': 'Payment Issues',
  'passport-delivery': 'Passport Delivery',
  'technical-issue': 'Technical Issue',
  'feature-request': 'Feature Request',
  others: 'Others',
}

export const SUPPORT_SUBCATEGORIES: Record<string, string[]> = {
  'login-access': ['Password reset', 'Account locked', 'Two-factor access', 'Portal login error'],
  'application-creation': ['Single application', 'Bulk upload', 'Marine crew', 'Application draft'],
  'document-upload': ['File format issue', 'Upload failure', 'Missing document', 'Re-upload request'],
  'document-verification': ['Document rejected', 'Correction required', 'Verification delay'],
  'visa-processing': ['Embassy delay', 'Status clarification', 'Processing timeline'],
  'appointment-biometrics': ['Appointment scheduling', 'Biometrics attendance', 'Reschedule request'],
  'invoice-billing': ['Invoice query', 'Statement request', 'Billing configuration'],
  'payment-issues': ['Payment proof', 'Failed payment', 'Reconciliation'],
  'passport-delivery': ['Courier tracking', 'Collection delay', 'Wrong address'],
  'technical-issue': ['Portal error', 'Browser compatibility', 'Performance issue'],
  'feature-request': ['New feature', 'Enhancement', 'Workflow improvement'],
  others: ['General enquiry', 'Account management', 'Other'],
}

export const SUPPORT_ASSIGNEE_OPTIONS = [
  'Priya Sharma',
  'Rahul Mehta',
  'Anita Desai',
  'Vikram Singh',
  'Neha Kapoor',
]

export const MOCK_RELATED_APPLICATIONS = [
  { value: '', label: 'None' },
  { value: 'GLTS-APP-2026-847', label: 'GLTS-APP-2026-847 — Schengen Business Visa' },
  { value: 'GLTS-APP-2026-901', label: 'GLTS-APP-2026-901 — Japan Business Visa' },
  { value: 'GLTS-APP-2026-712', label: 'GLTS-APP-2026-712 — UAE Visit Visa' },
  { value: 'GLTS-MAR-1025', label: 'GLTS-MAR-1025 — Marine Crew Batch' },
]

export const MOCK_RELATED_INVOICES = [
  { value: '', label: 'None' },
  { value: 'GLTS-INV-2026-1042', label: 'GLTS-INV-2026-1042' },
  { value: 'GLTS-INV-2026-0987', label: 'GLTS-INV-2026-0987' },
  { value: 'GLTS-INV-2026-1103', label: 'GLTS-INV-2026-1103' },
]

/** Default customer identity used when raising tickets from the portal mock. */
export const DEFAULT_PORTAL_CUSTOMER_CONTEXT = {
  customerId: 'cust-demo-001',
  customerName: 'Aisha Khan',
  customerEmail: 'aisha.khan@demo-shipping.com',
  portal: 'business' as const,
  companyName: 'Demo Shipping Co.',
}
