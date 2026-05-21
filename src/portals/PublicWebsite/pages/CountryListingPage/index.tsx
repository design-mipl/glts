import { Box, Grid, Typography, CircularProgress, Chip, Stack } from '@mui/material'
import { useState } from 'react'
import { useCountries } from '../../../../shared/hooks/useCountries'
import { FilterSidebar } from './components/FilterSidebar'
import { SearchAndSort } from './components/SearchAndSort'
import { CountryGrid } from './components/CountryGrid'
import { PublicContainer } from '../../components/PublicContainer'
import {
  publicColors,
  publicFonts,
  publicTypography,
} from '../../theme/publicSiteTokens'

const trendingTags = ['Schengen +12%', 'Turkey +10%', 'Japan +8%', 'UAE +6%']

export function CountryListingPage() {
  const { countries, loading } = useCountries()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedVisaTypes, setSelectedVisaTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [sortBy, setSortBy] = useState('rating')

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress sx={{ color: publicColors.greenBright }} />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: publicColors.surface, minHeight: 'calc(100vh - 80px)', pb: { xs: 12, md: 4 } }}>
      <Box
        sx={{
          bgcolor: '#fff',
          borderBottom: `1px solid ${publicColors.border}`,
          py: { xs: 6, md: 8 },
        }}
      >
        <PublicContainer>
          <Typography
            component="h1"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: publicTypography.h2,
              fontWeight: 800,
              color: publicColors.navy,
              mb: 2,
            }}
          >
            {countries.length} destinations
          </Typography>
          <Typography sx={{ fontSize: publicTypography.body, color: publicColors.textSecondary, mb: 4 }}>
            Sorted by your nationality · Indian passport · Travel from Mar 2026
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
            <Typography
              sx={{
                fontSize: publicTypography.overline,
                fontWeight: 700,
                letterSpacing: '0.8px',
                color: publicColors.textMuted,
              }}
            >
              TRENDING
            </Typography>
            {trendingTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  bgcolor: '#fff',
                  border: `1px solid ${publicColors.border}`,
                  fontWeight: 600,
                  fontSize: '13px',
                  height: 36,
                }}
              />
            ))}
          </Stack>
        </PublicContainer>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <PublicContainer>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 3 }}>
              <FilterSidebar
                filters={{ regions: selectedRegions, priceRange, visaTypes: selectedVisaTypes }}
                onFiltersChange={({ regions, priceRange: pr, visaTypes }) => {
                  setSelectedRegions(regions)
                  setPriceRange(pr)
                  setSelectedVisaTypes(visaTypes)
                }}
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
              />
            </Grid>
          </Grid>
        </PublicContainer>
      </Box>
    </Box>
  )
}
