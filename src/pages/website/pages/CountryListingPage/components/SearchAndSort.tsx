import { Box, TextField, Select, MenuItem, InputAdornment } from '@mui/material'
import { Search } from 'lucide-react'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'

interface SearchAndSortProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
}

export function SearchAndSort({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: SearchAndSortProps) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        mb: 5,
        display: 'flex',
        gap: { xs: 1.5, sm: 2 },
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        alignItems: 'stretch',
        width: '100%',
      }}
    >
      <TextField
        placeholder="Search destinations..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} color={colors.textMuted} />
            </InputAdornment>
          ),
        }}
        sx={{
          flex: 1,
          minWidth: { xs: '100%', sm: 0 },
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            bgcolor: '#fff',
            fontSize: '16px',
          },
        }}
      />
      <Select
        value={sortBy}
        onChange={e => onSortChange(e.target.value)}
        sx={{
          flexShrink: 0,
          minWidth: { xs: '100%', sm: 180 },
          borderRadius: '14px',
          bgcolor: '#fff',
          fontSize: '15px',
        }}
      >
        <MenuItem value="rating">Rating</MenuItem>
        <MenuItem value="price_asc">Price (Low to High)</MenuItem>
        <MenuItem value="price_desc">Price (High to Low)</MenuItem>
        <MenuItem value="processing">Processing Time</MenuItem>
      </Select>
    </Box>
  )
}
