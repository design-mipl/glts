import { Box, Typography, Link, Divider, Stack, Grid, Chip } from '@mui/material'
import { FooterWorldMapWatermark } from '../../../components/FooterWorldMapWatermark'
import { PublicContainer } from '../../../components/PublicContainer'
import { GREENLIGHT_LOGO_DARK_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const footerSections = {
  Product: ['Destinations', 'Marine crew', 'Corporate setup', 'API'],
  Company: ['About', 'Careers', 'Press', 'Blog'],
  Legal: ['Privacy', 'Terms', 'Security', 'Compliance'],
  Support: ['Help center', 'Track application', 'Status page', 'Contact us'],
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
              The global visa operating system for travelers, marine crews, and enterprise travel
              teams.
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {['ISO 27001', 'GDPR', 'SOC 2'].map(badge => (
                <Chip
                  key={badge}
                  label={badge}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 600,
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    height: 32,
                  }}
                />
              ))}
            </Stack>
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
                    key={link}
                    href="#"
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
                    {link}
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
            © 2025 Greenlight Travel Solutions. All rights reserved.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
            Enterprise visa infrastructure
          </Typography>
        </Stack>
      </PublicContainer>
    </Box>
  )
}
