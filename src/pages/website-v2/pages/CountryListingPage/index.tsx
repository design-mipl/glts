import { Box, CircularProgress } from '@mui/material'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCountries } from '@/shared/hooks/useCountries'
import { FilterSidebar, getDefaultDestinationPlanningFilters } from './components/FilterSidebar'
import { SearchAndSort } from './components/SearchAndSort'
import { CountryGrid } from './components/CountryGrid'
import { DestinationsHeroSection } from './components/DestinationsHeroSection'
import { PublicContainer } from '../../components/PublicContainer'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { landingSectionPy } from '../LandingPage/landingPageSpacing'

/** Keep filter sidebar at its prior ~25%-of-1280 width while the listing expands. */
const FILTER_SIDEBAR_WIDTH_PX = 288

export function CountryListingPage() {
  const colors = usePublicBrandColors()
  const { countries, loading } = useCountries()
  const { search } = useLocation()
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(search).get('search') ?? '')
  const [planningFilters, setPlanningFilters] = useState(getDefaultDestinationPlanningFilters)

  const applicationContextQuery = useMemo(() => {
    const params = new URLSearchParams(search)
    params.delete('search')

    if (planningFilters.travelDate) params.set('travelDate', planningFilters.travelDate)
    else params.delete('travelDate')

    if (planningFilters.tripLength) params.set('tripLength', planningFilters.tripLength)
    else params.delete('tripLength')

    params.delete('context')
    planningFilters.concerns.forEach(value => params.append('context', value))

    if (planningFilters.applicantGroup !== 'just-me') {
      params.set('applicantGroup', planningFilters.applicantGroup)
    } else {
      params.delete('applicantGroup')
    }

    const query = params.toString()
    return query ? `?${query}` : ''
  }, [planningFilters, search])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress sx={{ color: colors.greenBright }} />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: colors.surface, minHeight: 'calc(100vh - 80px)' }}>
      <DestinationsHeroSection destinationCount={countries.length} />

      <Box sx={{ py: landingSectionPy }}>
        <PublicContainer variant="hero">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'flex-start',
              gap: { xs: 3, md: 3.5 },
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: FILTER_SIDEBAR_WIDTH_PX },
                flexShrink: 0,
              }}
            >
              <FilterSidebar
                filters={planningFilters}
                onFiltersChange={setPlanningFilters}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              <SearchAndSort
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              <CountryGrid
                countries={countries}
                searchTerm={searchTerm}
                applicationContextQuery={applicationContextQuery}
              />
            </Box>
          </Box>
        </PublicContainer>
      </Box>
    </Box>
  )
}
