import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
  Grid,
  Card,
  Divider,
} from '@mui/material'
import {
  ArrowRight,
  Search,
  Shield,
  Zap,
  Star,
  Globe,
  Calendar,
  Users,
  Mic,
  Plane,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, publicShadows, usePublicBrandColors, brandPrimaryGreenRgb } from '@/shared/theme/publicBrand'
import { getAllCountries } from '@/shared/services/visaService'

const tryLinks = [
  'Schengen for honeymoon',
  'Bahrain transit',
  'Dubai 30-day',
  'UK student visa',
]

const trustRow = [
  { icon: Shield, label: 'ISO 27001' },
  { icon: Zap, label: '99.2% on-time' },
  { icon: Star, label: '4.9 · 42k reviews' },
]

function SearchField({
  icon: Icon,
  label,
  value,
  placeholder,
}: {
  icon: typeof Search
  label: string
  value?: string
  placeholder?: string
}) {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 140 }, px: { sm: 1.5 }, py: { xs: 1, sm: 0 } }}>
      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 700,
          color: colors.textMuted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          mb: 0.5,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon size={16} color={colors.textMuted} />
        <TextField
          variant="standard"
          placeholder={placeholder ?? value}
          defaultValue={value}
          fullWidth
          InputProps={{ disableUnderline: true }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '13px',
              fontWeight: 600,
              color: colors.navy,
              p: 0,
            },
          }}
        />
      </Stack>
    </Box>
  )
}

export function HeroSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const destCount = getAllCountries().length

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#F4FAF6',
        pt: { xs: 4, md: 6 },
        pb: { xs: 6, md: 8 },
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

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 5, lg: 6 }} alignItems="center">
          {/* Left — copy & search */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Chip
              icon={<Globe size={14} />}
              label={`Visa engine · ${destCount} destinations`}
              sx={{
                mb: 2.5,
                height: 32,
                fontWeight: 600,
                fontSize: '12px',
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
                border: `1px solid ${colors.green}44`,
                '& .MuiChip-icon': { color: colors.greenBright },
              }}
            />

            <Typography
              component="h1"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '36px', sm: '44px', md: '52px' },
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                color: colors.navy,
                mb: 2,
              }}
            >
              Your visa,{' '}
              <Box component="span" sx={{ color: colors.greenBright }}>
                in days—
              </Box>
              <br />
              not weeks.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                lineHeight: 1.65,
                color: colors.textSecondary,
                maxWidth: 520,
                mb: 3,
              }}
            >
              Upload your passport. We extract every detail, match you to the right visa, and walk
              you through what to do next. Built for solo travelers, corporate teams, and marine
              crews.
            </Typography>

            {/* Pill search */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { md: 'center' },
                gap: { xs: 1.5, md: 0 },
                p: { xs: 2, md: 1 },
                pr: { md: 1 },
                bgcolor: colors.white,
                borderRadius: '999px',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
                maxWidth: 600,
                mb: 2,
              }}
            >
              <SearchField
                icon={Search}
                label="Destination"
                placeholder="Type a country, city or 'family trip'…"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', md: 'block' }, borderColor: colors.border }}
              />
              <SearchField icon={Calendar} label="Dates" value="Mar 12 – 28" />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', md: 'block' }, borderColor: colors.border }}
              />
              <SearchField icon={Users} label="Travelers" value="2 travelers" />
              <Button
                variant="contained"
                onClick={() => navigate('/countries')}
                endIcon={<ArrowRight size={16} />}
                sx={{
                  flexShrink: 0,
                  mx: { md: 0.5 },
                  px: 3,
                  py: 1.25,
                  borderRadius: '999px',
                  bgcolor: colors.greenBright,
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  alignSelf: { xs: 'stretch', md: 'center' },
                  '&:hover': { bgcolor: colors.greenDark },
                }}
              >
                Find visa
              </Button>
            </Box>

            {/* Try chips */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: colors.textMuted }}>
                Try
              </Typography>
              {tryLinks.map(label => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  onClick={() => navigate('/countries')}
                  sx={{
                    height: 28,
                    fontSize: '11px',
                    fontWeight: 600,
                    bgcolor: colors.white,
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: colors.greenMuted },
                  }}
                />
              ))}
              <Chip
                icon={<Mic size={12} />}
                label="Voice"
                size="small"
                sx={{
                  height: 28,
                  fontSize: '11px',
                  fontWeight: 700,
                  bgcolor: colors.greenBright,
                  color: '#fff',
                  '& .MuiChip-icon': { color: '#fff' },
                }}
              />
            </Stack>

            {/* Trust */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ flexWrap: 'wrap', gap: 2 }}>
              {trustRow.map(({ icon: Icon, label }) => (
                <Stack key={label} direction="row" spacing={1} alignItems="center">
                  <Icon size={16} color={colors.greenBright} strokeWidth={2.5} />
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
                    label="Approved"
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

                <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Grid size={5}>
                    <Typography sx={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted }}>
                      FROM
                    </Typography>
                    <Typography sx={{ fontSize: '22px', fontWeight: 800, color: colors.navy, lineHeight: 1.1 }}>
                      IND
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: colors.textSecondary }}>New Delhi</Typography>
                  </Grid>
                  <Grid size={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: colors.greenMuted,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plane size={18} color={colors.greenBright} />
                    </Box>
                  </Grid>
                  <Grid size={5} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted }}>
                      TO
                    </Typography>
                    <Typography sx={{ fontSize: '22px', fontWeight: 800, color: colors.navy, lineHeight: 1.1 }}>
                      FRA
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: colors.textSecondary }}>Schengen · 90d</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {[
                    { label: 'TYPE', value: 'Tourist · C' },
                    { label: 'STAY', value: '21 days' },
                    { label: 'ETA', value: '12 days' },
                  ].map(({ label, value }) => (
                    <Grid size={4} key={label}>
                      <Typography sx={{ fontSize: '9px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em' }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.navy }}>{value}</Typography>
                    </Grid>
                  ))}
                </Grid>

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
                      Strong profile · 94 Greenlight Score
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: colors.textSecondary, lineHeight: 1.4 }}>
                      Approval probability based on 1.2k similar applicants
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
