import { Box, Typography, Link, Stack } from '@mui/material'
import { Radar, LogIn, Globe, type LucideIcon } from 'lucide-react'
import { FooterWorldMapWatermark } from '../../../components/FooterWorldMapWatermark'
import { PublicContainer } from '../../../components/PublicContainer'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import {
  site,
  siteFont,
  siteMotion,
  siteBrand,
  siteInkCanvasSx,
  mrzSx,
  clippedCorner,
} from '@/pages/website/theme/siteTheme'
import { paperRadius } from '@/pages/website/theme/sitePaper'

const footerSections: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: 'Retail Visa Services', href: '/' },
    { label: 'Marine Visa Services', href: '/marine-crew' },
    { label: 'Corporate Visa Services', href: '/corporate' },
    { label: 'Travel Partners', href: '/#specialist-visa-services' },
    { label: 'Destinations', href: '/countries' },
    { label: 'Extra Services', href: '/extra-services' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/track' },
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
    { label: 'Track Application', href: '/track' },
    { label: 'Help Centre', href: '#' },
    { label: 'Contact Support', href: '/track' },
  ],
}

/**
 * The three circles under the brand block.
 *
 * The wireframe reads as social icons, but there are no handles anywhere in the codebase
 * and this version of `lucide-react` ships no brand glyphs — so these are the product's
 * three real entry points instead. A circle that goes nowhere is worse than no circle.
 * Swap in socials once there are handles and brand SVGs to use.
 */
const QUICK_ACTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Track an application', href: '/track', icon: Radar },
  { label: 'Portal sign in', href: '/sign-in', icon: LogIn },
  { label: 'Browse destinations', href: '/countries', icon: Globe },
]

/**
 * Site footer.
 *
 * Inverted from a full-bleed navy slab to a **light card inset into an ink gutter**. Two
 * reasons beyond matching the wireframe. First, the footer was the last surface still
 * written in the retired `publicFonts` / `publicColors` language, so it read as a different
 * product from the page above it; it now uses the site tokens like everything else.
 * Second, the page's closing CTA is already a dark band — a dark footer directly beneath
 * it merged the two into one long dark run, and the card gives the CTA an edge to end at.
 *
 * The world-map watermark stays on the gutter, behind the card, where it is texture rather
 * than something text has to be legible over.
 *
 * Rendered by `PublicLayout`, so this is every page on the public site.
 */
export function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
        ...siteInkCanvasSx,
      }}
    >
      <FooterWorldMapWatermark />

      <PublicContainer sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            backgroundColor: site.surface,
            border: `1px solid ${site.hairline}`,
            // Stays dark by decision, but takes the Paper radius so its corner matches the
            // page above it rather than the retired 10px scale.
            borderRadius: paperRadius.panel,
            clipPath: { xs: 'none', md: clippedCorner(30) },
            px: { xs: 3.5, md: 6 },
            py: { xs: 5, md: 6.5 },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'minmax(0, 1.4fr) repeat(4, minmax(0, 1fr))',
              },
              gap: { xs: 5, md: 6 },
            }}
          >
            {/* Brand block */}
            <Box sx={{ gridColumn: { sm: 'span 2', md: 'auto' } }}>
              <Box
                component="img"
                src={GREENLIGHT_LOGO_SRC}
                alt="Greenlight"
                sx={{ height: 44, width: 'auto', maxWidth: 190, mb: 3, display: 'block' }}
              />
              <Typography
                sx={{
                  fontFamily: siteFont.body,
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: site.inkMuted,
                  maxWidth: 320,
                }}
              >
                Tech-enabled visa assistance with expert review for travelers, families,
                businesses, marine teams and travel partners.
              </Typography>

              <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <Box
                      key={action.label}
                      component="a"
                      href={action.href}
                      aria-label={action.label}
                      sx={{
                        width: 38,
                        height: 38,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        border: `1px solid ${site.hairline}`,
                        color: site.inkMuted,
                        transition: `border-color 150ms ${siteMotion.easeOut}, color 150ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
                        '@media (hover: hover) and (pointer: fine)': {
                          '&:hover': { borderColor: siteBrand.greenBorder, color: siteBrand.greenInk },
                        },
                        '&:active': { transform: 'scale(0.95)' },
                        '&:focus-visible': {
                          outline: 'none',
                          borderColor: site.accent,
                          boxShadow: `0 0 0 3px ${site.accentRing}`,
                        },
                      }}
                    >
                      <Icon size={16} strokeWidth={1.9} />
                    </Box>
                  )
                })}
              </Stack>
            </Box>

            {Object.entries(footerSections).map(([section, links]) => (
              <Box key={section}>
                <Typography sx={{ ...mrzSx, fontSize: 9.5, mb: 2.5 }}>{section}</Typography>
                <Stack spacing={1.75}>
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      sx={{
                        color: site.inkMuted,
                        textDecoration: 'none',
                        fontSize: 13.5,
                        fontWeight: 500,
                        lineHeight: 1.4,
                        fontFamily: siteFont.body,
                        transition: `color 150ms ${siteMotion.easeOut}`,
                        '@media (hover: hover) and (pointer: fine)': {
                          '&:hover': { color: site.ink },
                        },
                        '&:focus-visible': {
                          outline: 'none',
                          color: site.ink,
                          boxShadow: `0 0 0 3px ${site.accentRing}`,
                          borderRadius: '3px',
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>

          <Box
            aria-hidden
            sx={{ height: '1px', backgroundColor: site.hairline, mt: { xs: 5, md: 6 }, mb: 3.5 }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={2}
          >
            <Typography sx={{ fontFamily: siteFont.body, fontSize: 12.5, color: site.inkFaint }}>
              © 2026 GreenLight Travel Solutions Pvt. Ltd. All rights reserved.
            </Typography>

            <Stack spacing={0.75} sx={{ textAlign: { sm: 'right' } }}>
              <Typography sx={{ fontFamily: siteFont.body, fontSize: 12.5, color: site.inkFaint }}>
                GreenLight Visa Solutions is a brand of GreenLight Travel Solutions Pvt. Ltd.
              </Typography>
              <Typography sx={{ fontFamily: siteFont.body, fontSize: 12, color: site.inkFaint }}>
                * Based on applications meeting eligibility criteria.
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
