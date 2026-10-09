import { Box, Typography } from '@mui/material'
import { Bell, FileCheck2, Ship, UsersRound } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts } from '../../../theme/publicSiteTokens'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { featureSectionPy } from '../../LandingPage/landingPageSpacing'

const benefits = [
  {
    title: 'Marine visa expertise',
    description: 'In-depth knowledge of seafarer, offshore and port visa requirements.',
    icon: Ship,
  },
  {
    title: 'Thorough document checks',
    description: 'We review documents to help avoid delays and ensure compliance.',
    icon: FileCheck2,
  },
  {
    title: 'Clear status updates',
    description: 'Stay informed with proactive communication throughout the process.',
    icon: Bell,
  },
  {
    title: 'Responsive specialist support',
    description: 'A dedicated team ready to assist you and your crew.',
    icon: UsersRound,
  },
] as const

export function MarineAccuracySection() {
  return (
    <Box
      component="section"
      id="why-marine-visa-accuracy"
      sx={{ bgcolor: '#FDFEFE', py: featureSectionPy }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', desktop: 'minmax(0, 0.82fr) minmax(0, 1fr)' },
            gap: { xs: 5, desktop: '42px' },
            alignItems: { xs: 'start', desktop: 'stretch' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 360, sm: 440, desktop: 'auto' },
              minHeight: { desktop: 454 },
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src="/images/marine-accuracy/crew-at-sea.png"
              alt="Two marine crew members on a vessel deck at sunset"
              loading="lazy"
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
          </Box>

          <Box sx={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                color: '#2FA34F',
                fontFamily: publicFonts.heading,
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 1.5,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Why Greenlight
            </Typography>
            <Typography
              component="h2"
              sx={{
                ...websiteHeadingSx.h2,
                color: '#10264A',
                maxWidth: 560,
                mb: 1.25,
              }}
            >
              A marine travel partner you can rely on
            </Typography>
            <Typography
              sx={{
                color: '#5F6D83',
                fontFamily: publicFonts.body,
                fontSize: { xs: '16px', lg: '18px' },
                lineHeight: 1.5,
                maxWidth: 640,
              }}
            >
              We understand the unique requirements of seafarers and marine operations, and provide dependable support at every step.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
                columnGap: 2.5,
                rowGap: { xs: 3, desktop: 5.5 },
                mt: { xs: 4, desktop: 4.5 },
                flexGrow: { desktop: 1 },
                alignContent: { desktop: 'space-between' },
              }}
            >
              {benefits.map(({ title, description, icon: Icon }) => (
                <Box
                  key={title}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '80px minmax(0, 1fr)', lg: '88px minmax(0, 1fr)' },
                    gap: 1.5,
                    alignItems: 'start',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 80, lg: 88 },
                      height: { xs: 80, lg: 88 },
                      borderRadius: '50%',
                      bgcolor: '#EAF8EC',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icon size={46} color="#168D3F" strokeWidth={1.8} aria-hidden="true" />
                  </Box>
                  <Box sx={{ pt: 0.25 }}>
                    <Typography
                      component="h3"
                      sx={{
                        color: '#10264A',
                        fontFamily: publicFonts.heading,
                        fontSize: { xs: '18px', lg: '19px' },
                        fontWeight: 700,
                        lineHeight: 1.35,
                        mb: 0.75,
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#5F6D83',
                        fontFamily: publicFonts.body,
                        fontSize: { xs: '16px', lg: '17px' },
                        lineHeight: 1.5,
                      }}
                    >
                      {description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
