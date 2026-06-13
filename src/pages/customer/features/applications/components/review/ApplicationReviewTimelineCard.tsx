import { Card, Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ApplicationProcessingTimeline } from '../ApplicationProcessingTimeline'

export interface ApplicationReviewTimelineCardProps {
  steps: ApplicationProcessingTimelineStep[]
  multiTraveler: boolean
  variant?: 'customer' | 'admin'
}

export function ApplicationReviewTimelineCard({
  steps,
  multiTraveler,
  variant = 'customer',
}: ApplicationReviewTimelineCardProps) {
  const colors = usePublicBrandColors()

  const content = (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography
          variant={variant === 'admin' ? 'subtitle2' : undefined}
          sx={{
            fontWeight: 700,
            fontSize: variant === 'admin' ? undefined : 13,
            color: variant === 'admin' ? undefined : colors.navy,
          }}
        >
          Processing timeline
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            color: variant === 'admin' ? 'text.secondary' : colors.textMuted,
          }}
        >
          {multiTraveler ? 'Updates by selected traveler' : 'Single traveler flow'}
        </Typography>
      </Stack>
      <ApplicationProcessingTimeline steps={steps} />
    </>
  )

  if (variant === 'admin') {
    return <BaseCard sx={{ p: 2 }}>{content}</BaseCard>
  }

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: BORDER_RADIUS.xl,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      {content}
    </Card>
  )
}
