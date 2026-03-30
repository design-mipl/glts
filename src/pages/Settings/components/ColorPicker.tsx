import { useState, useEffect } from 'react'
import { Box, Typography, TextField, InputAdornment, Tooltip, Stack } from '@mui/material'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import { COLOR_PRESETS } from '../../../design-system/themeConfig'

export default function ColorPicker() {
  const { config, setBrandColor, muiTheme } = useFoundationTheme()
  const [hexInput, setHexInput] = useState(config.brandColor)

  // Sync local input when config changes externally (e.g. reset)
  useEffect(() => {
    setHexInput(config.brandColor)
  }, [config.brandColor])

  const handlePresetClick = (value: string) => {
    setBrandColor(value)
    setHexInput(value)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setBrandColor(val)
    }
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Brand Color
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
        {COLOR_PRESETS.map((preset) => {
          const isSelected =
            config.brandColor.toLowerCase() === preset.value.toLowerCase()
          return (
            <Tooltip key={preset.value} title={preset.label} placement="top">
              <Box
                onClick={() => handlePresetClick(preset.value)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: preset.value,
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${muiTheme.palette.background.paper}, 0 0 0 4px ${muiTheme.palette.primary.main}`
                    : 'none',
                  transition: 'box-shadow 150ms ease, transform 150ms ease',
                  '&:hover': { transform: 'scale(1.12)' },
                }}
              />
            </Tooltip>
          )
        })}
      </Stack>

      <TextField
        label="Custom color"
        placeholder="#000000"
        size="small"
        fullWidth
        value={hexInput}
        onChange={handleHexChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: config.brandColor,
                    border: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
