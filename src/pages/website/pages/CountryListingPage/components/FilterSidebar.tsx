import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  Card,
  Slider,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material'
import { getRegions } from '@/shared/services/visaService'
import {
  defaultExploreFilters,
  exploreFilterDefs,
  type ExploreFilters,
} from '../../../utils/applyExploreFilters'
import { publicLayout, publicShadows, usePublicBrandColors } from '../../../theme/publicSiteTokens'

interface Filters {
  regions: string[]
  priceRange: [number, number]
  visaTypes: string[]
}

interface FilterSidebarProps {
  filters: Filters
  exploreFilters: ExploreFilters
  onFiltersChange: (filters: Filters) => void
  onExploreFiltersChange: (filters: ExploreFilters) => void
}

const visaTypeOptions = ['eVisa', 'Visa on arrival', 'Embassy stamp']
const visaTypeIds: Record<string, string> = {
  eVisa: 'evisa',
  'Visa on arrival': 'visa_on_arrival',
  'Embassy stamp': 'embassy',
}

export function FilterSidebar({
  filters,
  exploreFilters,
  onFiltersChange,
  onExploreFiltersChange,
}: FilterSidebarProps) {
  const colors = usePublicBrandColors()
  const regions = getRegions()

  const toggleRegion = (region: string) => {
    if (region === 'All') {
      onFiltersChange({ ...filters, regions: [] })
      return
    }
    const updated = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region]
    onFiltersChange({ ...filters, regions: updated })
  }

  const toggleVisaType = (label: string) => {
    const id = visaTypeIds[label]
    const updated = filters.visaTypes.includes(id)
      ? filters.visaTypes.filter(v => v !== id)
      : [...filters.visaTypes, id]
    onFiltersChange({ ...filters, visaTypes: updated })
  }

  return (
    <Card
      sx={{
        p: 4,
        borderRadius: publicLayout.cardRadius,
        border: `1px solid ${colors.border}`,
        boxShadow: publicShadows.card,
        position: 'sticky',
        top: 96,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '14px', color: colors.navy, letterSpacing: '0.5px' }}>
          FILTERS
        </Typography>
        <Button
          size="small"
          onClick={() => {
            onFiltersChange({ regions: [], priceRange: [0, 20000], visaTypes: [] })
            onExploreFiltersChange(defaultExploreFilters)
          }}
          sx={{ color: colors.greenBright, fontWeight: 600, textTransform: 'none', minWidth: 'auto' }}
        >
          Reset
        </Button>
      </Box>

      {exploreFilterDefs.map(({ key, label, options }) => (
        <Box key={key} sx={{ mb: 5 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 2 }}>
            {label}
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={exploreFilters[key]}
              onChange={e => onExploreFiltersChange({ ...exploreFilters, [key]: e.target.value })}
              displayEmpty
              sx={{
                fontSize: '15px',
                borderRadius: '10px',
                bgcolor: colors.surface,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.greenBright },
              }}
            >
              {options.map(opt => (
                <MenuItem key={opt} value={opt} sx={{ fontSize: '15px' }}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}

      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 2 }}>
          REGION
        </Typography>
        <FormGroup>
          {['All', ...regions].map(region => (
            <FormControlLabel
              key={region}
              control={
                <Checkbox
                  size="small"
                  checked={region === 'All' ? filters.regions.length === 0 : filters.regions.includes(region)}
                  onChange={() => toggleRegion(region)}
                  sx={{ '&.Mui-checked': { color: colors.greenBright } }}
                />
              }
              label={<Typography sx={{ fontSize: '15px' }}>{region}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 2 }}>
          VISA TYPE
        </Typography>
        <FormGroup>
          {visaTypeOptions.map(type => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  size="small"
                  checked={filters.visaTypes.includes(visaTypeIds[type])}
                  onChange={() => toggleVisaType(type)}
                  sx={{ '&.Mui-checked': { color: colors.greenBright } }}
                />
              }
              label={<Typography sx={{ fontSize: '15px' }}>{type}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>

      <Box>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 2 }}>
          PRICE RANGE
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={(_, v) => onFiltersChange({ ...filters, priceRange: v as [number, number] })}
          min={0}
          max={20000}
          step={500}
          sx={{ color: colors.greenBright, mb: 2 }}
        />
        <Typography sx={{ fontSize: '14px', color: colors.textSecondary }}>
          ₹{filters.priceRange[0].toLocaleString('en-IN')} — ₹{filters.priceRange[1].toLocaleString('en-IN')}
        </Typography>
      </Box>
    </Card>
  )
}
