import { Box, Typography, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Sun, Moon } from 'lucide-react'
import { useFoundationTheme } from '../../../design-system/ThemeContext'

export default function ModeToggle() {
  const { isDark, setMode } = useFoundationTheme()

  const options = [
    { value: 'light' as const, label: 'Light', Icon: Sun,  active: !isDark },
    { value: 'dark'  as const, label: 'Dark',  Icon: Moon, active:  isDark },
  ]

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Appearance
      </Typography>

      <Stack direction="row" spacing={1}>
        {options.map(({ value, label, Icon, active }) => (
          <Box
            key={value}
            onClick={() => setMode(value)}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.75,
              py: 2,
              px: 1,
              borderRadius: 2,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: active ? 'primary.main' : 'divider',
              bgcolor: active
                ? (theme) => alpha(theme.palette.primary.main, 0.08)
                : 'transparent',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <Icon size={22} style={{ color: 'inherit' }} />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: active ? 'primary.main' : 'text.secondary' }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
