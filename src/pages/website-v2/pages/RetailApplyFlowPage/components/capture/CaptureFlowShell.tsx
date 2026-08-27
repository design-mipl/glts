import type { ReactNode } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { X, type LucideIcon } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'

/** Match TravelProfileBuilder popup chrome. */
const ACCENT = '#7B6CF0'
const ACCENT_SOFT = 'rgba(123, 108, 240, 0.12)'
const AVATAR_ROSE = '#D4A0A0'

interface CaptureFlowShellProps {
  onClose: () => void
  children: ReactNode
  /** Traveller this capture belongs to — drives the profile-style top bar. */
  applicantName: string
  /** Centered pill label under the person bar (e.g. "Capture photo"). */
  badgeLabel: string
  badgeIcon?: LucideIcon
  /** Pinned under the badge (e.g. CaptureHeadline). */
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

/** Popup modal shell for photo / passport capture — profile-style header + roomy body. */
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
  const colors = usePublicBrandColors()
  const name = applicantName.trim() || 'Traveller'
  const nameUpper = displayNameUpper(name)

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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1, flexShrink: 0 }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1, pr: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: AVATAR_ROSE,
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initialsFromName(name).slice(0, 1)}
            </Box>
            <Typography sx={{ fontSize: 13, color: colors.textMuted, minWidth: 0 }}>
              Updating for{' '}
              <Box component="span" sx={{ fontWeight: 700, color: colors.navy }}>
                {nameUpper}
              </Box>
            </Typography>
          </Stack>

          <IconButton
            aria-label="Close"
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: 'rgba(15, 169, 104, 0.12)',
              color: colors.navy,
              flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(15, 169, 104, 0.2)' },
            }}
          >
            <X size={16} />
          </IconButton>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.25, flexShrink: 0 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: ACCENT_SOFT,
              color: ACCENT,
            }}
          >
            {BadgeIcon ? <BadgeIcon size={14} strokeWidth={2} /> : null}
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{badgeLabel}</Typography>
          </Box>
        </Box>

        {header ? (
          <Box sx={{ flexShrink: 0, width: '100%', pb: 1.5 }}>{header}</Box>
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
            color: colors.navy,
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
  const colors = usePublicBrandColors()
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
          fontSize: { xs: 22, sm: 28 },
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          m: 0,
        }}
      >
        <Box component="span" sx={{ fontWeight: 600, color: colors.navy }}>
          {lead}{' '}
        </Box>
        <Box component="span" sx={{ fontWeight: 800, color: colors.greenDark }}>
          {accent}
        </Box>
      </Typography>
    </Box>
  )
}
