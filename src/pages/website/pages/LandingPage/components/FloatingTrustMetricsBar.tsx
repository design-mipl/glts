import { Box, Typography, Grid } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Award, FileCheck, Globe2 } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const metrics = [
  { icon: Award, value: '25+', label: 'Years Experience' },
  { icon: FileCheck, value: '450K+', label: 'Visas Processed' },
  { icon: Globe2, value: '190+', label: 'Countries Covered' },
]

export function FloatingTrustMetricsBar() {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        transform: 'translateY(50%)',
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      <PublicContainer variant="hero" sx={{ pointerEvents: 'auto' }}>
        <Box
          sx={{
            mx: 'auto',
            maxWidth: 960,
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderRadius: '20px',
            bgcolor: alpha(colors.white, 0.92),
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${alpha(colors.border, 0.9)}`,
            boxShadow: '0 16px 48px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.04)',
          }}
        >
          <Grid container spacing={{ xs: 2, md: 0 }} alignItems="center">
            {metrics.map(({ icon: Icon, value, label }, index) => (
              <Grid
                size={{ xs: 12, sm: 4 }}
                key={label}
                sx={{
                  textAlign: 'center',
                  borderRight: {
                    xs: 'none',
                    sm: index < metrics.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'column' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: { xs: 1.5, sm: 0.75 },
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: 'flex', sm: 'none' },
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: colors.greenMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={colors.greenBright} strokeWidth={2} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '24px', md: '28px' },
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
