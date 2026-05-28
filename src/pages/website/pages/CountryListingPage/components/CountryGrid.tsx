import { Grid, Typography, Box } from '@mui/material'
import { Globe } from 'lucide-react'
import type { Country } from '@/shared/types/visa'
import { CountryCard } from './CountryCard'
import { publicTypography, usePublicBrandColors } from '../../../theme/publicSiteTokens'

interface CountryGridProps {
  countries: Country[]
  searchTerm: string
  selectedRegions: string[]
  selectedVisaTypes: string[]
  priceRange: [number, number]
  sortBy: string
}

export function CountryGrid({
  countries,
  searchTerm,
  selectedRegions,
  selectedVisaTypes: _selectedVisaTypes,
  priceRange,
  sortBy,
}: CountryGridProps) {
  const colors = usePublicBrandColors()
  let filtered = countries

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase()
    filtered = filtered.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    )
  }

  if (selectedRegions.length > 0) {
    filtered = filtered.filter(c => selectedRegions.includes(c.region))
  }

  filtered = filtered.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1])

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    if (sortBy === 'processing') {
      const aDays = parseInt(a.processingTime) || 999
      const bDays = parseInt(b.processingTime) || 999
      return aDays - bDays
    }
    return 0
  })

  if (filtered.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 2 }}>
        <Globe size={48} color={colors.textMuted} />
        <Typography sx={{ fontWeight: 700, fontSize: '20px', color: colors.navy }}>
          No destinations found
        </Typography>
        <Typography sx={{ color: colors.textSecondary }}>Try adjusting your search or filters</Typography>
      </Box>
    )
  }

  return (
    <>
      <Typography
        sx={{
          fontSize: publicTypography.body,
          color: colors.textSecondary,
          fontWeight: 600,
          mb: 4,
        }}
      >
        {filtered.length} results
      </Typography>
      <Grid container spacing={2}>
        {filtered.map(country => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.id}>
            <CountryCard country={country} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
