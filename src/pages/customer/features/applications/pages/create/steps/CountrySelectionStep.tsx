import { Box, Typography, Grid, Stack, Button, TextField, InputAdornment } from '@mui/material'
import { ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { listPortalCountries } from '@/shared/services/countryMasterService'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import { CustomerCountryCard } from '../../../components/CustomerCountryCard'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { useApplicationFlowPolicy, requiresFieldValidation } from '../../../context/ApplicationFlowPolicyContext'
import { ensureFlowGltsApplicationId } from '../../../utils/gltsReferenceIds'

interface CountrySelectionStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function CountrySelectionStep({ state, onUpdate, onContinue }: CountrySelectionStepProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const [query, setQuery] = useState('')
  const countries = useMemo(() => {
    const all = listPortalCountries()
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.cities.toLowerCase().includes(q),
    )
  }, [query])

  const handleSelect = (c: (typeof countries)[0]) => {
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
        sx={{ mb: 2, maxWidth: { xs: '100%', sm: 360 } }}
      />

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {countries.map(c => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={c.id}>
            <CustomerCountryCard
              country={c}
              selected={state.countryId === c.id}
              onSelect={() => handleSelect(c)}
            />
          </Grid>
        ))}
      </Grid>

      {countries.length === 0 && (
        <Typography sx={{ fontSize: '13px', color: colors.textMuted, mb: 2 }}>No destinations match your search.</Typography>
      )}

      <Stack direction="row" justifyContent="flex-end">
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
