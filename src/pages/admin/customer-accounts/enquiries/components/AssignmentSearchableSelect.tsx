import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import {
  FORM_CONTROL,
  autocompleteOutlinedFieldSx,
  autocompleteSlotProps,
  formControlHeight,
} from '@/design-system/formControl'
import type { AssignmentSelectOption } from '../utils/enquiryAssignmentOptions'

interface AssignmentSearchableSelectProps {
  value: string
  onChange: (value: string) => void
  options: AssignmentSelectOption[]
  placeholder?: string
  disabled?: boolean
}

export function AssignmentSearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
}: AssignmentSearchableSelectProps) {
  const theme = useTheme()
  const fieldSx = autocompleteOutlinedFieldSx(theme, formControlHeight('sm'))
  const selected =
    options.find((option) => option.value === value) ??
    (value ? { label: value, value } : null)

  return (
    <Autocomplete
      options={options}
      value={selected}
      onChange={(_, next) => onChange(next?.value ?? '')}
      disabled={disabled}
      fullWidth
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      slotProps={autocompleteSlotProps(theme)}
      sx={{ width: '100%', ...fieldSx }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size="small"
          variant="outlined"
          fullWidth
          slotProps={{
            formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
          }}
          sx={fieldSx}
        />
      )}
    />
  )
}
