export type ApplicationChannel = 'retail' | 'corporate' | 'marine'
export type SlaStatus = 'on_track' | 'at_risk' | 'breached'
export type Priority = 'high' | 'medium' | 'low'
export type PipelineProgress = 'on_track' | 'at_risk' | 'delayed'
export type AlertPriority = 'critical' | 'high' | 'medium'

export interface DashboardFilters {
  dateRange: [Date | null, Date | null]
  country: string
  applicationType: string
}

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  dateRange: [null, null],
  country: 'all',
  applicationType: 'all',
}

export const COUNTRY_FILTER_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'Germany', value: 'Germany' },
]

export const APPLICATION_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export interface DashboardKpiMetric {
  id: string
  label: string
  value: number
  subtitle: string
  delta: number
  deltaLabel: string
  accent: 'primary' | 'success' | 'warning' | 'error' | 'info'
  iconKey: string
}

export interface PipelineStage {
  id: string
  label: string
  total: number
  delayed: number
  progress: PipelineProgress
}

export interface DashboardQueueRow {
  id: string
  applicationId: string
  applicant: string
  country: string
  visaType: string
  assignedTeam: string
  slaStatus: SlaStatus
  priority: Priority
  channel: ApplicationChannel
}

export interface CriticalAlert {
  id: string
  title: string
  description: string
  priority: AlertPriority
  timestamp: Date
}

export interface DashboardActivityItem {
  id: string
  user: { name: string; avatarSrc?: string }
  action: string
  target?: string
  timestamp: Date
}

export interface FinanceKpi {
  id: string
  label: string
  value: string
  subtitle: string
}

export interface RecentInvoiceRow {
  id: string
  invoiceNumber: string
  customer: string
  amount: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  channel: ApplicationChannel
}

export const DASHBOARD_KPIS: DashboardKpiMetric[] = [
  { id: 'total', label: 'Total Applications', value: 2847, subtitle: 'All active channels', delta: 8.4, deltaLabel: 'vs last 7 days', accent: 'primary', iconKey: 'files' },
  { id: 'in_progress', label: 'In Progress', value: 612, subtitle: 'Processing & ops lanes', delta: 4.2, deltaLabel: 'vs last 7 days', accent: 'info', iconKey: 'activity' },
  { id: 'pending_verification', label: 'Pending Verification', value: 148, subtitle: 'Document QC backlog', delta: -6.1, deltaLabel: 'vs last 7 days', accent: 'warning', iconKey: 'shield' },
  { id: 'pending_submission', label: 'Pending Submission', value: 96, subtitle: 'Ready for embassy filing', delta: 2.8, deltaLabel: 'vs last 7 days', accent: 'warning', iconKey: 'send' },
  { id: 'appointment_pending', label: 'Appointment Pending', value: 74, subtitle: 'Biometric & VAC slots', delta: -1.4, deltaLabel: 'vs last 7 days', accent: 'info', iconKey: 'calendar' },
  { id: 'completed', label: 'Completed Applications', value: 1924, subtitle: 'Delivered this quarter', delta: 11.6, deltaLabel: 'vs last 7 days', accent: 'success', iconKey: 'check' },
  { id: 'outstanding_payments', label: 'Outstanding Payments', value: 38, subtitle: 'Awaiting collection', delta: -3.5, deltaLabel: 'vs last 7 days', accent: 'error', iconKey: 'wallet' },
  { id: 'critical_cases', label: 'Critical Cases', value: 17, subtitle: 'SLA breach or escalation', delta: 1.2, deltaLabel: 'vs last 7 days', accent: 'error', iconKey: 'alert' },
]

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'draft', label: 'Draft', total: 124, delayed: 8, progress: 'on_track' },
  { id: 'documents_pending', label: 'Documents Pending', total: 186, delayed: 22, progress: 'at_risk' },
  { id: 'verification_pending', label: 'Verification Pending', total: 148, delayed: 14, progress: 'at_risk' },
  { id: 'qc_pending', label: 'QC Pending', total: 92, delayed: 6, progress: 'on_track' },
  { id: 'appointment_pending', label: 'Appointment Pending', total: 74, delayed: 9, progress: 'delayed' },
  { id: 'submission_pending', label: 'Submission Pending', total: 96, delayed: 11, progress: 'at_risk' },
  { id: 'submitted', label: 'Submitted', total: 88, delayed: 7, progress: 'on_track' },
  { id: 'embassy_processing', label: 'Embassy Processing', total: 218, delayed: 18, progress: 'on_track' },
  { id: 'collection_pending', label: 'Collection Pending', total: 78, delayed: 10, progress: 'at_risk' },
  { id: 'collected', label: 'Collected', total: 66, delayed: 4, progress: 'on_track' },
  { id: 'passport_status', label: 'Passport Status', total: 64, delayed: 3, progress: 'on_track' },
  { id: 'delivered', label: 'Delivered', total: 412, delayed: 0, progress: 'on_track' },
  { id: 'completed', label: 'Completed', total: 376, delayed: 0, progress: 'on_track' },
]

