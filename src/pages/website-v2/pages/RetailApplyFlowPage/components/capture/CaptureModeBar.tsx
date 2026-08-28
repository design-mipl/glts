import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { Aperture, Monitor } from 'lucide-react'
import { applyFlow, applyFont, applyRadius } from '@/pages/website-v2/theme/applyFlowTheme'

export type CaptureInputMode = 'live' | 'upload'

interface CaptureModeBarProps {
  mode: CaptureInputMode
  onChange: (mode: CaptureInputMode) => void
  disabled?: boolean
}

const MODES: { id: CaptureInputMode; label: string; icon: typeof Aperture }[] = [
  { id: 'live', label: 'Live Capture', icon: Aperture },
  { id: 'upload', label: 'Upload from Device', icon: Monitor },
]

export function CaptureModeBar({ mode, onChange, disabled }: CaptureModeBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        p: 0.5,
        borderRadius: applyRadius.full,
        backgroundColor: applyFlow.canvas,
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
      }}
    >
      {MODES.map((entry) => {
        const active = mode === entry.id
        const Icon = entry.icon
        return (
          <Box
            key={entry.id}
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => onChange(entry.id)}
            sx={{
              position: 'relative',
              appearance: 'none',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              flex: 1,
              px: 1.5,
              py: 1,
              borderRadius: applyRadius.full,
              bgcolor: 'transparent',
              color: active ? '#fff' : applyFlow.ink,
              fontFamily: applyFont.body,
              opacity: disabled && !active ? 0.5 : 1,
              transition: 'color 0.15s ease, opacity 0.15s ease',
            }}
          >
            {active ? (
              <Box
                component={motion.div}
                layoutId="capture-mode-active-pill"
                transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
                sx={{ position: 'absolute', inset: 0, borderRadius: applyRadius.full, bgcolor: applyFlow.navy, zIndex: 0 }}
              />
            ) : null}
            <Icon size={15} strokeWidth={2.25} style={{ position: 'relative', zIndex: 1 }} />
            <Typography
              component="span"
              sx={{
                position: 'relative',
                zIndex: 1,
                fontSize: { xs: 12, sm: 13 },
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {entry.label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
