import { Grid, Typography, Box } from '@mui/material'
import { Globe } from 'lucide-react'
import type { Country } from '@/shared/types/visa'
import { CountryCard } from './CountryCard'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'

interface CountryGridProps {
  countries: Country[]
  searchTerm: string
  applicationContextQuery: string
}

export function CountryGrid({
  countries,
  searchTerm,
  applicationContextQuery,
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

  if (filtered.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 2 }}>
        <Globe size={48} color={colors.textMuted} />
        <Typography sx={{ fontWeight: 700, fontSize: '20px', color: colors.navy }}>
          No destinations found
        </Typography>
        <Typography sx={{ color: colors.textSecondary }}>Try adjusting your search</Typography>
      </Box>
    )
  }

  return (
    <Grid container columnSpacing={{ xs: 1.5, sm: 1.75, md: 2 }} rowSpacing={{ xs: 2, md: 2.5 }}>
      {filtered.map((country, index) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          key={country.id}
          sx={{
            '@media (prefers-reduced-motion: no-preference)': {
              opacity: 0,
              animation: 'glts-card-in 0.42s ease-out forwards',
              animationDelay: `${Math.min(index * 45, 360)}ms`,
            },
            '@keyframes glts-card-in': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <CountryCard country={country} applicationContextQuery={applicationContextQuery} />
        </Grid>
      ))}
    </Grid>
  )
}
