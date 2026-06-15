import { Box, Typography, Grid, Card, Stack } from '@mui/material'
import { BookOpen, Files, Globe, BadgeCheck } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const features = [
  {
    icon: BookOpen,
    title: 'Passport & Travel History',
    description:
      'Review passport validity and previous travel records before submission.',
  },
  {
    icon: Files,
    title: 'Documentation Consistency',
    description:
      'Identify missing, incomplete, or conflicting documents before they become issues.',
  },
  {
    icon: Globe,
    title: 'Country-Specific Validation',
    description:
      'Check destination requirements and supporting documents based on country rules.',
  },
  {
    icon: BadgeCheck,
    title: 'Visa Category Eligibility',
    description:
      'Ensure the correct visa category is selected before the application is submitted.',
  },
]

export function WhyGreenLightSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Grid container spacing={{ xs: 4, md: 5 }} alignItems="center">
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
              Why GreenLight
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
              Most visa agents focus on submission.
              <Box component="span" sx={{ display: 'block', color: colors.greenBright }}>
                We focus on prevention.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                color: colors.textSecondary,
                lineHeight: 1.65,
              }}
            >
              We review every application before it reaches the embassy to reduce avoidable delays,
              rejections, documentation issues, and visa category mistakes.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {features.map(({ icon: Icon, title, description }) => (
                <Grid size={{ xs: 6 }} key={title}>
                  <Card
                    sx={{
                      height: '100%',
                      p: { xs: 2, sm: 2.5 },
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
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={20} color={colors.greenBright} strokeWidth={2.25} />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontFamily: publicFonts.heading,
                            fontSize: { xs: '14px', sm: '16px' },
                            fontWeight: 800,
                            color: colors.navy,
                            lineHeight: 1.3,
                            mb: 0.75,
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: '13px', sm: '14px' },
                            color: colors.textSecondary,
                            lineHeight: 1.55,
                          }}
                        >
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