export const VERIFICATION_QUEUE: DashboardQueueRow[] = [
  { id: 'v1', applicationId: 'GLTS-2026-01482', applicant: 'Arjun Mehta', country: 'United Kingdom', visaType: 'Standard Visitor', assignedTeam: 'Retail Ops — West', slaStatus: 'at_risk', priority: 'high', channel: 'retail' },
  { id: 'v2', applicationId: 'GLTS-2026-01471', applicant: 'MV Ocean Star / Crew Batch', country: 'Singapore', visaType: 'Crew Transit', assignedTeam: 'Marine Ops', slaStatus: 'breached', priority: 'high', channel: 'marine' },
  { id: 'v3', applicationId: 'GLTS-2026-01465', applicant: 'TechNova Solutions Ltd', country: 'Germany', visaType: 'Business Schengen', assignedTeam: 'Corporate Ops', slaStatus: 'on_track', priority: 'medium', channel: 'corporate' },
  { id: 'v4', applicationId: 'GLTS-2026-01458', applicant: 'Priya Nair', country: 'United States', visaType: 'B1/B2', assignedTeam: 'Retail Ops — South', slaStatus: 'on_track', priority: 'low', channel: 'retail' },
  { id: 'v5', applicationId: 'GLTS-2026-01451', applicant: 'Harborline Shipping', country: 'United Arab Emirates', visaType: 'Crew Offshore', assignedTeam: 'Marine Ops', slaStatus: 'at_risk', priority: 'high', channel: 'marine' },
  { id: 'v6', applicationId: 'GLTS-2026-01444', applicant: 'James Okafor', country: 'United Kingdom', visaType: 'Student', assignedTeam: 'Retail Ops — West', slaStatus: 'on_track', priority: 'medium', channel: 'retail' },
]

export const SUBMISSION_QUEUE: DashboardQueueRow[] = [
  { id: 's1', applicationId: 'GLTS-2026-01439', applicant: 'Global Freight Partners', country: 'Germany', visaType: 'Business Schengen', assignedTeam: 'Corporate Ops', slaStatus: 'on_track', priority: 'medium', channel: 'corporate' },
  { id: 's2', applicationId: 'GLTS-2026-01433', applicant: 'Ananya Desai', country: 'United States', visaType: 'F1 Student', assignedTeam: 'Retail Ops — West', slaStatus: 'at_risk', priority: 'high', channel: 'retail' },
  { id: 's3', applicationId: 'GLTS-2026-01428', applicant: 'MV Pacific Dawn', country: 'Singapore', visaType: 'Crew Joining', assignedTeam: 'Marine Ops', slaStatus: 'on_track', priority: 'high', channel: 'marine' },
  { id: 's4', applicationId: 'GLTS-2026-01421', applicant: 'Rohan Kapoor', country: 'United Arab Emirates', visaType: 'Employment', assignedTeam: 'Retail Ops — North', slaStatus: 'on_track', priority: 'low', channel: 'retail' },
  { id: 's5', applicationId: 'GLTS-2026-01415', applicant: 'FinEdge Corp', country: 'United Kingdom', visaType: 'ICT Transfer', assignedTeam: 'Corporate Ops', slaStatus: 'breached', priority: 'high', channel: 'corporate' },
]

export const CORRECTION_QUEUE: DashboardQueueRow[] = [
  { id: 'c1', applicationId: 'GLTS-2026-01408', applicant: 'Sneha Pillai', country: 'United Kingdom', visaType: 'Family Visit', assignedTeam: 'Retail Ops — South', slaStatus: 'at_risk', priority: 'medium', channel: 'retail' },
  { id: 'c2', applicationId: 'GLTS-2026-01402', applicant: 'Blue Horizon Marine', country: 'United Arab Emirates', visaType: 'Crew Transit', assignedTeam: 'Marine Ops', slaStatus: 'on_track', priority: 'high', channel: 'marine' },
  { id: 'c3', applicationId: 'GLTS-2026-01396', applicant: 'Apex Logistics Group', country: 'Germany', visaType: 'Business Schengen', assignedTeam: 'Corporate Ops', slaStatus: 'on_track', priority: 'low', channel: 'corporate' },
  { id: 'c4', applicationId: 'GLTS-2026-01389', applicant: 'Michael Chen', country: 'Singapore', visaType: 'Employment Pass', assignedTeam: 'Retail Ops — East', slaStatus: 'breached', priority: 'high', channel: 'retail' },
  { id: 'c5', applicationId: 'GLTS-2026-01382', applicant: 'MV Atlantic Spirit', country: 'United States', visaType: 'Crew C1/D', assignedTeam: 'Marine Ops', slaStatus: 'at_risk', priority: 'high', channel: 'marine' },
]

