import { Box, Button, Typography } from '@mui/material'
import { ArrowRight, Crown, Plane, UsersRound, type LucideIcon } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { getPrimaryButtonSx, mergeButtonSx, publicFonts, publicLightColors } from '../../../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'

const serviceHighlights: {
  title: string
  description: string
  icon: LucideIcon
  href: string
  image: { src: string; alt: string; position: string }
}[] = [
  {
    title: 'Visas for your next trip',
    description: 'Tourist, family, business, student and more. Get clear guidance for your travel plans.',
    icon: Plane,
    href: '/visa-services#our-retail-services',
    image: {
      src: '/images/visa-services/transit.png',
      alt: 'Traveler walking through a modern airport terminal',
      position: '39% center',
    },
  },
  {
    title: 'Specialist visa support',
    description: 'Complex cases, multiple destinations and tailored solutions from our visa experts.',
    icon: UsersRound,
    href: '/visa-services#specialist-visa-services',
    image: {
      src: '/images/travel-agents/agent-assisting-customer.png',
      alt: 'Visa specialist reviewing travel documents with customers',
      position: '53% center',
    },
  },
  {
    title: 'Visa Master',
    description: 'Premium, end-to-end assistance for a completely stress-free visa experience.',
    icon: Crown,
    href: '/visa-services#visa-master',
    image: {
      src: '/images/visa-master/passport.png',
      alt: 'Passport prepared for premium visa assistance',
      position: '51% center',
    },
  },
]

export function VisaServicesPreviewSection() {
  const colors = publicLightColors

  return (
    <Box
      component="section"
      id="visa-services-preview"
      aria-labelledby="visa-services-preview-heading"
      sx={{ bgcolor: '#F7FBF8', py: landingSectionPy }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', desktop: 'minmax(0, 1fr) minmax(280px, 390px)' },
            alignItems: 'end',
            columnGap: 6,
            rowGap: 2,
            mb: landingSectionHeaderMb,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="p"
              sx={{
                fontFamily: publicFonts.body,
                color: colors.greenDark,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                mb: 1.5,
              }}
            >
              VISA SERVICES
            </Typography>
            <Typography
              id="visa-services-preview-heading"
              component="h2"
              sx={{
                ...websiteHeadingSx.h2,
                color: colors.navy,
              }}
            >
              The Right Support. For Every Journey.
            </Typography>
          </Box>
          <Button
            component="a"
            href="/visa-services"
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            sx={mergeButtonSx(getPrimaryButtonSx(colors), {
              justifySelf: { xs: 'start', desktop: 'end' },
              alignSelf: 'end',
              minHeight: 44,
              px: 3,
              whiteSpace: 'nowrap',
              fontFamily: publicFonts.body,
            })}
          >
            Visa Services
          </Button>
        </Box>

        <Box
          component="ul"
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              xl: 'repeat(2, minmax(0, 1fr))',
              desktopMd: 'repeat(3, minmax(0, 1fr))',
            },
            alignItems: 'stretch',
            gap: { xs: 2.5, desktopMd: 3 },
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
        >
          {serviceHighlights.map(({ title, description, icon: Icon, href, image }) => (
            <Box component="li" key={title} sx={{ minWidth: 0, display: 'flex' }}>
              <Box
                component="a"
                href={href}
                sx={{
                  display: 'flex',
                  position: 'relative',
                  width: '100%',
                  minWidth: 0,
                  minHeight: { xs: 228, desktopMd: 260 },
                  overflow: 'hidden',
                  bgcolor: colors.white,
                  border: 1,
                  borderColor: colors.border,
                  borderRadius: '18px',
                  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.055)',
                  color: colors.navy,
                  textDecoration: 'none',
                  transition: 'transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease',
                  '@media (hover: hover)': {
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#B8DCC0',
                      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.09)',
                    },
                    '&:hover .visa-services-preview-image': { transform: 'scale(1.035)' },
                    '&:hover .visa-services-preview-arrow': { transform: 'translateX(3px)' },
                  },
                  '&:focus-visible': { outline: '3px solid', outlineColor: colors.navy, outlineOffset: 3 },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                    '& .visa-services-preview-image, & .visa-services-preview-arrow': { transition: 'none' },
                  },
                }}
              >
                <Box sx={{ position: 'relative', width: '30%', flexShrink: 0, overflow: 'hidden', bgcolor: colors.surfaceAlt }}>
                  <Box
                    component="img"
                    className="visa-services-preview-image"
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: image.position,
                      transition: 'transform 350ms ease',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: { xs: 2, desktopMd: 2.25 },
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 36,
                      height: 36,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '11px',
                      bgcolor: '#E9F6EC',
                      color: colors.greenDark,
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </Box>
                  <Typography
                    component="h3"
                    sx={{
                      mt: 1.5,
                      fontFamily: publicFonts.display,
                      color: colors.navy,
                      fontSize: { xs: '20px', xl: '22px', desktopMd: '23px', desktopLg: '24px' },
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    component="p"
                    sx={{
                      mt: 0.75,
                      fontFamily: publicFonts.body,
                      color: colors.textSecondary,
                      fontSize: { xs: '14px', desktopMd: '15px' },
                      lineHeight: 1.5,
                    }}
                  >
                    {description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 'auto', pt: 1.25 }}>
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        bgcolor: colors.greenBright,
                        color: colors.white,
                      }}
                    >
                      <ArrowRight className="visa-services-preview-arrow" size={19} strokeWidth={2.2} style={{ transition: 'transform 240ms ease' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
