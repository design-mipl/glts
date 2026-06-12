import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import { ArrowRight, Search } from 'lucide-react'
import { Select } from '@/design-system/UIComponents'
import { useMemo, useState } from 'react'
import { listPortalCountries } from '@/shared/services/countryMasterService'
import { resolveApplicationFlowSegment } from '../../../utils/resolveApplicationFlowSegment'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import { CustomerCountryCard } from '../../../components/CustomerCountryCard'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { useApplicationFlowPolicy, requiresFieldValidation } from '../../../context/ApplicationFlowPolicyContext'
import { ensureFlowGltsApplicationId } from '../../../utils/gltsReferenceIds'
import { useFavoriteCountries } from '../../../hooks/useFavoriteCountries'
import {
  orderCountriesForDisplay,
  type CountrySortMode,
} from '../../../utils/orderCountriesForDisplay'
import type { Country } from '@/shared/types/visa'

interface CountrySelectionStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

function CountryGrid({
  countries,
  state,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: {
  countries: Country[]
  state: ApplicationFlowState
  onSelect: (c: Country) => void
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}) {
  return (
    <Grid container spacing={1.5} sx={{ mb: 1 }}>
      {countries.map(c => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={c.id}>
          <CustomerCountryCard
            country={c}
            selected={state.countryId === c.id}
            onSelect={() => onSelect(c)}
            isFavorite={isFavorite(c.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </Grid>
      ))}
    </Grid>
  )
}

function SectionLabel({ children }: { children: string }) {
  const colors = usePublicBrandColors()
  return (
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 700,
        color: colors.textSecondary,
        mb: 1,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </Typography>
  )
}

export function CountrySelectionStep({ state, onUpdate, onContinue }: CountrySelectionStepProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<CountrySortMode>('default')
  const { favoriteIds, isFavorite, toggleFavorite } = useFavoriteCountries()

  const flowSegment = resolveApplicationFlowSegment(policy)

  const filtered = useMemo(() => {
    const all = listPortalCountries({ portalDisplaySegment: flowSegment })
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.cities.toLowerCase().includes(q),
    )
  }, [query, flowSegment])

  const { favorites, others } = useMemo(
    () => orderCountriesForDisplay(filtered, favoriteIds, sortMode),
    [filtered, favoriteIds, sortMode],
  )

  const hasFavorites = favorites.length > 0
  const totalCount = favorites.length + others.length

  const handleSelect = (c: Country) => {
    onUpdate({
      countryId: c.id,
      countryName: c.name,
      countryFlag: c.flags,
      visaOfferingId: '',
      visaType: '',
      visaTypeLabel: '',
      purpose: '',
      purposeLabel: '',
      entryType: '',
    })
  }

  const handleContinue = () => {
    const gltsApplicationId = ensureFlowGltsApplicationId(state)
    if (!state.gltsApplicationId) {
      onUpdate({ gltsApplicationId })
    }
    onContinue()
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 2 }}>
        Select country
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 2 }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Search destinations…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color={colors.textMuted} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 360 } }}
        />
        <Select
          label="Sort"
          value={sortMode}
          onChange={v => setSortMode(v as CountrySortMode)}
          options={[
            { value: 'default', label: 'Recommended' },
            { value: 'alphabetical', label: 'A–Z' },
          ]}
          sx={{ minWidth: { sm: 160 } }}
        />
      </Stack>

      {hasFavorites ? (
        <Box sx={{ mb: 2 }}>
          <SectionLabel>Favourites</SectionLabel>
          <CountryGrid
            countries={favorites}
            state={state}
            onSelect={handleSelect}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          {others.length > 0 ? (
            <>
              <SectionLabel>All destinations</SectionLabel>
              <CountryGrid
                countries={others}
                state={state}
                onSelect={handleSelect}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </>
          ) : null}
        </Box>
      ) : (
        <CountryGrid
          countries={others}
          state={state}
          onSelect={handleSelect}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {totalCount === 0 && (
        <Typography sx={{ fontSize: '13px', color: colors.textMuted, mb: 2 }}>
          No destinations match your search.
        </Typography>
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          onClick={handleContinue}
          disabled={strict && !state.countryId}
          sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px' }}
        >
          Continue to visa type
        </Button>
      </Stack>
    </Box>
  )
}
