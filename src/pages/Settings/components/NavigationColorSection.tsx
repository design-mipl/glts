import { Box, Stack, Typography } from '@mui/material'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import { getNavigationColor } from '../../../design-system/themeConfig'
import ColorPickerField from './ColorPickerField'

function NavigationPreview({
  label,
  color,
  textColor,
}: {
  label: string
  color: string
  textColor: string
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: color,
        px: 1.5,
        py: 1.25,
      }}
    >
      <Typography variant="caption" sx={{ color: textColor, display: 'block', opacity: 0.8 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ color: textColor }}>
        Sidebar preview
      </Typography>
    </Box>
  )
}

export default function NavigationColorSection() {
  const {
    config,
    muiTheme,
    setNavigationColor,
    resetNavigationColor,
  } = useFoundationTheme()

  const lightPreview = getNavigationColor('light', config.navigationColor)
  const darkPreview = getNavigationColor('dark', config.navigationColor)

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" gap={1.5}>
        <NavigationPreview label="Light" color={lightPreview} textColor="#111827" />
        <NavigationPreview label="Dark" color={darkPreview} textColor="#FFFFFF" />
      </Stack>

      <ColorPickerField
        label="Navigation Color"
        value={config.navigationColor?.base ?? ''}
        onChange={(value) => setNavigationColor(value || undefined)}
        previewColor={muiTheme.foundation.navigation.background}
        allowEmpty
        onReset={resetNavigationColor}
        resetLabel="Reset to Default"
        helpText="Choose a color for the sidebar. A lighter shade is used in light mode and a darker shade in dark mode. Leave empty for the default white or gray surface."
      />
    </Stack>
  )
}
