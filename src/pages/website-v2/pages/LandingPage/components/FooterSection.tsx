import { Box, Typography, Link, Divider, Stack, Grid } from '@mui/material'
import { FooterWorldMapWatermark } from '../../../components/FooterWorldMapWatermark'
import { PublicContainer } from '../../../components/PublicContainer'
import { GREENLIGHT_LOGO_DARK_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const footerSections: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: 'Retail Visa Services', href: '/v2' },
    { label: 'Marine Visa Services', href: '/v2/marine-crew' },
    { label: 'Corporate Visa Services', href: '/v2/corporate' },
    { label: 'Travel Partners', href: '/v2#specialist-visa-services' },
    { label: 'Destinations', href: '/v2/countries' },
  ],
  Company: [
    { label: 'About Us', href: '/v2/about' },
    { label: 'Contact Us', href: '/v2/track' },
    { label: 'Blog / Visa Updates', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Refund & Cancellation Policy', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Compliance', href: '#' },
  ],
  Support: [
    { label: 'Portal Access', href: '/sign-in' },
    { label: 'Track Application', href: '/v2/track' },
    { label: 'Help Centre', href: '#' },
    { label: 'Contact Support', href: '/v2/track' },
  ],
}

export function FooterSection() {
  const colors = usePublicBrandColors()
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors.navy,
        color: '#fff',
        py: { xs: 10, md: 14 },
      }}
    >
      <FooterWorldMapWatermark />
      <PublicContainer sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 8 }} sx={{ mb: 10 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src={GREENLIGHT_LOGO_DARK_SRC}
              alt="Greenlight"
              sx={{ height: 48, width: 'auto', maxWidth: 200, mb: 3, display: 'block' }}
            />
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.65)',
                maxWidth: 320,
                mb: 4,
                fontFamily: publicFonts.body,
              }}
            >
              Tech-enabled visa assistance with expert review for travelers, families, businesses,
              marine teams and travel partners.
            </Typography>
          </Grid>

          {Object.entries(footerSections).map(([section, links]) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={section}>
              <Typography
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: publicFonts.heading,
                }}
              >
                {section}
              </Typography>
              <Stack spacing={2.5}>
                {links.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      fontFamily: publicFonts.body,
                      transition: 'color 0.2s',
                      '&:hover': { color: colors.green },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 6 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={3}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
            © 2026 GreenLight Travel Solutions Pvt. Ltd. All rights reserved.
          </Typography>
          <Stack spacing={0.75}>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
              GreenLight Visa Solutions is a brand of GreenLight Travel Solutions Pvt. Ltd.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
              * Based on applications meeting eligibility criteria.
            </Typography>
          </Stack>
        </Stack>
      </PublicContainer>
    </Box>
  )
}
