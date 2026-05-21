import { Box, Typography, Grid, Card, Chip, Button, Stack, LinearProgress } from '@mui/material'
import { ArrowRight, TrendingUp, FileText } from 'lucide-react'
import { getAllCountries } from '../../../../../shared/services/visaService'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicColors,
  publicFonts,
  publicLayout,
  publicShadows,
  publicTypography,
} from '../../../theme/publicSiteTokens'

function difficultyLabel(rating: number) {
  if (rating >= 90) return { label: 'Easy', color: publicColors.greenBright }
  if (rating >= 75) return { label: 'Moderate', color: '#F59E0B' }
  return { label: 'Complex', color: '#EF4444' }
}

export function TrendingDestinations() {
  const countries = [...getAllCountries()].sort((a, b) => b.trendingPercent - a.trendingPercent)

  return (
    <Box component="section" sx={{ py: publicLayout.sectionMajor, bgcolor: '#fff' }}>
      <PublicContainer>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
          spacing={3}
          sx={{ mb: { xs: 6, md: 10 } }}
        >
          <Box sx={{ maxWidth: 640 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <TrendingUp size={18} color={publicColors.greenBright} />
              <Typography
                sx={{
                  fontSize: publicTypography.overline,
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: publicColors.greenBright,
                }}
              >
                Live destinations
              </Typography>
            </Stack>
            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: publicTypography.h2,
                fontWeight: 800,
                color: publicColors.navy,
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Trending destinations{' '}
              <Box component="span" sx={{ color: publicColors.greenBright }}>
                this month
              </Box>
            </Typography>
            <Typography sx={{ fontSize: publicTypography.body, color: publicColors.textSecondary, lineHeight: 1.7 }}>
              Real-time ETAs, approval rates, and document requirements — updated continuously.
            </Typography>
          </Box>
          <Button
            href="/countries"
            endIcon={<ArrowRight size={18} />}
            sx={{
              color: publicColors.navy,
              fontWeight: 700,
              fontSize: '15px',
              textTransform: 'none',
              alignSelf: { xs: 'flex-start', md: 'center' },
            }}
          >
            View all destinations
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {countries.map(country => {
            const diff = difficultyLabel(country.rating)
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={country.id}>
                <Card
                  component="a"
                  href={`/countries/${country.id}`}
                  sx={{
                    height: '100%',
                    p: 3.5,
                    borderRadius: publicLayout.cardRadius,
                    border: `1px solid ${publicColors.border}`,
                    boxShadow: publicShadows.card,
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: publicShadows.cardHover,
                      borderColor: publicColors.greenBright,
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '48px', lineHeight: 1 }}>{country.flags}</Typography>
                    {country.trendingPercent > 0 && (
                      <Chip
                        label={`+${country.trendingPercent}%`}
                        size="small"
                        sx={{
                          bgcolor: '#FEF3C7',
                          color: '#92400E',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontWeight: 700,
                      fontSize: '22px',
                      color: publicColors.navy,
                      mb: 0.5,
                    }}
                  >
                    {country.name}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: publicColors.textSecondary, mb: 3 }}>
                    {country.region} · Embassy route
                  </Typography>

                  <Stack spacing={2.5} sx={{ flex: 1, mb: 3 }}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: publicColors.textMuted }}>
                          APPROVAL RATE
                        </Typography>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: publicColors.navy }}>
                          {country.rating}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={country.rating}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: publicColors.surfaceAlt,
                          '& .MuiLinearProgress-bar': { bgcolor: diff.color, borderRadius: 3 },
                        }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: publicColors.textMuted }}>
                          ETA
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: publicColors.navy }}>
                          {country.processingTime}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: publicColors.textMuted }}>
                          FROM
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: publicColors.navy }}>
                          ₹{country.price.toLocaleString('en-IN')}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <FileText size={14} color={publicColors.textMuted} />
                      <Typography sx={{ fontSize: '13px', color: publicColors.textSecondary }}>
                        6 documents · {diff.label}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    sx={{
                      borderColor: publicColors.greenBright,
                      color: publicColors.greenBright,
                      fontWeight: 700,
                      py: 1.25,
                      borderRadius: '12px',
                      textTransform: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    View details
                  </Button>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
          <Button
            variant="contained"
            href="/countries"
            size="large"
            endIcon={<ArrowRight size={20} />}
            sx={{
              px: 5,
              py: 1.75,
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'none',
              backgroundColor: publicColors.greenBright,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              '&:hover': { backgroundColor: publicColors.greenDark },
            }}
          >
            Browse all 100+ destinations
          </Button>
        </Box>
      </PublicContainer>
    </Box>
  )
}
