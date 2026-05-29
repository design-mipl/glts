import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  FORM_CONTROL,
  autocompleteOutlinedFieldSx,
  autocompleteSlotProps,
  formControlHeight,
} from '../../../formControl'

interface MultiSelectOption {
  label: string
  value: string | number
}

export interface MultiSelectProps {
  label?: string
  placeholder?: string
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  options: MultiSelectOption[]
  error?: boolean
  helperText?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  fullWidth?: boolean
  maxDisplay?: number
  clearable?: boolean
  searchable?: boolean
  sx?: SxProps<Theme>
}

const SELECT_ALL: MultiSelectOption = { label: 'Select all', value: '__SELECT_ALL__' }

export default function MultiSelect({
  label,
  placeholder,
  value = [],
  onChange,
  options,
  error = false,
  helperText,
  disabled = false,
  size = 'sm',
  fullWidth = false,
  maxDisplay,
  clearable = false,
  searchable = false,
  sx,
}: MultiSelectProps) {
  const theme = useTheme()
  const allOpts = [SELECT_ALL, ...options]
  const inputHeight = formControlHeight(size)

  const selectedOpts = options.filter((o) => value.includes(o.value))
  const isAllSelected = selectedOpts.length === options.length

  const handleChange = (_: unknown, newValue: MultiSelectOption[]) => {
    const hasSelectAll = newValue.some((o) => o.value === SELECT_ALL.value)
    if (hasSelectAll) {
      onChange?.(isAllSelected ? [] : options.map((o) => o.value))
    } else {
      onChange?.(newValue.map((o) => o.value))
    }
  }

  const fieldSx = autocompleteOutlinedFieldSx(theme, inputHeight)

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={allOpts}
      value={selectedOpts}
      onChange={handleChange}
      disabled={disabled}
      disableClearable={!clearable}
      fullWidth={fullWidth}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      filterOptions={searchable ? undefined : (opts) => opts}
      slotProps={autocompleteSlotProps(theme)}
      sx={[
        { minWidth: fullWidth ? undefined : 200, width: fullWidth ? '100%' : undefined },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props as { key: string } & React.HTMLAttributes<HTMLLIElement>
        const isSelectAll = option.value === SELECT_ALL.value
        return (
          <li key={key} {...rest}>
            <Checkbox
              checked={isSelectAll ? isAllSelected : selected}
              indeterminate={isSelectAll && selectedOpts.length > 0 && !isAllSelected}
              sx={{ mr: 1, p: 0.5 }}
              size="small"
            />
            {option.label}
          </li>
        )
      }}
      renderTags={(selected, getTagProps) => {
        const display = maxDisplay ? selected.slice(0, maxDisplay) : selected
        const extra = maxDisplay ? Math.max(0, selected.length - maxDisplay) : 0
        return [
          ...display.map((opt, i) => (
            <Chip
              {...getTagProps({ index: i })}
              key={opt.value}
              label={opt.label}
              size="small"
            />
          )),
          extra > 0 ? (
            <Chip key="__more__" label={`+${extra} more`} size="small" variant="outlined" />
          ) : null,
        ]
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          hiddenLabel={!label}
          placeholder={selectedOpts.length === 0 ? placeholder : undefined}
          error={error}
          helperText={helperText}
          size="small"
          fullWidth={fullWidth}
          variant="outlined"
          slotProps={{
            formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
          }}
          inputProps={{
            ...params.inputProps,
            readOnly: !searchable,
          }}
          sx={fieldSx}
        />
      )}
    />
  )
}
