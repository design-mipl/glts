import {
  GLTS_ACTION_IDS,
  GLTS_APPLICATION_IDS,
  GLTS_INVOICE_ID,
  GLTS_NOTIFICATION_IDS,
} from '../../../data/portalIds'

export interface PendingAction {
  id: string
  title: string
  description: string
  cta: string
  urgent?: boolean
  applicationId?: string
}

export interface CustomerNotification {
  id: string
  title: string
  time: string
  read?: boolean
}

export const dashboardKpis = [
  { label: 'Active applications', value: '3', sub: '+1 this week', tone: 'indigo' as const },
  { label: 'Pending corrections', value: '1', sub: 'by Mar 14', tone: 'amber' as const },
  { label: 'In progress', value: '2', sub: 'avg 9d embassy', tone: 'blue' as const },
  { label: 'Completed this year', value: '7', sub: '+200% vs 2025', tone: 'green' as const },
]

export const pendingActions: PendingAction[] = [
  {
    id: GLTS_ACTION_IDS.bankStatements,
    title: 'Upload bank statements',
    description: `Schengen · Type C · ${GLTS_APPLICATION_IDS.schengen}`,
    cta: 'Upload',
    urgent: true,
    applicationId: GLTS_APPLICATION_IDS.schengen,
  },
  {
    id: GLTS_ACTION_IDS.retakePhoto,
    title: 'Retake applicant photo',
    description: 'Japan eVisa — resolution too low',
    cta: 'Retake',
    urgent: true,
    applicationId: GLTS_APPLICATION_IDS.japan,
  },
  {
    id: GLTS_ACTION_IDS.biometrics,
    title: 'Confirm Mumbai biometrics slot',
    description: 'VFS · Mar 18 · 11:00am',
    cta: 'Confirm',
    applicationId: GLTS_APPLICATION_IDS.schengen,
  },
]

export const mockNotifications: CustomerNotification[] = [
  {
    id: GLTS_NOTIFICATION_IDS.embassy,
    title: `Embassy received ${GLTS_APPLICATION_IDS.schengen}`,
    time: '2h ago',
  },
  {
    id: GLTS_NOTIFICATION_IDS.documentRejected,
    title: 'Document rejected — photo quality',
    time: '1d ago',
  },
  {
    id: GLTS_NOTIFICATION_IDS.invoice,
    title: `Invoice ${GLTS_INVOICE_ID} ready`,
    time: '2d ago',
    read: true,
  },
]
