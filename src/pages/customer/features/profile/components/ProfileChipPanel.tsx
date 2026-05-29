import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'

const COLLAPSED_LIMIT = 12

export interface ProfileChipPanelProps {
  countries: string[]
  visaTypes: string[]
}

export function ProfileChipPanel({ countries, visaTypes }: ProfileChipPanelProps) {
  const colors = usePublicBrandColors()
  const [search, setSearch] = useState('')
  const [expandedCountries, setExpandedCountries] = useState(false)
  const [expandedVisa, setExpandedVisa] = useState(false)

  const q = search.trim().toLowerCase()

  const filteredCountries = useMemo(
    () => (q ? countries.filter(c => c.toLowerCase().includes(q)) : countries),
    [countries, q],
  )
  const filteredVisa = useMemo(
    () => (q ? visaTypes.filter(v => v.toLowerCase().includes(q)) : visaTypes),
    [visaTypes, q],
  )

  const visibleCountries = expandedCountries ? filteredCountries : filteredCountries.slice(0, COLLAPSED_LIMIT)
  const visibleVisa = expandedVisa ? filteredVisa : filteredVisa.slice(0, COLLAPSED_LIMIT)

  const renderGroup = (
    label: string,
    items: string[],
    visible: string[],
    expanded: boolean,
    onToggle: () => void,
  ) => (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', mb: 1 }}>
        {label}
      </Typography>
      {items.length === 0 ? (
        <Typography sx={{ fontSize: 12, color: colors.textMuted }}>No {label.toLowerCase()} configured.</Typography>
      ) : (
        <>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {visible.map(item => (
              <CustomerStatusChip key={item} label={item} tone="neutral" />
            ))}
          </Stack>
          {items.length > COLLAPSED_LIMIT && (
            <Button onClick={onToggle} sx={{ mt: 1, textTransform: 'none', fontWeight: 700 }}>
              {expanded ? 'Show less' : `Show all (${items.length})`}
            </Button>
          )}
        </>
      )}
    </Box>
  )

  return (
    <Box>
      <TextField
        size="small"
        fullWidth
        placeholder="Search countries or visa types"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2, maxWidth: 360 }}
      />
      {renderGroup('Supported countries', filteredCountries, visibleCountries, expandedCountries, () =>
        setExpandedCountries(v => !v),
      )}
      {renderGroup('Supported visa types', filteredVisa, visibleVisa, expandedVisa, () => setExpandedVisa(v => !v))}
    </Box>
  )
}
