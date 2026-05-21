import { Box, Drawer, Typography, IconButton, Divider, Button, Stack } from '@mui/material'
import { X } from 'lucide-react'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import { DEFAULT_THEME_CONFIG } from '../../../design-system/themeConfig'
import ModeToggle from './ModeToggle'
import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'
import NavigationColorSection from './NavigationColorSection'
import AdvancedColorsSection from './AdvancedColorsSection'
import TemplateSelector from './TemplateSelector'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

export default function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { setConfig } = useFoundationTheme()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', md: 440 },
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Customize
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personalize your experience
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ mt: 0.5 }}>
          <X size={18} />
        </IconButton>
      </Box>

      <Divider />

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
        <Stack spacing={3}>
          <ModeToggle />
          <Divider />
          <ColorPicker />
          <Divider />
          <NavigationColorSection />
          <Divider />
          <AdvancedColorsSection />
          <Divider />
          <FontSelector />
          <Divider />
          <TemplateSelector />
        </Stack>
      </Box>

      <Divider />

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Settings are saved automatically
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          onClick={() => setConfig(DEFAULT_THEME_CONFIG)}
          sx={{ flexShrink: 0 }}
        >
          Reset
        </Button>
      </Box>
    </Drawer>
  )
}
