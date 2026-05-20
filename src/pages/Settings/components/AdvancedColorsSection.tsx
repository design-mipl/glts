import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ChevronDown } from 'lucide-react'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import ColorPickerField from './ColorPickerField'

function ModePaletteSection({
  title,
  mode,
}: {
  title: string
  mode: 'light' | 'dark'
}) {
  const {
    config,
    setPrimaryColor,
    setSecondaryColor,
    setTextPrimaryColor,
    setTextSecondaryColor,
  } = useFoundationTheme()
  const palette = config[mode]

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" fontWeight={700}>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        }}
      >
        <ColorPickerField
          label="Primary Color"
          value={palette.primary}
          onChange={(value) => setPrimaryColor(mode, value)}
          previewColor={palette.primary}
        />
        <ColorPickerField
          label="Secondary Color"
          value={palette.secondary}
          onChange={(value) => setSecondaryColor(mode, value)}
          previewColor={palette.secondary}
        />
        <ColorPickerField
          label="Text Primary"
          value={palette.textPrimary}
          onChange={(value) => setTextPrimaryColor(mode, value)}
          previewColor={palette.textPrimary}
        />
        <ColorPickerField
          label="Text Secondary"
          value={palette.textSecondary}
          onChange={(value) => setTextSecondaryColor(mode, value)}
          previewColor={palette.textSecondary}
        />
      </Box>
    </Stack>
  )
}

export default function AdvancedColorsSection() {
  const [expanded, setExpanded] = useState(false)
  const { muiTheme, resetAdvancedColors } = useFoundationTheme()

  return (
    <Box>
      <Box
        onClick={() => setExpanded((current) => !current)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
          border: '1px solid',
          borderColor: expanded ? 'primary.main' : 'divider',
          bgcolor: expanded
            ? (theme) => alpha(theme.palette.primary.main, 0.06)
            : 'transparent',
          cursor: 'pointer',
          transition: 'border-color 150ms ease, background-color 150ms ease',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            Advanced Colors
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Customize primary, secondary, and text colors separately for light and dark modes.
          </Typography>
        </Box>
        <ChevronDown
          size={18}
          color={muiTheme.palette.text.secondary}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
            flexShrink: 0,
          }}
        />
      </Box>

      <Collapse in={expanded}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <ModePaletteSection title="Light Mode" mode="light" />
          <ModePaletteSection title="Dark Mode" mode="dark" />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              component="button"
              onClick={resetAdvancedColors}
              sx={{
                border: 'none',
                background: 'none',
                p: 0,
                m: 0,
                font: 'inherit',
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Reset Advanced Colors to Default
            </Typography>
          </Box>
        </Stack>
      </Collapse>
    </Box>
  )
}
