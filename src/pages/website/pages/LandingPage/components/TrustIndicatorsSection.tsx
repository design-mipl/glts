import { Box, Typography, Grid, Stack } from '@mui/material'
import { Award, FileCheck, Globe2, BadgeCheck, Building2 } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const metrics = [
  { icon: Award, value: '25+', label: 'Years Experience' },
  { icon: FileCheck, value: '450K+', label: 'Visas Processed' },
  { icon: Globe2, value: '190+', label: 'Countries Covered' },
]

const credentials = [
  { icon: BadgeCheck, label: 'IATA Accredited' },
  { icon: Building2, label: 'Trusted by Global Companies' },
]

export function TrustIndicatorsSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.navy,
        py: { xs: 5, md: 6 },
        borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
      }}
    >
      <PublicContainer variant="hero">
        <Grid container spacing={{ xs: 3, md: 2 }} alignItems="center" sx={{ mb: { xs: 3, md: 4 } }}>
          {metrics.map(({ icon: Icon, value, label }) => (
            <Grid size={{ xs: 12, sm: 4 }} key={label}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                  px: { sm: 1 },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={colors.greenBright} strokeWidth={2} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '28px', md: '32px' },
                      fontWeight: 800,
                      color: colors.greenBright,
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)' }}>
                    {label}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            pt: { xs: 3, md: 3.5 },
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {credentials.map(({ icon: Icon, label }) => (
            <Stack
              key={label}
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{
                px: 2,
                py: 1,
                borderRadius: '999px',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <Icon size={16} color={colors.greenBright} strokeWidth={2.25} />
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </PublicContainer>
    </Box>
  )
}
