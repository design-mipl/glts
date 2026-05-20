import { Box, Grid, Paper, Typography } from '@mui/material'
import { useFoundationBreakpointKey } from '../../hooks/useResponsiveValue'

export default function ResponsiveGrid() {
  const bp = useFoundationBreakpointKey()

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Active breakpoint key: {bp}
      </Typography>
      <Grid container spacing={2}>
        {['A', 'B', 'C', 'D'].map((x) => (
          <Grid
            key={x}
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6,
              xl: 6,
              desktop: 3,
              desktopMd: 3,
              desktopLg: 3,
              desktopXl: 3,
              desktopUhd: 3,
            }}
          >
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              {x}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
