import { Box, Typography, Grid, Card, Stack, Button } from '@mui/material'
import { UserCheck, FileSearch, Radar, Route, ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx } from '@/shared/theme/publicBrand'

const benefits = [
  {
    icon: UserCheck,
    title: 'Dedicated Expert Assistance',
    description: 'A named specialist guides your case from intake through embassy decision.',
  },
  {
    icon: FileSearch,
    title: 'Document Review',
    description: 'Every document checked for completeness, consistency, and embassy fit.',
  },
  {
    icon: Radar,
    title: 'Application Tracking',
    description: 'Real-time status updates and milestone alerts until a decision is issued.',
  },
  {
    icon: Route,
    title: 'End-to-End Support',
    description: 'From requirement gathering to visa delivery — one team, one timeline.',
  },
]

export function VisaMasterSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.surface,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.greenBright,
                mb: 1.5,
              }}
            >
              Premium Service
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '26px', md: '34px' },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                mb: 1.5,
              }}
            >
              Visa Master
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                color: colors.textSecondary,
                lineHeight: 1.65,
                mb: 3,
              }}
            >
              Our premium assisted visa tier — expert oversight, priority handling, and full
              visibility from first document to final approval.
            </Typography>

            <Button
              variant="contained"
              href="/countries"
              endIcon={<ArrowRight size={16} />}
              sx={{ ...getMarketingPrimaryButtonSx(colors), px: 3.5 }}
            >
              Explore Visa Master
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {benefits.map(({ icon: Icon, title, description }) => (
                <Grid size={{ xs: 12, sm: 6 }} key={title}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 2.5,
                      borderRadius: '16px',
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                      bgcolor: colors.white,
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        borderColor: `${colors.greenBright}66`,
                        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
                      },
                    }}
                  >
                    <Stack spacing={1.75}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: colors.greenMuted,
                          border: `1px solid ${colors.green}33`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} color={colors.greenBright} strokeWidth={2.25} />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: publicFonts.heading,
                            fontSize: '16px',
                            fontWeight: 800,
                            color: colors.navy,
                            lineHeight: 1.3,
                            mb: 0.75,
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.55 }}>
                          {description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
