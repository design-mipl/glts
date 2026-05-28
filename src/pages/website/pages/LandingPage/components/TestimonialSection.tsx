import { Box, Grid, Card, Typography, Avatar, Divider, Stack } from '@mui/material'
import { Quote } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicLayout, publicTypography, publicFonts, publicShadows, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const stats = [
  { value: '312', label: 'Crew rotated / quarter' },
  { value: '14', label: 'Ports cleared' },
  { value: '0', label: 'Missed sailings' },
]

export function TestimonialSection() {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ py: publicLayout.sectionMedium, backgroundColor: colors.surface }}>
      <PublicContainer>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card
              sx={{
                p: { xs: 4, md: 6 },
                backgroundColor: colors.navy,
                color: '#fff',
                border: 'none',
                borderRadius: publicLayout.cardRadius,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: publicShadows.float,
              }}
            >
              <Typography
                sx={{
                  color: colors.green,
                  fontSize: publicTypography.overline,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 3,
                  alignSelf: 'flex-start',
                }}
              >
                Case study · Nippon Shipping
              </Typography>

              <Quote size={32} color="rgba(255,255,255,0.2)" style={{ marginBottom: 20 }} />

              <Typography
                sx={{
                  fontSize: { xs: '20px', md: '24px' },
                  fontWeight: 600,
                  lineHeight: 1.65,
                  flex: 1,
                  mb: 4,
                  fontFamily: publicFonts.heading,
                }}
              >
                &ldquo;We rotated 312 crew across 14 ports last quarter without a single missed
                sailing. That used to take three full-time coordinators.&rdquo;
              </Typography>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 3 }} />

              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: colors.greenBright, fontWeight: 700 }}>
                  HK
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>Hiroshi Kondo</Typography>
                  <Typography sx={{ opacity: 0.65, fontSize: '14px' }}>
                    Director, Crew Operations · Nippon Shipping
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {stats.map(({ value, label }) => (
                <Card
                  key={label}
                  sx={{
                    p: 4,
                    flex: 1,
                    borderRadius: publicLayout.cardRadius,
                    border: `1px solid ${colors.border}`,
                    boxShadow: publicShadows.card,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontWeight: 800,
                      fontSize: '40px',
                      color: colors.greenBright,
                      lineHeight: 1,
                      mb: 1,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography sx={{ color: colors.textSecondary, fontSize: publicTypography.body, fontWeight: 500 }}>
                    {label}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
