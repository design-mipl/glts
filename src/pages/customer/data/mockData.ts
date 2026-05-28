import type { ApplicationStatus } from '@/shared/types/application'
import { GLTS_APPLICATION_IDS } from './portalIds'

export interface CustomerApplication {
  id: string
  country: string
  countryFlag?: string
  visaType: string
  applicantCount: number
  status: ApplicationStatus
  statusLabel: string
  travelDate: string
  updatedAt: string
  progress?: number
  eta?: string
}

export const mockApplications: CustomerApplication[] = [
  {
    id: GLTS_APPLICATION_IDS.schengen,
    country: 'Schengen',
    countryFlag: '🇫🇷',
    visaType: 'Sticker · Type C',
    applicantCount: 3,
    status: 'in_review',
    statusLabel: 'Embassy review',
    travelDate: '2026-05-01',
    updatedAt: '2h ago',
    progress: 72,
    eta: '8 days',
  },
  {
    id: GLTS_APPLICATION_IDS.japan,
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'eVisa · Tourist',
    applicantCount: 1,
    status: 'pending_documents',
    statusLabel: 'Photo upload',
    travelDate: '2026-04-18',
    updatedAt: '1d ago',
    progress: 45,
    eta: '4 days',
  },
  {
    id: GLTS_APPLICATION_IDS.uae,
    country: 'UAE',
    countryFlag: '🇦🇪',
    visaType: 'e-Visa · 30d',
    applicantCount: 2,
    status: 'approved',
    statusLabel: 'Approved',
    travelDate: '2026-03-20',
    updatedAt: '3d ago',
    progress: 100,
    eta: '—',
  },
]

export const timelineStages = [
  { id: 'GLTS-TML-01', title: 'Application Created', status: 'completed' as const },
  { id: 'GLTS-TML-02', title: 'Verification', status: 'completed' as const },
  { id: 'GLTS-TML-03', title: 'Submission', status: 'in_progress' as const },
  { id: 'GLTS-TML-04', title: 'Embassy Processing', status: 'pending' as const },
  { id: 'GLTS-TML-05', title: 'Passport Ready', status: 'pending' as const },
  { id: 'GLTS-TML-06', title: 'Dispatch', status: 'pending' as const },
  { id: 'GLTS-TML-07', title: 'Delivered', status: 'pending' as const },
]
