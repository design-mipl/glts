import { Box, Typography } from '@mui/material'
import { Aperture, Monitor } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

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
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        p: 0.5,
        borderRadius: 999,
        bgcolor: colors.surfaceAlt,
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
              borderRadius: 999,
              bgcolor: active ? colors.navy : 'transparent',
              color: active ? '#fff' : colors.navy,
              fontFamily: 'inherit',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            <Icon size={15} strokeWidth={2.25} />
            <Typography
              component="span"
              sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {entry.label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
