import { Box, Stack, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  getSelectableSx,
} from '@/pages/website/theme/applyFlowTheme'

interface OptionCardProps {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
  tone?: 'default' | 'critical'
}

export function OptionCard({ label, description, selected, onSelect, tone = 'default' }: OptionCardProps) {
  const isCritical = tone === 'critical'

  return (
    <Box
      component="button"
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      sx={{
        ...getSelectableSx(selected),
        appearance: 'none',
        font: 'inherit',
        textAlign: 'left',
        width: '100%',
        px: 4,
        py: 3.5,
        ...(isCritical && selected
          ? {
              borderColor: applyFlow.critical,
              backgroundColor: applyFlow.criticalSoft,
              '&::before': { backgroundColor: applyFlow.critical, transform: 'scaleY(1)' },
            }
          : null),
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={3}>
        <Box
          aria-hidden
          sx={{
            mt: '1px',
            width: 18,
            height: 18,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            border: `1.5px solid ${
              selected
                ? isCritical
                  ? applyFlow.critical
                  : applyFlow.accent
                : applyFlow.hairlineStrong
            }`,
            backgroundColor: selected
              ? isCritical
                ? applyFlow.critical
                : applyFlow.accent
              : 'transparent',
            color: isCritical ? '#FFFFFF' : applyFlow.onAccent,
            transition: `border-color 160ms ${applyMotion.easeOut}, background-color 160ms ${applyMotion.easeOut}`,
          }}
        >
          <Check
            size={11}
            strokeWidth={3.5}
            style={{
              opacity: selected ? 1 : 0,
              transform: selected ? 'scale(1)' : 'scale(0.7)',
              transition: `opacity 160ms ${applyMotion.easeOut}, transform 160ms ${applyMotion.easeOut}`,
            }}
          />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: 14.5,
              fontWeight: 600,
              lineHeight: 1.35,
              color: applyFlow.ink,
            }}
          >
            {label}
          </Typography>
          {description && (
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13,
                lineHeight: 1.5,
                color: applyFlow.inkMuted,
                mt: 0.7,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  )
}
