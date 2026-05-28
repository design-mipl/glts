import { Box, Typography, Grid, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { useFoundationTheme } from '@/design-system/ThemeContext'
import {
  publicDarkColors,
  publicLightColors,
  usePublicBrandColors,
} from '@/shared/theme/publicBrand'
import { Divider, Button } from '@/design-system/UIComponents'

const colorScales = [
  { name: 'primary', scale: tokens.color.primary },
  { name: 'neutral', scale: tokens.color.neutral },
  { name: 'error', scale: tokens.color.error },
  { name: 'success', scale: tokens.color.success },
  { name: 'warning', scale: tokens.color.warning },
  { name: 'info', scale: tokens.color.info },
] as const

const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const brandSwatches = [
  { label: 'Green bright', key: 'greenBright' as const },
  { label: 'Green dark', key: 'greenDark' as const },
  { label: 'Navy', key: 'navy' as const },
  { label: 'Surface', key: 'surface' as const },
  { label: 'Text', key: 'text' as const },
] as const

function ColorSwatch({ color, stop }: { color: string; stop: number }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ height: 36, bgcolor: color, borderRadius: 0.5 }} />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5, fontSize: '10px', color: 'text.secondary' }}>
        {stop}
      </Typography>
    </Box>
  )
}

const spacingEntries = Object.entries(tokens.spacing)
const radiusEntries = Object.entries(tokens.borderRadius)
const shadowEntries = Object.entries(tokens.shadow).filter(([k]) => k !== 'none')
const fontSizeEntries = Object.entries(tokens.fontSize)

export function ColorTokensShowcase() {
  const theme = useTheme()
  const { toggleMode, isDark } = useFoundationTheme()
  const colors = usePublicBrandColors()

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Locked GLTS brand (publicBrand)</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center" sx={{ mb: 2 }}>
            <Button variant="outlined" size="sm" onClick={toggleMode}>
              {isDark ? 'Light mode' : 'Dark mode'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Brand colors are fixed in code. Only light/dark mode can be toggled.
            </Typography>
          </Stack>
          <Stack direction="row" gap={2} flexWrap="wrap">
            {brandSwatches.map(({ label, key }) => (
              <Box key={key} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1,
                    bgcolor: colors[key],
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {label}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', fontSize: '10px' }}>
                  {colors[key]}
                </Typography>
              </Box>
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Light greenBright: {publicLightColors.greenBright} · Dark greenBright: {publicDarkColors.greenBright}
          </Typography>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Color Scales (tokens)</Typography>
          <Stack gap={1.5}>
            {colorScales.map(({ name, scale }) => (
              <Box key={name}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 600, textTransform: 'capitalize' }}>
                  {name}
                </Typography>
                <Stack direction="row" gap={0.5}>
                  {stops.map(stop => (
                    <ColorSwatch key={stop} color={scale[stop]} stop={stop} />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Spacing Scale (tokens.spacing)</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="flex-end">
            {spacingEntries.map(([key, val]) => (
              <Box key={key} sx={{ textAlign: 'center' }}>
                <Box sx={{ bgcolor: tokens.color.primary[500], width: val, height: val, mx: 'auto', borderRadius: '2px' }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontSize: '10px', color: 'text.secondary' }}>
                  {key}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', fontSize: '10px', color: 'text.disabled', fontFamily: 'monospace' }}>
                  {val}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Border Radius</Typography>
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
            {radiusEntries.map(([key, val]) => (
              <Box key={key} sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 48, height: 48, border: `2px solid ${tokens.color.primary[500]}`, borderRadius: val }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontSize: '10px', color: 'text.secondary' }}>
                  {key}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Shadows</Typography>
          <Stack gap={2}>
            {shadowEntries.map(([key, val]) => (
              <Box
                key={key}
                sx={{
                  p: 2,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 1,
                  boxShadow: val,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" fontWeight={600}>tokens.shadow.{key}</Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Font Size Scale</Typography>
          <Stack gap={1}>
            {fontSizeEntries.map(([key, val]) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography sx={{ fontSize: val, lineHeight: 1.3 }}>
                  The quick brown fox
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', flexShrink: 0 }}>
                  tokens.fontSize.{key} ({val})
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
