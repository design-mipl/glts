import { Box, Grid } from '@mui/material'
import { PublicContainer } from '@/pages/website/components/PublicContainer'
import { applyCanvasSx } from '@/pages/website/theme/applyFlowTheme'
import { RetailAccountProfileColumn } from './RetailAccountProfileColumn'
import { RetailApplicationsPanel } from './RetailApplicationsPanel'

/** Website-style retail account: profile + documents | applications. */
export function RetailAccountPage() {
  return (
    <Box sx={{ ...applyCanvasSx, py: { xs: 3, md: 5 } }}>
      <PublicContainer>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <RetailAccountProfileColumn />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <RetailApplicationsPanel />
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
