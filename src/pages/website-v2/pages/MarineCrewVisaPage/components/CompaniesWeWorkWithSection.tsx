import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts } from '../../../theme/publicSiteTokens'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { marineCompanyTypes } from '../marinePageData'
import { landingSectionHeaderMb, landingSectionPy } from '../../LandingPage/landingPageSpacing'

export function CompaniesWeWorkWithSection() {
  return (
    <Box
      component="section"
      id="companies-we-work-with"
      sx={{
        bgcolor: '#FDFEFE',
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ textAlign: 'center', mb: landingSectionHeaderMb }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 54,
              height: 3,
              bgcolor: '#2FA34F',
              borderRadius: 2,
              mx: 'auto',
              mt: 1,
              mb: 2,
            }}
          />
          <Typography
            component="h2"
            sx={{
              ...websiteHeadingSx.h2,
              color: '#10264A',
              mb: 2,
            }}
          >
            Companies We Work With
          </Typography>
          <Typography
            sx={{
              color: '#5F6D83',
              fontFamily: publicFonts.body,
              fontSize: { xs: '16px', md: '20px' },
              lineHeight: 1.5,
            }}
          >
            GreenLight supports marine travel operations across the following organization types.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {marineCompanyTypes.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: { lg: 350 },
                gridColumn: { md: index === marineCompanyTypes.length - 1 ? '1 / -1' : 'auto', lg: 'auto' },
                width: { xs: '100%', md: index === marineCompanyTypes.length - 1 ? 'calc(50% - 12px)' : '100%', lg: '100%' },
                justifySelf: 'center',
                overflow: 'hidden',
                borderRadius: '14px',
                bgcolor: '#FFFFFF',
                border: '1px solid #E7EDF1',
                boxShadow: '0 2px 7px rgba(16, 38, 74, 0.08)',
              }}
            >
              <Box
                component="img"
                src={item.image.src}
                alt={item.image.alt}
                loading="lazy"
                sx={{
                  display: 'block',
                  width: '100%',
                  height: { xs: 210, lg: 200 },
                  objectFit: 'cover',
                  objectPosition: 'center',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ px: 2.5, pt: 2, pb: 2.5, flex: 1 }}>
                <Typography
                  component="h3"
                  sx={{
                    color: '#10264A',
                    fontFamily: publicFonts.display,
                    fontSize: { xs: '20px', lg: '22px' },
                    fontWeight: 700,
                    lineHeight: 1.3,
                    mb: 0.75,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#5F6D83',
                    fontFamily: publicFonts.body,
                    fontSize: { xs: '16px', lg: '18px' },
                    lineHeight: 1.45,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
