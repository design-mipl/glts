import { Box, Tooltip, Stack } from '@mui/material'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import { COLOR_PRESETS } from '../../../design-system/themeConfig'
import ColorPickerField from './ColorPickerField'

export default function ColorPicker() {
  const { config, setBrandColor, muiTheme } = useFoundationTheme()

  const handlePresetClick = (value: string) => {
    setBrandColor(value)
  }

  return (
    <Box>
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

      <ColorPickerField
        label="Brand Color"
        value={config.brandColor}
        onChange={setBrandColor}
        previewColor={config.brandColor}
        helpText="Choose the main accent color used across the theme."
      />
    </Box>
  )
}