export const CRITICAL_ALERTS: CriticalAlert[] = [
  { id: 'a1', title: 'Ticket booking pending', description: 'GLTS-2026-01471 — VAC slot not confirmed for 3 crew members', priority: 'critical', timestamp: new Date(Date.now() - 12 * 60000) },
  { id: 'a2', title: 'Insurance pending', description: 'GLTS-2026-01465 — Travel insurance certificate missing before submission', priority: 'high', timestamp: new Date(Date.now() - 45 * 60000) },
  { id: 'a3', title: 'SLA breached', description: 'GLTS-2026-01415 — Embassy filing window exceeded by 6 hours', priority: 'critical', timestamp: new Date(Date.now() - 2 * 3600000) },
  { id: 'a4', title: 'Missing documents', description: 'GLTS-2026-01408 — Bank statement and invitation letter required', priority: 'high', timestamp: new Date(Date.now() - 4 * 3600000) },
  { id: 'a5', title: 'Passport expiring soon', description: 'GLTS-2026-01444 — Passport validity under 6 months for UK student visa', priority: 'medium', timestamp: new Date(Date.now() - 6 * 3600000) },
]

export const RECENT_ACTIVITY: DashboardActivityItem[] = [
  { id: 'act1', user: { name: 'Riya Sharma' }, action: 'submitted application', target: 'GLTS-2026-01482', timestamp: new Date(Date.now() - 8 * 60000) },
  { id: 'act2', user: { name: 'Vikram Patel' }, action: 'generated invoice', target: 'INV-2026-0892', timestamp: new Date(Date.now() - 22 * 60000) },
  { id: 'act3', user: { name: 'Neha Kulkarni' }, action: 'raised correction', target: 'GLTS-2026-01408', timestamp: new Date(Date.now() - 55 * 60000) },
  { id: 'act4', user: { name: 'Arun Menon' }, action: 'collected passport', target: 'GLTS-2026-01370', timestamp: new Date(Date.now() - 2 * 3600000) },
  { id: 'act5', user: { name: 'Sana Iqbal' }, action: 'scheduled appointment', target: 'GLTS-2026-01433', timestamp: new Date(Date.now() - 3 * 3600000) },
  { id: 'act6', user: { name: 'Dev Mehta' }, action: 'assigned to team', target: 'GLTS-2026-01471', timestamp: new Date(Date.now() - 5 * 3600000) },
]

export const DAILY_APPLICATION_TREND = [
  { day: 'Mon', applications: 42 },
  { day: 'Tue', applications: 58 },
  { day: 'Wed', applications: 51 },
  { day: 'Thu', applications: 64 },
  { day: 'Fri', applications: 72 },
  { day: 'Sat', applications: 38 },
  { day: 'Sun', applications: 29 },
]

export const COUNTRY_APPLICATION_BARS = [
  { country: 'UK', applications: 420 },
  { country: 'US', applications: 380 },
  { country: 'UAE', applications: 310 },
  { country: 'SG', applications: 245 },
  { country: 'DE', applications: 198 },
]

export const CHANNEL_DISTRIBUTION = [
  { key: 'retail', label: 'Retail', value: 1240 },
  { key: 'corporate', label: 'Corporate', value: 680 },
  { key: 'marine', label: 'Marine', value: 927 },
]

export const FINANCE_KPIS: FinanceKpi[] = [
  { id: 'recent_invoices', label: 'Recent Invoices', value: '24', subtitle: 'Issued last 7 days' },
  { id: 'pending_collections', label: 'Pending Collections', value: '₹18.4L', subtitle: '12 accounts' },
  { id: 'overdue_payments', label: 'Overdue Payments', value: '₹4.2L', subtitle: '5 accounts' },
  { id: 'vendor_pending', label: 'Vendor Payments Pending', value: '₹9.1L', subtitle: '8 vendors' },
]

export const RECENT_INVOICES: RecentInvoiceRow[] = [
  { id: 'inv1', invoiceNumber: 'INV-2026-0892', customer: 'TechNova Solutions Ltd', amount: '₹2,45,000', status: 'pending', dueDate: '12 Jun 2026', channel: 'corporate' },
  { id: 'inv2', invoiceNumber: 'INV-2026-0887', customer: 'Harborline Shipping', amount: '₹1,12,400', status: 'paid', dueDate: '08 Jun 2026', channel: 'marine' },
  { id: 'inv3', invoiceNumber: 'INV-2026-0881', customer: 'Arjun Mehta', amount: '₹18,500', status: 'overdue', dueDate: '01 Jun 2026', channel: 'retail' },
  { id: 'inv4', invoiceNumber: 'INV-2026-0876', customer: 'Global Freight Partners', amount: '₹3,80,000', status: 'pending', dueDate: '15 Jun 2026', channel: 'corporate' },
  { id: 'inv5', invoiceNumber: 'INV-2026-0870', customer: 'MV Pacific Dawn', amount: '₹86,200', status: 'paid', dueDate: '05 Jun 2026', channel: 'marine' },
]
