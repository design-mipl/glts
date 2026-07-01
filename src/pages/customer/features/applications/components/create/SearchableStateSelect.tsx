import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import {
  autocompleteSlotProps,
  formControlHeight,
  outlinedFieldSx,
} from '@/design-system/formControl'

export interface SearchableStateSelectProps {
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder: string
  'aria-label': string
  clearable?: boolean
}

export function SearchableStateSelect({
  value,
  options,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  clearable = false,
}: SearchableStateSelectProps) {
  const theme = useTheme()
  const inputHeight = formControlHeight('sm')
  const selected = value.trim() || null

  return (
    <Autocomplete
      options={options}
      value={selected}
      onChange={(_, next) => onChange(next ?? '')}
      getOptionLabel={(option) => option}
      isOptionEqualToValue={(option, selectedOption) => option === selectedOption}
      disableClearable={!clearable}
      fullWidth
      openOnFocus
      slotProps={autocompleteSlotProps(theme)}
      sx={{
        ...outlinedFieldSx(theme, inputHeight),
        '& .MuiOutlinedInput-root': {
          minHeight: inputHeight,
          height: inputHeight,
          py: 0,
          pr: '32px',
          alignItems: 'center',
          flexWrap: 'nowrap',
        },
        '& .MuiAutocomplete-input': {
          minWidth: '0 !important',
          padding: '0 !important',
        },
        '& .MuiAutocomplete-endAdornment': {
          position: 'absolute',
          right: 9,
          top: '50%',
          transform: 'translateY(-50%)',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder={selected ? undefined : placeholder}
          inputProps={{
            ...params.inputProps,
            'aria-label': ariaLabel,
          }}
        />
      )}
    />
  )
}
