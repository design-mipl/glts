import { Box, Typography, Link, Divider, Stack, Grid } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { FooterWorldMapWatermark } from '../../../components/FooterWorldMapWatermark'
import { PublicContainer } from '../../../components/PublicContainer'
import { GREENLIGHT_LOGO_DARK_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'

const footerSections: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: 'Visa Services', href: '/visa-services' },
    { label: 'Marine Visa Services', href: '/marine-crew' },
    { label: 'Corporate Visa Services', href: '/corporate' },
    { label: 'Travel Agents', href: '/travel-agents' },
    { label: 'Destinations', href: '/countries' },
    { label: 'Visa Guide', href: '/visa-guide' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Design System →', href: '/design-system' },
    { label: 'Blogs & Visa Updates', href: '/blogs' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms & Conditions', href: '/legal/terms' },
    { label: 'Refund & Cancellation Policy', href: '/legal/refund-cancellation' },
  ],
  Support: [
    { label: 'Portal Access', href: '/sign-in/portals' },
    { label: 'Track Application', href: '/track' },
    { label: 'Contact Us', href: '/contact' },
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
              Specialist visa services powered by experienced visa professionals and modern technology.
            </Typography>
            <Button
              href="/enquiry"
              variant="contained"
              color="primary"
              endIcon={<ArrowRight size={17} aria-hidden="true" />}
              sx={{
                minHeight: 46,
                px: 3,
                borderRadius: `${ds.radius.medium}px`,
                bgcolor: ds.color.brand,
                color: ds.color.navy,
                fontWeight: 700,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                '&:hover': { bgcolor: ds.color.brandHover, color: ds.color.white },
              }}
            >
              Enquire now
            </Button>
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
