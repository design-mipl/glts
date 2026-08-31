import { useState } from 'react'
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { ChevronRight, MoreVertical } from 'lucide-react'
import { AccentButton } from './retailAccountButtons'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  focusRingSx,
  getPressSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import type { SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { formatRetailApplyDropOffLabel } from '@/shared/utils/retailApplyDropOff'

export interface RetailApplicationCardProps {
  row: SingleApplicationRow
  mode: 'ongoing' | 'purchased'
  onView: () => void
  onContinue?: () => void
  onDelete?: () => void
}

/** Maps the listing's status tone onto the apply-flow semantic palette. */
function statusStyles(tone: SingleApplicationRow['statusTone']) {
  switch (tone) {
    case 'approved':
      return { bg: applyFlow.successSoft, color: applyFlow.success, border: applyFlow.successBorder }
    case 'pending':
      return { bg: applyFlow.warningSoft, color: applyFlow.warning, border: 'rgba(180, 83, 9, 0.32)' }
    case 'review':
    case 'processing':
      return { bg: applyFlow.accentSoft, color: applyFlow.accentInk, border: applyFlow.accentBorder }
    default:
      return { bg: applyFlow.canvas, color: applyFlow.inkMuted, border: applyFlow.hairline }
  }
}

export function RetailApplicationCard({
  row,
  mode,
  onView,
  onContinue,
  onDelete,
}: RetailApplicationCardProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const lastStep = row.retailApply?.lastStepIndex
  const totalSteps = row.retailApply?.totalSteps
  const hasStepProgress = mode === 'ongoing' && Boolean(lastStep && totalSteps)
  const percent = hasStepProgress ? Math.round((lastStep! / totalSteps!) * 100) : 0

  const currentStep =
    mode === 'ongoing' && row.retailApply
      ? formatRetailApplyDropOffLabel(row.retailApply)
      : row.processingStage

  const tone = statusStyles(row.statusTone)

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView()
        }
      }}
      sx={{
        position: 'relative',
        p: 2.5,
        cursor: 'pointer',
        borderRadius: applyRadius.card,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
        transition: `border-color 160ms ${applyMotion.easeOut}, box-shadow 160ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: applyFlow.hairlineStrong,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          },
          '&:hover .retail-app-chevron': { transform: 'translateX(2px)', color: applyFlow.ink },
        },
        ...focusRingSx,
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 20, lineHeight: 1 }}>{row.countryFlag || '🛂'}</Typography>
            <Typography
              sx={{
                fontFamily: applyFont.display,
                fontWeight: 700,
                fontSize: 16.5,
                color: applyFlow.ink,
                letterSpacing: '-0.01em',
                minWidth: 0,
              }}
              noWrap
            >
              {row.visaType}
            </Typography>
          </Stack>

          <Typography sx={{ fontSize: 13, color: applyFlow.inkMuted, mb: 1.25 }} noWrap>
            {row.applicantName} · {row.country}
          </Typography>

          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1,
              py: 0.35,
              borderRadius: applyRadius.chip,
              fontSize: 11,
              fontWeight: 700,
              bgcolor: tone.bg,
              color: tone.color,
              border: `1px solid ${tone.border}`,
            }}
          >
            {row.status}
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
          {onDelete ? (
            <Box
              component="button"
              type="button"
              aria-label={`Actions for ${row.visaType}`}
              onClick={e => {
                e.stopPropagation()
                setAnchor(e.currentTarget)
              }}
              sx={{
                width: 28,
                height: 28,
                display: 'grid',
                placeItems: 'center',
                borderRadius: applyRadius.chip,
                border: '1px solid transparent',
                bgcolor: 'transparent',
                color: applyFlow.inkFaint,
                cursor: 'pointer',
                p: 0,
                '&:hover': { bgcolor: applyFlow.canvas, color: applyFlow.ink },
                ...focusRingSx,
                ...getPressSx(),
              }}
            >
              <MoreVertical size={15} />
            </Box>
          ) : null}
          <ChevronRight
            className="retail-app-chevron"
            size={18}
            color={applyFlow.inkFaint}
            style={{ transition: `transform 160ms ${applyMotion.easeOut}, color 160ms ease` }}
          />
        </Stack>
      </Stack>

      {/* Progress track only renders when the saved draft actually reports a step —
          a fabricated bar would misrepresent where the customer stopped. */}
      {hasStepProgress ? (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.75 }}>
            <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted, minWidth: 0 }} noWrap>
              {currentStep}
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.mono,
                fontSize: 11,
                fontWeight: 600,
                color: applyFlow.inkFaint,
                flexShrink: 0,
                pl: 1,
                ...tabularNums,
              }}
            >
              {lastStep}/{totalSteps}
            </Typography>
          </Stack>
          <Box
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Application progress"
            sx={{
              height: 4,
              borderRadius: applyRadius.full,
              bgcolor: applyFlow.accentTrack,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${percent}%`,
                height: '100%',
                borderRadius: applyRadius.full,
                bgcolor: applyFlow.accent,
                transition: `width 420ms ${applyMotion.easeInOut}`,
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            />
          </Box>
        </Box>
      ) : currentStep ? (
        <Typography sx={{ mt: 1.75, fontSize: 12.5, color: applyFlow.inkMuted }} noWrap>
          {currentStep}
        </Typography>
      ) : null}

      {mode === 'ongoing' && onContinue ? (
        <AccentButton
          sx={{ mt: 2 }}
          onClick={e => {
            e.stopPropagation()
            onContinue()
          }}
        >
          Continue application
        </AccentButton>
      ) : null}

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        onClick={e => e.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: applyRadius.control,
              border: `1px solid ${applyFlow.hairline}`,
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
              minWidth: 180,
            },
          },
        }}
      >
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setAnchor(null)
            onView()
          }}
        >
          View application
        </MenuItem>
        {onDelete ? (
          <MenuItem
            sx={{ ...menuItemSx, color: applyFlow.critical }}
            onClick={() => {
              setAnchor(null)
              onDelete()
            }}
          >
            Delete draft
          </MenuItem>
        ) : null}
      </Menu>
    </Box>
  )
}

const menuItemSx = {
  fontFamily: applyFont.body,
  fontSize: 13.5,
  fontWeight: 600,
  color: applyFlow.ink,
} as const
