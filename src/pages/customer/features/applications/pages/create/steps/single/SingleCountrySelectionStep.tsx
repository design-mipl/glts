import { useMemo, useState } from 'react'
import { Box, Typography, Grid, Stack, TextField, InputAdornment } from '@mui/material'
import { Search } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { CustomerCountryCard } from '../../../../components/CustomerCountryCard'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import {
  getAccountMappedCountries,
} from '../../../../data/singleApplicationFlowData'

interface SingleCountrySelectionStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function SingleCountrySelectionStep({ state, onUpdate, onContinue }: SingleCountrySelectionStepProps) {
  const colors = usePublicBrandColors()
  const [query, setQuery] = useState('')

  const accountCountries = useMemo(() => getAccountMappedCountries(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return accountCountries.filter(c => {
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.cities.toLowerCase().includes(q)
      )
    })
  }, [accountCountries, query])

  const handleSelect = (c: (typeof accountCountries)[0]) => {
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

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Select destination country
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        Only countries mapped to your account are shown. Choose where this visa application will be filed.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search countries…"
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
      </Stack>

      <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        All destinations
      </Typography>
      <Grid container spacing={1.5} sx={{ mb: 1 }}>
        {filtered.map(c => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={c.id}>
            <CountryCardWithMeta country={c} selected={state.countryId === c.id} onSelect={() => handleSelect(c)} />
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Typography sx={{ fontSize: 13, color: colors.textMuted, py: 4, textAlign: 'center' }}>
          No countries match your search. Try another region or keyword.
        </Typography>
      )}

      <FlowStepActions onContinue={onContinue} continueLabel="Continue" continueDisabled={!state.countryId} />
    </Box>
  )
}

function CountryCardWithMeta({
  country,
  selected,
  onSelect,
}: {
  country: ReturnType<typeof getAccountMappedCountries>[0]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Box>
      <CustomerCountryCard country={country} selected={selected} onSelect={onSelect} />
    </Box>
  )
}
