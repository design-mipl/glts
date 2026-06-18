import { Box, Grid, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useCountries } from '@/shared/hooks/useCountries'
import { FilterSidebar } from './components/FilterSidebar'
import { SearchAndSort } from './components/SearchAndSort'
import { CountryGrid } from './components/CountryGrid'
import { DestinationsHeroSection } from './components/DestinationsHeroSection'
import { PublicContainer } from '../../components/PublicContainer'
import { defaultExploreFilters } from '../../utils/applyExploreFilters'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

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

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <PublicContainer>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 3 }}>
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
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
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
            </Grid>
          </Grid>
        </PublicContainer>
      </Box>
    </Box>
  )
}
