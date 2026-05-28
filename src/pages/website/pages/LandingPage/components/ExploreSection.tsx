import { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Chip,
  Grid,
} from '@mui/material'
import { Search, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllCountries, filterCountries } from '@/shared/services/visaService'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { PublicContainer } from '../../../components/PublicContainer'
import { ExploreFilterBar, type ExploreFilters } from './ExploreFilterBar'
import { DestinationListingCard } from '../../../components/DestinationListingCard'

const defaultFilters: ExploreFilters = {
  visaDelivery: 'Any Time',
  visaType: 'All Visa Types',
  documents: 'Any Documents',
  holidays: 'Select Dates',
}

export function ExploreSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ExploreFilters>(defaultFilters)
  const [showFilters, setShowFilters] = useState(true)

  const countries = useMemo(() => {
    let list = filterCountries({
      visaType: filters.visaType === 'All Visa Types' ? undefined : filters.visaType,
    })
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.cities.toLowerCase().includes(q),
      )
    }
    if (filters.visaDelivery === 'Under 24 hours') {
      list = list.filter(c => c.fastMinutes && c.fastMinutes <= 1440)
    } else if (filters.visaDelivery === 'Under 1 week') {
      list = list.filter(c => !c.processingTime.includes('110'))
    }
    return [...list].sort((a, b) => {
      if (a.trending !== b.trending) return a.trending ? -1 : 1
      return b.trendingPercent - a.trendingPercent
    })
  }, [filters, search])

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.surface,
        pt: { xs: 3, md: 4 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <PublicContainer variant="hero">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Chip
              label="Visas on time, guaranteed"
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                fontSize: '11px',
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
                border: `1px solid ${colors.green}`,
              }}
            />
            <Typography
              sx={{
                fontFamily: publicFonts.heading,
                fontWeight: 800,
                fontSize: { xs: '28px', md: '36px' },
                color: colors.navy,
                lineHeight: 1.15,
                mb: 0.75,
              }}
            >
              Where are you traveling?
            </Typography>
            <Typography sx={{ fontSize: '15px', color: colors.textSecondary, maxWidth: 520 }}>
              {getAllCountries().length} destinations · Indian passport · Pick a country to start
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/countries')}
            sx={{
              bgcolor: colors.greenBright,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 3,
              alignSelf: { xs: 'stretch', md: 'auto' },
              '&:hover': { bgcolor: colors.greenDark },
            }}
          >
            Browse all destinations
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: showFilters ? 2 : 3 }}>
          <TextField
            placeholder="Search country or region…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
            size="small"
            sx={{
              maxWidth: { md: 360 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: colors.white,
                fontSize: '14px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color={colors.textMuted} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<SlidersHorizontal size={16} />}
            onClick={() => setShowFilters(v => !v)}
            sx={{
              textTransform: 'none',
              borderColor: colors.border,
              color: colors.navy,
              borderRadius: '12px',
              bgcolor: colors.white,
              flexShrink: 0,
            }}
          >
            Filters
          </Button>
        </Stack>

        {showFilters && (
          <Box sx={{ mb: 3, overflowX: 'auto', pb: 0.5 }}>
            <ExploreFilterBar filters={filters} onChange={setFilters} />
          </Box>
        )}

        {countries.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              bgcolor: colors.white,
              borderRadius: '16px',
              border: `1px dashed ${colors.border}`,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: colors.navy }}>
              No destinations match your filters
            </Typography>
            <Button
              sx={{ mt: 2, textTransform: 'none' }}
              onClick={() => {
                setSearch('')
                setFilters(defaultFilters)
              }}
            >
              Clear filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {countries.map(country => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.id}>
                <DestinationListingCard country={country} />
              </Grid>
            ))}
          </Grid>
        )}

        <Typography sx={{ fontSize: '13px', color: colors.textMuted, mt: 2 }}>
          Showing {countries.length} of {getAllCountries().length} destinations
        </Typography>
      </PublicContainer>
    </Box>
  )
}
