import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { X, type LucideIcon } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { applyFlow, applyFont, applyMotion, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { displayNameUpper } from '../../config/travelProfileQuestions'

interface CaptureFlowShellProps {
  onClose: () => void
  children: ReactNode
  /** Traveller this capture belongs to — drives the header line. */
  applicantName: string
  /** Mono eyebrow label paired with `badgeIcon` (e.g. "Capture photo"). */
  badgeLabel: string
  badgeIcon?: LucideIcon
  /** Pinned under the header (e.g. CaptureHeadline). */
  header?: ReactNode
  footer?: ReactNode
  /** Modal width — photo/passport capture use `xl`; review can stay `xl`. */
  size?: 'md' | 'lg' | 'xl'
  /** Extra vertical room inside the modal body. */
  contentMinHeight?: number | { xs?: number; sm?: number }
  /** How body content is vertically placed under the header. */
  contentAlign?: 'center' | 'start'
  /** Shrink modal height to content (no forced tall min-height). */
  fitToContent?: boolean
}

/** Popup modal shell for photo / passport capture — same chrome language as `TravelProfileBuilder`. */
export function CaptureFlowShell({
  onClose,
  children,
  applicantName,
  badgeLabel,
  badgeIcon: BadgeIcon,
  header,
  footer,
  size = 'xl',
  contentMinHeight = { xs: 520, sm: 640 },
  contentAlign = 'center',
  fitToContent = false,
}: CaptureFlowShellProps) {
  const name = applicantName.trim() || 'Traveller'
  const nameUpper = displayNameUpper(name)

  const iconBtnSx = {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    appearance: 'none',
    border: `1px solid ${applyFlow.hairline}`,
    background: 'none',
    borderRadius: applyRadius.control,
    color: applyFlow.inkMuted,
    cursor: 'pointer',
    flex: '0 0 auto',
    transition: `color 150ms ${applyMotion.easeOut}, border-color 150ms ${applyMotion.easeOut}`,
    '@media (pointer: coarse)': { width: 44, height: 44 },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': { color: applyFlow.ink, borderColor: applyFlow.hairlineStrong },
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: applyFlow.accent,
      boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
    },
  } as const

  return (
    <Modal
      open
      onClose={onClose}
      size={size}
      footer={footer}
      hideCloseButton
      sx={{
        width: { sm: size === 'xl' ? 1080 : size === 'lg' ? 920 : undefined },
        minHeight: fitToContent
          ? 'auto'
          : { sm: size === 'md' ? 560 : 720 },
        height: fitToContent ? 'auto' : undefined,
        maxHeight: { sm: 'min(100vh - 48px, 92vh)' },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: fitToContent ? 'auto' : '100%',
          minHeight: fitToContent ? undefined : contentMinHeight,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header — mono eyebrow (badge) + name, quiet close. No colour-coded avatar. */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3, flexShrink: 0 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0, flex: 1, pr: 1 }}>
            {BadgeIcon ? <BadgeIcon size={14} strokeWidth={2} style={{ color: applyFlow.accentInk, flexShrink: 0 }} /> : null}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: applyFont.mono,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: applyFlow.inkFaint,
                }}
              >
                {badgeLabel}
              </Typography>
              <Typography
                sx={{
                  fontFamily: applyFont.body,
                  fontSize: 13,
                  fontWeight: 600,
                  color: applyFlow.ink,
                  mt: 0.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {nameUpper}
              </Typography>
            </Box>
          </Stack>

          <Box component="button" type="button" aria-label="Close" onClick={onClose} sx={iconBtnSx}>
            <X size={15} />
          </Box>
        </Stack>

        {header ? (
          <Box sx={{ flexShrink: 0, width: '100%', pb: 2 }}>{header}</Box>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: contentAlign === 'center' ? 'center' : 'stretch',
            justifyContent: contentAlign === 'center' ? 'center' : 'flex-start',
            flex: fitToContent ? '0 0 auto' : 1,
            width: '100%',
            minHeight: fitToContent ? undefined : 0,
            color: applyFlow.ink,
            pt: fitToContent ? 1 : 0.5,
            pb: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  )
}

export function CaptureHeadline({ lead, accent }: { lead: string; accent: string }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        maxWidth: 640,
        mx: 'auto',
        mb: 0,
        px: 1,
      }}
    >
      <Typography
        component="p"
        sx={{
          fontFamily: applyFont.display,
          fontSize: { xs: 20, sm: 25 },
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          m: 0,
        }}
      >
        <Box component="span" sx={{ fontWeight: 600, color: applyFlow.ink }}>
          {lead}{' '}
        </Box>
        <Box component="span" sx={{ fontWeight: 700, color: applyFlow.accentInk }}>
          {accent}
        </Box>
      </Typography>
    </Box>
  )
}
