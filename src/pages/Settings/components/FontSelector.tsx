import { Box, Typography, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import { FONT_OPTIONS } from '../../../design-system/themeConfig'

export default function FontSelector() {
  const { config, setFontFamily } = useFoundationTheme()

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Font Family
      </Typography>

      <Stack spacing={1}>
        {FONT_OPTIONS.map((option) => {
          const isSelected = config.fontFamily === option.value
          return (
            <Box
              key={option.value}
              onClick={() => setFontFamily(option.value)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderRadius: 1,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected
                  ? (theme) => alpha(theme.palette.primary.main, 0.08)
                  : 'transparent',
                transition: 'border-color 150ms ease, background-color 150ms ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <Typography
                variant="body2"
                fontWeight={isSelected ? 600 : 400}
                sx={{
                  fontFamily: option.value,
                  color: isSelected ? 'primary.main' : 'text.primary',
                }}
              >
                {option.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: option.value,
                  fontSize: '1.1rem',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  lineHeight: 1,
                }}
              >
                Aa
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
