import { useMemo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllCountries } from '@/shared/services/visaService'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { PublicContainer } from '../../../components/PublicContainer'
import { PremiumDestinationCard } from './PremiumDestinationCard'
import { defaultExploreFilters, applyExploreFilters } from '../../../utils/applyExploreFilters'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'

/** Featured destination selection, arranged to keep card details readable at desktop widths. */
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
                ...websiteHeadingSx.h2,
                color: colors.navy,
                mb: 2,
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
            onClick={() => navigate('/countries')}
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
            aria-label="Featured destinations"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
              '@media (min-width: 1536px)': { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
              gap: { xs: 2.5, lg: 2 },
              rowGap: 3,
              alignItems: 'stretch',
            }}
          >
            {homepageCountries.map((country, index) => (
              <Box
                key={country.id}
                role="listitem"
                sx={{
                  minWidth: 0,
                  ...(index === homepageCountries.length - 2 && {
                    '@media (min-width: 1024px) and (max-width: 1535.95px)': { gridColumnStart: 2 },
                  }),
                  ...(index === homepageCountries.length - 1 && {
                    '@media (min-width: 1024px) and (max-width: 1535.95px)': { gridColumnStart: 3 },
                  }),
                }}
              >
                <PremiumDestinationCard country={country} />
              </Box>
            ))}
          </Box>
        )}
      </PublicContainer>
    </Box>
  )
}
