import { Box, Grid, Typography } from '@mui/material'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx } from '@/pages/website-v2/theme/retailFlowTokens'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { RETAIL_COLLECTION_METHOD_OPTIONS } from '../../config/retailCollectionMethods'
import { StepShell } from '../StepShell'

interface CollectionMethodStepProps {
  selectedMethod?: OriginalDocumentCollectionMethod
  onSelect: (method: OriginalDocumentCollectionMethod) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

const ICON_TONES = [
  { bg: 'rgba(15, 169, 104, 0.12)', fg: '#0F766E' },
  { bg: 'rgba(8, 145, 178, 0.12)', fg: '#0E7490' },
  { bg: 'rgba(180, 83, 9, 0.12)', fg: '#B45309' },
  { bg: 'rgba(79, 70, 229, 0.12)', fg: '#4338CA' },
] as const

export function CollectionMethodStep({
  selectedMethod,
  onSelect,
  onBack,
  onContinue,
  previewOnly = false,
}: CollectionMethodStepProps) {
  const colors = usePublicBrandColors()

  const body = (
    <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 560, mx: 'auto' }}>
      {RETAIL_COLLECTION_METHOD_OPTIONS.map((option, index) => {
        const selected = option.value === selectedMethod
        const Icon = option.icon
        const tone = ICON_TONES[index % ICON_TONES.length]
        return (
          <Grid size={{ xs: 12, sm: 6 }} key={option.value} sx={{ maxWidth: { sm: 260 } }}>
            <Box
              onClick={() => onSelect(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(option.value)
                }
              }}
              aria-pressed={selected}
              sx={{
                p: 2,
                cursor: 'pointer',
                height: '100%',
                maxWidth: 260,
                mx: 'auto',
                ...getElevatedCardSx(selected ? 'rgba(115, 192, 100, 0.55)' : 'rgba(15, 23, 42, 0.08)'),
                bgcolor: colors.white,
                borderRadius: BORDER_RADIUS.xl,
                textAlign: 'center',
                outline: 'none',
                transition: 'border-color 0.15s ease',
                '&:hover': {
                  borderColor: 'rgba(115, 192, 100, 0.55)',
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  mx: 'auto',
                  mb: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: tone.bg,
                  color: tone.fg,
                }}
              >
                <Icon size={20} strokeWidth={2.25} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.navy }}>
                {option.label}
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 12,
                  color: colors.textMuted,
                  lineHeight: 1.45,
                }}
              >
                {option.description}
              </Typography>
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="How should we collect your originals?"
      helperText="Choose whichever is easiest for you."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!selectedMethod}
      contentMaxWidth={640}
    >
      {body}
    </StepShell>
  )
}
