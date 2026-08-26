import { Box, Stack, Typography } from '@mui/material'
import { BORDER_RADIUS } from '@/design-system/tokens'
import type { RequirementPreviewCard } from '@/shared/types/countryMaster'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { StepShell } from '../StepShell'

interface RequirementsStepProps {
  cards: RequirementPreviewCard[]
  onBack: () => void
  onContinue: () => void
}

export function RequirementsStep({ cards, onBack, onContinue }: RequirementsStepProps) {
  const colors = usePublicBrandColors()

  return (
    <StepShell
      title="Here's what you'll need"
      helperText="A quick overview before we collect your documents."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Start documents"
    >
      <Stack spacing={1.5}>
        {cards.map((card) => (
          <Box key={card.id} sx={{ border: `1px solid ${colors.border}`, borderRadius: BORDER_RADIUS.lg, p: 2 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>{card.title}</Typography>
            {card.arrangedBy && (
              <Typography sx={{ fontSize: '12px', color: colors.textMuted, mt: 0.25 }}>
                Arranged by {card.arrangedBy}
              </Typography>
            )}
            {card.alertNote && (
              <Typography sx={{ fontSize: '12px', color: colors.greenDark, mt: 0.5 }}>{card.alertNote}</Typography>
            )}
            {card.scopeItems && card.scopeItems.length > 0 && (
              <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.25 }}>
                {card.scopeItems.map((item) => (
                  <Typography key={item} component="li" sx={{ fontSize: '13px', color: colors.textSecondary }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            )}
            {card.documents && card.documents.length > 0 && (
              <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.25 }}>
                {card.documents.map((doc) => (
                  <Typography key={doc.id} component="li" sx={{ fontSize: '13px', color: colors.textSecondary }}>
                    {doc.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        ))}
        {cards.length === 0 && (
          <Typography sx={{ fontSize: '13px', color: colors.textMuted }}>
            No additional requirements — you're all set to continue.
          </Typography>
        )}
      </Stack>
    </StepShell>
  )
}
