import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Grid,
  Card,
  Divider,
} from '@mui/material'
import {
  ArrowRight,
  Check,
  FileCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingHeroMinHeight } from '../landingPageSpacing'
import { publicFonts, publicShadows, usePublicBrandColors, brandPrimaryGreenRgb } from '@/shared/theme/publicBrand'

const trustIndicators = ['Expert Review', 'Live Tracking', 'Country-Specific Guidance']

const reviewChecklist = [
  { label: 'Passport verified', done: true },
  { label: 'Documents matched', done: true },
  { label: 'Embassy requirements', done: true },
]

export function HeroSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#F4FAF6',
        minHeight: landingHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Decorative shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          right: '8%',
          width: 200,
          height: 120,
          borderRadius: '24px',
          bgcolor: 'rgba(118, 199, 107, 0.08)',
          transform: 'rotate(8deg)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: '4%',
          width: 140,
          height: 90,
          borderRadius: '20px',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.06)`,
          transform: 'rotate(-6deg)',
          pointerEvents: 'none',
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 5, lg: 6 }} alignItems="center">
          {/* Left — copy & search */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '36px', sm: '44px', md: '52px' },
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                color: colors.navy,
                mb: 2.5,
              }}
            >
              Visas Done Right —{' '}
              <Box component="span" sx={{ color: colors.greenBright }}>
                Before They Go Wrong.
              </Box>
            </Typography>

            <Box sx={{ maxWidth: 520, mb: 3 }}>
              <Stack spacing={0.75} sx={{ mb: 2 }}>
                {['Expert-led review.', 'Tech-enabled tracking.', 'Zero guesswork.'].map(line => (
                  <Typography
                    key={line}
                    sx={{
                      fontSize: { xs: '16px', md: '17px' },
                      fontWeight: 600,
                      lineHeight: 1.5,
                      color: colors.navy,
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Stack>
              <Typography
                sx={{
                  fontSize: { xs: '15px', md: '16px' },
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color: colors.greenDark,
                }}
              >
                We review before you submit.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/countries')}
                endIcon={<ArrowRight size={16} />}
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: '999px',
                  bgcolor: colors.greenBright,
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: colors.greenDark },
                }}
              >
                Start visa assistance
              </Button>
              <Button
                variant="outlined"
                href="/track"
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: '999px',
                  borderColor: colors.border,
                  color: colors.navy,
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'none',
                  bgcolor: colors.white,
                  '&:hover': {
                    borderColor: colors.greenBright,
                    bgcolor: colors.greenMuted,
                  },
                }}
              >
                Book consultation
              </Button>
            </Stack>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { value: '25+', label: 'Years experience' },
                { value: '450K+', label: 'Visas processed' },
                { value: '190+', label: 'Countries covered' },
              ].map(({ value, label }) => (
                <Grid size={{ xs: 4 }} key={label}>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: publicFonts.heading,
                        fontSize: { xs: '22px', sm: '26px' },
                        fontWeight: 800,
                        color: colors.greenBright,
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: colors.textSecondary }}>
                      {label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ flexWrap: 'wrap', gap: 2 }}>
              {trustIndicators.map(label => (
                <Stack key={label} direction="row" spacing={1} alignItems="center">
                  <Check size={16} color={colors.greenBright} strokeWidth={2.5} />
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.textSecondary }}>
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Right — visa preview card */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                perspective: 1200,
                py: { xs: 2, lg: 0 },
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  p: 2.5,
                  borderRadius: '20px',
                  border: `1px solid ${colors.border}`,
                  boxShadow: publicShadows.float,
                  bgcolor: colors.white,
                  transform: { md: 'rotate(2deg)' },
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: { md: 'rotate(0deg) scale(1.01)' } },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label="Ready to submit"
                    size="small"
                    sx={{
                      height: 24,
                      fontWeight: 700,
                      fontSize: '11px',
                      bgcolor: '#D1FAE5',
                      color: '#065F46',
                    }}
                  />
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: colors.textMuted }}>
                    GLTS-APP-2026-847
                  </Typography>
                  <Box
                    component="img"
                    src="/sm_logo.jpg"
                    alt=""
                    sx={{ width: 28, height: 28, borderRadius: '8px', objectFit: 'cover' }}
                  />
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', mb: 0.5 }}>
                    PRE-SUBMISSION REVIEW
                  </Typography>
                  <Typography sx={{ fontSize: '18px', fontWeight: 800, color: colors.navy, lineHeight: 1.2, mb: 0.5 }}>
                    Schengen Tourist · Germany
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: colors.textSecondary }}>
                    1 applicant · 90-day stay · Submitted after expert sign-off
                  </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

                <Stack spacing={1.25} sx={{ mb: 2 }}>
                  {reviewChecklist.map(({ label, done }) => (
                    <Stack key={label} direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '6px',
                          bgcolor: done ? colors.greenMuted : colors.white,
                          border: `1px solid ${done ? colors.green + '44' : colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {done ? (
                          <FileCheck size={13} color={colors.greenBright} strokeWidth={2.5} />
                        ) : null}
                      </Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: colors.navy }}>
                        {label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: colors.greenMuted,
                    border: `1px solid ${colors.green}33`,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: `4px solid ${colors.border}`,
                        borderTopColor: colors.greenBright,
                        borderRightColor: colors.greenBright,
                        transform: 'rotate(-45deg)',
                      }}
                    />
                    <Typography
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: colors.greenDark,
                      }}
                    >
                      94%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 800, color: colors.navy }}>
                      Expert review complete · 94% readiness
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: colors.textSecondary, lineHeight: 1.4 }}>
                      Documents verified and embassy requirements confirmed before submission
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
