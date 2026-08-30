import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, PlayCircle, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { applyFlow, applyFont, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import type { SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { formatRetailApplyDropOffLabel } from '@/shared/utils/retailApplyDropOff'

export interface RetailApplicationCardProps {
  row: SingleApplicationRow
  mode: 'ongoing' | 'purchased'
  onView: () => void
  onContinue?: () => void
  onDelete?: () => void
}

export function RetailApplicationCard({ row, mode, onView, onContinue, onDelete }: RetailApplicationCardProps) {
  const progressLabel =
    mode === 'ongoing' && row.retailApply
      ? formatRetailApplyDropOffLabel(row.retailApply)
      : row.processingStage || row.operationalStatus

  const stepHint =
    mode === 'ongoing' && row.retailApply?.lastStepIndex && row.retailApply?.totalSteps
      ? `Step ${row.retailApply.lastStepIndex} of ${row.retailApply.totalSteps}`
      : null

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: applyRadius.card,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          borderColor: applyFlow.accentBorder,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.75 }}>
            <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{row.countryFlag || '🛂'}</Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontWeight: 800,
                fontSize: 16,
                color: applyFlow.ink,
              }}
            >
              {row.visaType}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: applyFlow.inkMuted, mb: 1.25 }}>
            {row.applicantName} · {row.country}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
            <Chip label={row.operationalStatus} tone={mode === 'ongoing' ? 'neutral' : 'info'} />
            {stepHint ? <Chip label={stepHint} tone="accent" /> : null}
          </Stack>

          <Typography sx={{ fontSize: 12.5, color: applyFlow.inkFaint, mb: 2 }}>
            {mode === 'ongoing' ? 'Progress · ' : 'Status · '}
            {progressLabel}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" size="sm" endIcon={<ArrowRight size={14} />} onClick={onView}>
              View application
            </Button>
            {mode === 'ongoing' && onContinue ? (
              <Button variant="contained" size="sm" startIcon={<PlayCircle size={14} />} onClick={onContinue}>
                Continue
              </Button>
            ) : null}
            {mode === 'ongoing' && onDelete ? (
              <Button variant="text" size="sm" color="error" startIcon={<Trash2 size={14} />} onClick={onDelete}>
                Delete
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function Chip({ label, tone }: { label: string; tone: 'neutral' | 'info' | 'accent' }) {
  const styles =
    tone === 'accent'
      ? { bg: applyFlow.accentSoft, color: applyFlow.accentInk, border: applyFlow.accentBorder }
      : tone === 'info'
        ? { bg: 'rgba(15, 169, 104, 0.1)', color: '#0A7A4C', border: 'rgba(15, 169, 104, 0.28)' }
        : { bg: applyFlow.canvas, color: applyFlow.inkMuted, border: applyFlow.hairline }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.35,
        borderRadius: '999px',
        fontSize: 11,
        fontWeight: 700,
        bgcolor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
    >
      {label}
    </Box>
  )
}
