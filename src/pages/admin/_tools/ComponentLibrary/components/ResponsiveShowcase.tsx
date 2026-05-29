import { Box, Typography, Grid, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { tokens } from '@/design-system/tokens'
import { Divider, StatCard, Button } from '@/design-system/UIComponents'
import { Users, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'

const breakpoints = [
  { name: 'xs', width: '0px', description: 'Mobile portrait' },
  { name: 'sm', width: '600px', description: 'Mobile landscape / small tablet' },
  { name: 'md', width: '900px', description: 'Tablet' },
  { name: 'lg', width: '1024px', description: 'Desktop (sidebar shows)' },
  { name: 'xl', width: '1280px', description: 'Wide desktop' },
  { name: 'xl', width: '1440px', description: 'Large desktop' },
  { name: 'xxxl', width: '1600px', description: 'Extra large' },
  { name: 'uhd', width: '1920px', description: '4K / UHD' },
]

export function ResponsiveShowcase() {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'))
  const isXl = useMediaQuery(theme.breakpoints.between('xl', 'xl'))
  const isXxl = useMediaQuery(theme.breakpoints.up('xl'))

  const currentBp = isXxl ? 'xxl+' : isXl ? 'xl' : isLg ? 'lg' : isMd ? 'md' : isSm ? 'sm' : isXs ? 'xs' : '?'

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Current breakpoint indicator */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Current Breakpoint</Typography>
          <Box
            sx={{
              p: 3,
              bgcolor: tokens.color.primary[50],
              border: `2px solid ${tokens.color.primary[200]}`,
              borderRadius: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700} color="primary">
              {currentBp}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {breakpoints.find(b => b.name === currentBp.replace('+', ''))?.description ?? 'Resize to see changes'}
            </Typography>
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Breakpoint table */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Breakpoint Reference</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {breakpoints.map((bp) => {
              const active = currentBp === bp.name || (currentBp === 'xxl+' && (bp.name === 'xl' || bp.name === 'xxxl' || bp.name === 'uhd'))
              return (
                <Box
                  key={bp.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: active ? tokens.color.primary[50] : 'transparent',
                    border: `1px solid ${active ? tokens.color.primary[200] : tokens.color.neutral[200]}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ width: 40, color: active ? 'primary.main' : 'text.secondary' }}
                  >
                    {bp.name}
                  </Typography>
                  <Typography variant="body2" sx={{ width: 80, color: 'text.secondary', fontFamily: 'monospace' }}>
                    â‰¥ {bp.width}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bp.description}
                  </Typography>
                  {active && (
                    <Box sx={{ ml: 'auto', px: 1, py: 0.25, bgcolor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>current</Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Responsive grid */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Responsive Grid (xs:12 â†’ sm:6 â†’ lg:3)</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Users" value="12,480" icon={<Users size={20} />} delta={12} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Revenue" value="$48K" icon={<DollarSign size={20} />} delta={8.4} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Growth" value="23.5%" icon={<TrendingUp size={20} />} delta={-3.2} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Orders" value="1,024" icon={<ShoppingCart size={20} />} delta={5.1} deltaLabel="vs last month" />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* sx responsive example */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>sx Responsive Props</Typography>
          <Box
            sx={{
              p: { xs: 2, md: 4, lg: 6 },
              bgcolor: tokens.color.neutral[100],
              borderRadius: 2,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="body2">
              This box has responsive padding (<code>xs:2 â†’ md:4 â†’ lg:6</code>)
              and text alignment (<code>xs:center â†’ md:left</code>).
              Resize the window to see changes.
            </Typography>
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Conditional rendering */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Conditional Visibility (sx display)</Typography>
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Button variant="contained">Mobile only</Button>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex', lg: 'none' } }}>
              <Button variant="outlined">Tablet only</Button>
            </Box>
            <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
              <Button variant="text">Desktop only</Button>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Button variant="outlined">Always visible</Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

