import type { ApplicationStatus } from '@/shared/types/application'
import { APPLICATION_PROCESSING_STAGE_LABELS } from '@/shared/types/applicationProcessingTimeline'
import { formatProcessingStageDate } from '@/shared/utils/applicationProcessingTimeline'
import { GLTS_APPLICATION_IDS } from './portalIds'

export interface CustomerApplication {
  id: string
  country: string
  countryFlag?: string
  visaType: string
  jurisdiction?: string
  applicantCount: number
  status: ApplicationStatus
  statusLabel: string
  travelDate: string
  updatedAt: string
  progress?: number
  eta?: string
  /** Marine dashboard — passenger / crew member name */
  passengerName?: string
  /** Marine dashboard — assigned vessel */
  vesselName?: string
  /** Marine dashboard — rank or role */
  rank?: string
}

export const mockApplications: CustomerApplication[] = [
  {
    id: GLTS_APPLICATION_IDS.schengen,
    country: 'France',
    countryFlag: '🇫🇷',
    visaType: 'Marine Crew Visa',
    jurisdiction: 'Mumbai',
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
    visaType: 'e-Visa · Tourist',
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
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    visaType: 'Tourist e-Visa',
    applicantCount: 2,
    status: 'approved',
    statusLabel: 'Approved',
    travelDate: '2026-03-20',
    updatedAt: '3d ago',
    progress: 100,
    eta: '—',
  },
  {
    id: GLTS_APPLICATION_IDS.corporateBusinessJurisdiction,
    country: 'UK',
    countryFlag: '🇬🇧',
    visaType: 'Business Visa',
    jurisdiction: 'Delhi',
    applicantCount: 1,
    status: 'in_review',
    statusLabel: 'Embassy review',
    travelDate: '2026-06-10',
    updatedAt: '5h ago',
    progress: 60,
    eta: '9 days',
  },
  {
    id: GLTS_APPLICATION_IDS.corporateBusinessEvisa,
    country: 'USA',
    countryFlag: '🇺🇸',
    visaType: 'Business e-Visa',
    applicantCount: 1,
    status: 'draft',
    statusLabel: 'Draft',
    travelDate: '2026-05-15',
    updatedAt: '1d ago',
    progress: 10,
    eta: '—',
  },
  {
    id: GLTS_APPLICATION_IDS.marineCrewJurisdiction,
    country: 'Philippines',
    countryFlag: '🇵🇭',
    visaType: 'Crew Visa',
    jurisdiction: 'Mumbai',
    applicantCount: 1,
    status: 'in_review',
    statusLabel: 'Embassy review',
    travelDate: '2026-05-28',
    updatedAt: '3h ago',
    progress: 68,
    eta: '7 days',
    passengerName: 'Rodrigo Santos',
    vesselName: 'MV Pacific Horizon',
    rank: 'Able Seaman',
  },
  {
    id: GLTS_APPLICATION_IDS.marineCrewTransit,
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    visaType: 'Crew Transit Visa',
    applicantCount: 1,
    status: 'draft',
    statusLabel: 'Draft',
    travelDate: '2026-04-30',
    updatedAt: '12h ago',
    progress: 10,
    eta: '—',
    passengerName: 'Erik Johansson',
    vesselName: 'MV Northern Wind',
    rank: 'Chief Engineer',
  },
  {
    id: GLTS_APPLICATION_IDS.b2bAgentTouristJurisdiction,
    country: 'India',
    countryFlag: '🇮🇳',
    visaType: 'Agent Tourist Visa',
    jurisdiction: 'Delhi',
    applicantCount: 1,
    status: 'draft',
    statusLabel: 'Draft',
    travelDate: '2026-06-05',
    updatedAt: '2d ago',
    progress: 10,
    eta: '—',
  },
  {
    id: GLTS_APPLICATION_IDS.b2bAgentBusinessEvisa,
    country: 'South Korea',
    countryFlag: '🇰🇷',
    visaType: 'Agent Business e-Visa',
    applicantCount: 1,
    status: 'submitted',
    statusLabel: 'Verification pending',
    travelDate: '2026-04-12',
    updatedAt: '4d ago',
    progress: 55,
    eta: '9 days',
  },
]

const demoTimelineDates = {
  ready: '2026-02-01T09:00:00.000Z',
  submitted: '2026-02-10T11:30:00.000Z',
  appointment: '2026-02-14T10:00:00.000Z',
  embassy: '2026-02-18T08:15:00.000Z',
  'passport-ready': undefined,
  dispatch: undefined,
  delivered: undefined,
} as const

export const timelineStages = [
  {
    id: 'ready',
    title: APPLICATION_PROCESSING_STAGE_LABELS.ready,
    status: 'completed' as const,
    date: formatProcessingStageDate(demoTimelineDates.ready),
  },
  {
    id: 'submitted',
    title: APPLICATION_PROCESSING_STAGE_LABELS.submitted,
    status: 'completed' as const,
    date: formatProcessingStageDate(demoTimelineDates.submitted),
  },
  {
    id: 'appointment',
    title: APPLICATION_PROCESSING_STAGE_LABELS.appointment,
    status: 'completed' as const,
    date: formatProcessingStageDate(demoTimelineDates.appointment),
  },
  {
    id: 'embassy',
    title: APPLICATION_PROCESSING_STAGE_LABELS.embassy,
    status: 'in_progress' as const,
    date: formatProcessingStageDate(demoTimelineDates.embassy),
  },
  {
    id: 'passport-ready',
    title: APPLICATION_PROCESSING_STAGE_LABELS['passport-ready'],
    status: 'pending' as const,
  },
  {
    id: 'dispatch',
    title: APPLICATION_PROCESSING_STAGE_LABELS.dispatch,
    status: 'pending' as const,
  },
  {
    id: 'delivered',
    title: APPLICATION_PROCESSING_STAGE_LABELS.delivered,
    status: 'pending' as const,
  },
]
