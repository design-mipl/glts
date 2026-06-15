import { Box, Typography, Grid, Card, Stack } from '@mui/material'
import { Shield, Plane, Hotel, Banknote, FileText } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const services = [
  {
    icon: Shield,
    title: 'Travel Insurance',
    description: 'Coverage aligned to your itinerary and embassy requirements.',
  },
  {
    icon: Plane,
    title: 'Flight Assistance',
    description: 'Booking support and itinerary documentation for visa applications.',
  },
  {
    icon: Hotel,
    title: 'Hotel Bookings',
    description: 'Confirmed stays that meet proof-of-accommodation standards.',
  },
  {
    icon: Banknote,
    title: 'Forex Assistance',
    description: 'Competitive rates and documentation for travel funds.',
  },
  {
    icon: FileText,
    title: 'Documentation Support',
    description: 'Itineraries, invitation letters, and supporting paperwork handled end-to-end.',
  },
]

export function AdditionalServicesSection() {
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
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb }}>
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
            Beyond Visas
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '26px', md: '32px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 1.25,
            }}
          >
            Additional travel services
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            Supporting services that keep your entire trip compliant and coordinated — not just the
            visa filing.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {services.map(({ icon: Icon, title, description }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={title}>
              <Card
                sx={{
                  height: '100%',
                  p: 2.5,
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                  bgcolor: colors.surface,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    borderColor: `${colors.greenBright}55`,
                    boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '11px',
                      bgcolor: colors.white,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={colors.greenBright} strokeWidth={2.25} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: '15px',
                      fontWeight: 800,
                      color: colors.navy,
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.55 }}>
                    {description}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
