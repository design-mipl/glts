import type { ReactNode } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

interface CaptureFlowShellProps {
  onClose: () => void
  children: ReactNode
  /** Pinned to the top of the modal body (e.g. headline). */
  header?: ReactNode
  footer?: ReactNode
  /** Modal width — photo capture fits `lg`; passport review needs `xl`. */
  size?: 'md' | 'lg' | 'xl'
  /** Extra vertical room inside the modal body. */
  contentMinHeight?: number | { xs?: number; sm?: number }
  /** How body content is vertically placed under the header. */
  contentAlign?: 'center' | 'start'
  /** Shrink modal height to content (no forced tall min-height). */
  fitToContent?: boolean
}

/** Popup modal shell for photo / passport capture sub-flows. */
export function CaptureFlowShell({
  onClose,
  children,
  header,
  footer,
  size = 'lg',
  contentMinHeight = { xs: 360, sm: 420 },
  contentAlign = 'center',
  fitToContent = false,
}: CaptureFlowShellProps) {
  const colors = usePublicBrandColors()

  return (
    <Modal
      open
      onClose={onClose}
      size={size}
      footer={footer}
      hideCloseButton
      sx={{
        minHeight: fitToContent
          ? 'auto'
          : size === 'md' || size === 'lg'
            ? { sm: 640 }
            : undefined,
        height: fitToContent ? 'auto' : undefined,
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
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
        <IconButton
          aria-label="Close"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            zIndex: 2,
            color: colors.navy,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.06)' },
          }}
        >
          <X size={18} />
        </IconButton>

        {header ? (
          <Box sx={{ flexShrink: 0, width: '100%', pt: 0.5, pb: 1, pr: 4 }}>{header}</Box>
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
            pt: fitToContent ? 2 : 1,
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
        maxWidth: 520,
        mx: 'auto',
        mb: 0,
        px: 1,
      }}
    >
      <Typography
        component="p"
        sx={{
          fontSize: { xs: 20, sm: 26 },
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
