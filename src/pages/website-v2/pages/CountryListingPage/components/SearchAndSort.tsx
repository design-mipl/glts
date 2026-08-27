import { Box, TextField, InputAdornment } from '@mui/material'
import { Search } from 'lucide-react'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'

interface SearchAndSortProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function SearchAndSort({
  searchTerm,
  onSearchChange,
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
            bgcolor: colors.white,
            fontSize: '16px',
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: colors.teal,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.teal,
              borderWidth: 1.5,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px rgba(12, 108, 121, 0.10)`,
            },
          },
        }}
      />
    </Box>
  )
}
