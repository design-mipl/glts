import { Box, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useCountries } from '@/shared/hooks/useCountries'
import { FilterSidebar } from './components/FilterSidebar'
import { SearchAndSort } from './components/SearchAndSort'
import { CountryGrid } from './components/CountryGrid'
import { DestinationsHeroSection } from './components/DestinationsHeroSection'
import { PublicContainer } from '../../components/PublicContainer'
import { defaultExploreFilters } from '../../utils/applyExploreFilters'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { landingSectionPy } from '../LandingPage/landingPageSpacing'

/** Keep filter sidebar at its prior ~25%-of-1280 width while the listing expands. */
const FILTER_SIDEBAR_WIDTH_PX = 288

export function CountryListingPage() {
  const colors = usePublicBrandColors()
  const { countries, loading } = useCountries()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedVisaTypes, setSelectedVisaTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [sortBy, setSortBy] = useState('rating')
  const [exploreFilters, setExploreFilters] = useState(defaultExploreFilters)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress sx={{ color: colors.greenBright }} />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: colors.surface, minHeight: 'calc(100vh - 80px)', pb: { xs: 12, md: 4 } }}>
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
                filters={{ regions: selectedRegions, priceRange, visaTypes: selectedVisaTypes }}
                exploreFilters={exploreFilters}
                onFiltersChange={({ regions, priceRange: pr, visaTypes }) => {
                  setSelectedRegions(regions)
                  setPriceRange(pr)
                  setSelectedVisaTypes(visaTypes)
                }}
                onExploreFiltersChange={setExploreFilters}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              <SearchAndSort
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              <CountryGrid
                countries={countries}
                searchTerm={searchTerm}
                selectedRegions={selectedRegions}
                selectedVisaTypes={selectedVisaTypes}
                priceRange={priceRange}
                sortBy={sortBy}
                exploreFilters={exploreFilters}
              />
            </Box>
          </Box>
        </PublicContainer>
      </Box>
    </Box>
  )
}
