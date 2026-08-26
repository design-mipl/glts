import { useMemo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllCountries } from '@/shared/services/visaService'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { PublicContainer } from '../../../components/PublicContainer'
import { HomepageDestinationCard } from '../../../components/HomepageDestinationCard'
import { destinationCardGridSx } from '../../../components/destinationCardGrid'
import { defaultExploreFilters, applyExploreFilters } from '../../../utils/applyExploreFilters'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'

/** Two full rows on the desktop 5-column grid. */
const HOMEPAGE_DESTINATION_COUNT = 10

export function ExploreSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  const homepageCountries = useMemo(() => {
    const list = applyExploreFilters(getAllCountries(), defaultExploreFilters)
    const ranked = [...list]
      .sort((a, b) => {
        if (a.trending !== b.trending) return a.trending ? -1 : 1
        return b.trendingPercent - a.trendingPercent
      })

    const top = ranked.slice(0, HOMEPAGE_DESTINATION_COUNT)
    const philippines = ranked.find(country => country.code === 'PH')
    const usa = ranked.find(country => country.code === 'US')

    if (philippines && !top.some(country => country.code === 'PH')) {
      top[top.length - 1] = philippines
    }

    if (usa && !top.some(country => country.code === 'US')) {
      const replaceIndex = top.findIndex(country => country.code !== 'PH')
      if (replaceIndex >= 0) {
        top[replaceIndex] = usa
      }
    }

    return top
  }, [])

  return (
    <Box
      component="section"
      id="destinations"
      sx={{
        bgcolor: colors.white,
        pt: landingSectionPy,
        pb: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            mb: landingSectionHeaderMb,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontWeight: 800,
                fontSize: { xs: '28px', md: '36px' },
                color: colors.navy,
                lineHeight: 1.15,
                mb: 1,
              }}
            >
              Where Are You Travelling?
            </Typography>
            <Typography sx={{ fontSize: '15px', color: colors.textSecondary, maxWidth: 520 }}>
              Check visa fees and processing times by destination.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            endIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/v1/countries')}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: colors.border,
              color: colors.greenBright,
              fontWeight: 600,
              px: 3,
              py: 1.1,
              flexShrink: 0,
              alignSelf: { xs: 'stretch', sm: 'center' },
              '&:hover': {
                borderColor: colors.greenBright,
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
              },
            }}
          >
            View all destinations
          </Button>
        </Box>

        {homepageCountries.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              bgcolor: colors.surface,
              borderRadius: '16px',
              border: `1px dashed ${colors.border}`,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: colors.navy }}>
              No destinations available
            </Typography>
          </Box>
        ) : (
          <Box
            role="list"
            aria-label="Destination cards"
            sx={destinationCardGridSx}
          >
            {homepageCountries.map((country, index) => (
              <Box key={country.id} role="listitem">
                <HomepageDestinationCard country={country} index={index} animate={false} />
              </Box>
            ))}
          </Box>
        )}
      </PublicContainer>
    </Box>
  )
}
