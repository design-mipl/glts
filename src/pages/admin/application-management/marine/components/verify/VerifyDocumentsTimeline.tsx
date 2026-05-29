import { Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { ApplicationProcessingTimeline } from '@/pages/customer/features/applications/components/ApplicationProcessingTimeline'
import type { ApplicationProcessingTimelineStep } from '@/pages/customer/features/applications/components/ApplicationProcessingTimeline'

interface VerifyDocumentsTimelineProps {
  steps: ApplicationProcessingTimelineStep[]
  multiTraveler: boolean
}

export function VerifyDocumentsTimeline({ steps, multiTraveler }: VerifyDocumentsTimelineProps) {
  return (
    <BaseCard sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Processing timeline
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {multiTraveler ? 'Updates by selected traveler' : 'Single traveler flow'}
        </Typography>
      </Stack>
      <ApplicationProcessingTimeline steps={steps} />
    </BaseCard>
  )
}
