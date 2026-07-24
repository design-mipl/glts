import { Stack, Typography } from '@mui/material'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { JourneyFlow, type JourneyFlowStageStatus } from '../common/JourneyFlow'
import { StatusBadge } from '../StatusBadge'
import {
  PASSPORT_JOURNEY_STAGE_LABELS,
  type PassportJourneyStageId,
} from '../../config/passportJourney'
import { DASHBOARD_SPACING } from '../../constants'
import type { DashboardStatusTone } from '../../types'

export interface PassportJourneyStageData {
  id: PassportJourneyStageId
  status: JourneyFlowStageStatus
  detail?: string
}

export interface PassportJourneyProps {
  title?: string
  subtitle?: string
  stages: PassportJourneyStageData[]
  journeyStatus: string
  eta?: string
  trackingNumber?: string
  courier?: string
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

function journeyTone(status: string): DashboardStatusTone {
  const normalized = status.toLowerCase()
  if (normalized.includes('delay') || normalized.includes('fail')) return 'error'
  if (normalized.includes('transit') || normalized.includes('progress')) return 'info'
  if (normalized.includes('deliver') || normalized.includes('complete')) return 'success'
  return 'neutral'
}

export function PassportJourney({
  title = 'Passport journey',
  subtitle = 'Physical passport movement',
  stages,
  journeyStatus,
  eta,
  trackingNumber,
  courier,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: PassportJourneyProps) {
  const flowStages = stages.map((stage) => ({
    id: stage.id,
    label: PASSPORT_JOURNEY_STAGE_LABELS[stage.id],
    status: stage.status,
    detail: stage.detail,
  }))

  const metaParts = [
    eta ? `ETA ${eta}` : null,
    trackingNumber ? `Tracking ${trackingNumber}` : null,
    courier ? `Courier ${courier}` : null,
  ].filter(Boolean)

  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty ?? stages.length === 0}
      permission={permission}
      onRetry={onRetry}
      skeletonHeightSpacing={14}
    >
      <Stack spacing={DASHBOARD_SPACING.dense}>
        <Stack direction="row" spacing={DASHBOARD_SPACING.field} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <StatusBadge label={journeyStatus} tone={journeyTone(journeyStatus)} />
        </Stack>
        <JourneyFlow stages={flowStages} meta={metaParts.join(' · ')} />
      </Stack>
    </BusinessWidgetFrame>
  )
}
