import { Box, Typography, Grid } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { landingTrustFloatOverlap } from '../landingPageSpacing'

const metrics = [
  { value: '25+', label: 'Years Experience' },
  { value: '450K+', label: 'Visas Processed' },
  { value: '190+', label: 'Countries Covered' },
]

export function TrustIndicatorsSection() {
  const colors = usePublicBrandColors()
  const overlap = landingTrustFloatOverlap

  return (
    <Box
      component="section"
      aria-label="Trust indicators"
      sx={{
        position: 'relative',
        zIndex: 3,
        mt: { xs: -overlap.xs, md: -overlap.md },
        mb: { xs: -overlap.xs, md: -overlap.md },
        bgcolor: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            mx: 'auto',
            maxWidth: 960,
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.75, md: 3.25 },
            borderRadius: '28px',
            bgcolor: colors.white,
            border: `1px solid ${alpha(colors.border, 0.85)}`,
            boxShadow:
              '0 20px 56px rgba(15, 23, 42, 0.14), 0 8px 24px rgba(15, 23, 42, 0.08)',
            pointerEvents: 'auto',
          }}
        >
          <Grid container spacing={{ xs: 0, sm: 0 }} alignItems="stretch">
            {metrics.map(({ value, label }, index) => (
              <Grid
                size={{ xs: 12, sm: 4 }}
                key={label}
                sx={{
                  textAlign: 'center',
                  py: { xs: 2, sm: 0.5 },
                  borderRight: {
                    xs: 'none',
                    sm: index < metrics.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
                  },
                  borderBottom: {
                    xs: index < metrics.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
                    sm: 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.75,
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '28px', md: '32px' },
                      fontWeight: 800,
                      color: colors.greenBright,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.textSecondary,
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </PublicContainer>
    </Box>
  )
}
