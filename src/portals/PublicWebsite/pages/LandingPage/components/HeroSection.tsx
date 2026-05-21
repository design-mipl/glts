import { Box, Typography, Button, Stack, Chip, TextField, Grid, Card } from '@mui/material'
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Zap,
  FileCheck,
  Upload,
  Clock,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicColors,
  publicFonts,
  publicLayout,
  publicShadows,
  publicTypography,
} from '../../../theme/publicSiteTokens'

const trustItems = [
  { icon: ShieldCheck, label: 'ISO 27001 certified' },
  { icon: Zap, label: '99.2% on-time filing' },
  { icon: FileCheck, label: 'OCR · 99%+ accuracy' },
]

export function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        mt: `-${publicLayout.navHeight}px`,
        pt: `${publicLayout.navHeight + 48}px`,
        pb: { xs: 12, md: 16 },
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        background: publicColors.heroGradient,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-8%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118,199,107,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, rgba(0,31,63,0.4), transparent)',
          pointerEvents: 'none',
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Chip
              label="Live visa engine · 100+ destinations"
              sx={{
                mb: 4,
                height: 36,
                px: 0.5,
                fontSize: publicTypography.caption,
                fontWeight: 600,
                backgroundColor: 'rgba(118, 199, 107, 0.15)',
                color: publicColors.green,
                border: '1px solid rgba(118, 199, 107, 0.35)',
                fontFamily: publicFonts.body,
              }}
            />

            <Typography
              component="h1"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: publicTypography.hero,
                fontWeight: 800,
                lineHeight: { xs: 1.08, lg: 1.02 },
                letterSpacing: { md: '-2px', lg: '-2.5px' },
                color: '#fff',
                mb: 3,
              }}
            >
              The global visa
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: `linear-gradient(90deg, ${publicColors.green} 0%, ${publicColors.greenBright} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                operating system.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: publicFonts.body,
                fontSize: publicTypography.bodyLg,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.82)',
                maxWidth: 560,
                mb: 5,
              }}
            >
              Passport OCR, visa matching, embassy tracking, and crew bulk onboarding — one
              platform for travelers, marine operators, and corporate travel teams.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                mb: 3,
                p: 1.5,
                backgroundColor: 'rgba(255,255,255,0.98)',
                borderRadius: '16px',
                boxShadow: publicShadows.float,
                maxWidth: 520,
              }}
            >
              <TextField
                placeholder="Where are you traveling?"
                fullWidth
                InputProps={{
                  startAdornment: <Search size={18} color={publicColors.textMuted} style={{ marginRight: 12 }} />,
                  sx: { fontSize: '16px', fontFamily: publicFonts.body },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    '& fieldset': { border: 'none' },
                  },
                }}
              />
              <Button
                variant="contained"
                href="/countries"
                endIcon={<ArrowRight size={18} />}
                sx={{
                  flexShrink: 0,
                  px: 4,
                  py: 1.75,
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '16px',
                  textTransform: 'none',
                  backgroundColor: publicColors.greenBright,
                  whiteSpace: 'nowrap',
                  '&:hover': { backgroundColor: publicColors.greenDark },
                }}
              >
                Find visa
              </Button>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5, mb: 6 }}>
              {['Schengen', 'UAE', 'Japan', 'UK'].map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  component="a"
                  href="/countries"
                  clickable
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    borderColor: 'rgba(255,255,255,0.25)',
                    fontSize: '14px',
                    height: 36,
                    fontFamily: publicFonts.body,
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              {trustItems.map(({ icon: Icon, label }) => (
                <Stack key={label} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={publicColors.green} />
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', fontWeight: 500 }}>
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'relative', height: 520, minHeight: 480 }}>
              {/* Back card — upload */}
              <Card
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 280,
                  p: 3,
                  borderRadius: publicLayout.cardRadius,
                  boxShadow: publicShadows.float,
                  border: `1px solid ${publicColors.borderSoft}`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: publicColors.greenMuted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Upload size={22} color={publicColors.greenBright} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: publicColors.text }}>
                      Passport scan
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: publicColors.textSecondary }}>
                      12 fields extracted
                    </Typography>
                  </Box>
                </Stack>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: publicColors.surfaceAlt,
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ width: '94%', height: '100%', bgcolor: publicColors.greenBright, borderRadius: 4 }} />
                </Box>
                <Typography sx={{ mt: 1.5, fontSize: '12px', color: publicColors.greenBright, fontWeight: 600 }}>
                  OCR complete · 99.1% confidence
                </Typography>
              </Card>

              {/* Main visa card */}
              <Card
                sx={{
                  position: 'absolute',
                  top: 72,
                  left: 0,
                  width: 340,
                  p: 3.5,
                  borderRadius: publicLayout.cardRadius,
                  boxShadow: publicShadows.float,
                  border: `1px solid ${publicColors.borderSoft}`,
                  zIndex: 2,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                  <Chip
                    label="Approved"
                    size="small"
                    sx={{
                      bgcolor: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  />
                  <Typography sx={{ fontSize: '12px', color: publicColors.textMuted, fontWeight: 600 }}>
                    APP-9923-847
                  </Typography>
                </Stack>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={5}>
                    <Typography sx={{ fontSize: '11px', color: publicColors.textMuted, fontWeight: 700 }}>
                      FROM
                    </Typography>
                    <Typography sx={{ fontSize: '28px', fontWeight: 800, color: publicColors.navy }}>
                      IND
                    </Typography>
                  </Grid>
                  <Grid size={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '20px' }}>→</Typography>
                  </Grid>
                  <Grid size={5}>
                    <Typography sx={{ fontSize: '11px', color: publicColors.textMuted, fontWeight: 700 }}>
                      TO
                    </Typography>
                    <Typography sx={{ fontSize: '28px', fontWeight: 800, color: publicColors.navy }}>
                      FRA
                    </Typography>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    bgcolor: publicColors.greenMuted,
                    borderLeft: `4px solid ${publicColors.greenBright}`,
                  }}
                >
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#047857' }}>
                    GreenLight Score 98 · Streamlined embassy path
                  </Typography>
                </Box>
              </Card>

              {/* Timeline card */}
              <Card
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 24,
                  width: 260,
                  p: 2.5,
                  borderRadius: '18px',
                  boxShadow: publicShadows.cardHover,
                  border: `1px solid ${publicColors.borderSoft}`,
                  zIndex: 3,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Clock size={18} color={publicColors.greenBright} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Embassy live</Typography>
                    <Typography sx={{ fontSize: '12px', color: publicColors.textSecondary }}>
                      Decision in ~9 days
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
