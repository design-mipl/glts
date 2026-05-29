import { useMemo, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  FORM_CONTROL,
  autocompleteOutlinedFieldSx,
  autocompleteSlotProps,
  formControlHeight,
} from '../../../formControl'

export interface TagInputProps {
  label?: string
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  allowDuplicates?: boolean
  suggestions?: string[]
  error?: boolean
  helperText?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  fullWidth?: boolean
  sx?: SxProps<Theme>
}

function normalizeTag(value: string): string {
  return value.trim()
}

export default function TagInput({
  label,
  value = [],
  onChange,
  placeholder = 'Add a tag',
  maxTags,
  allowDuplicates = false,
  suggestions = [],
  error = false,
  helperText,
  disabled = false,
  size = 'sm',
  fullWidth = false,
  sx,
}: TagInputProps) {
  const theme = useTheme()
  const inputHeight = formControlHeight(size)
  const fieldSx = autocompleteOutlinedFieldSx(theme, inputHeight)
  const [inputValue, setInputValue] = useState('')

  const normalizedSuggestions = useMemo(
    () => suggestions.map(normalizeTag).filter(Boolean),
    [suggestions],
  )

  function commitTags(nextTags: string[]) {
    const filtered = nextTags
      .map(normalizeTag)
      .filter(Boolean)
      .filter((tag, index, array) => allowDuplicates || array.indexOf(tag) === index)

    onChange?.(maxTags ? filtered.slice(0, maxTags) : filtered)
  }

  return (
    <Autocomplete
      multiple
      freeSolo
      disabled={disabled}
      fullWidth={fullWidth}
      options={normalizedSuggestions}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, nextValue) => setInputValue(nextValue)}
      onChange={(_, nextValue) => commitTags(nextValue)}
      filterSelectedOptions={!allowDuplicates}
      slotProps={autocompleteSlotProps(theme)}
      sx={[
        fieldSx,
        {
          minWidth: fullWidth ? undefined : 200,
          width: fullWidth ? '100%' : undefined,
          '& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot': {
            minHeight: inputHeight,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...chipProps } = getTagProps({ index })
          return (
            <Chip
              key={key}
              {...chipProps}
              label={option}
              size="small"
              sx={{ height: 22, '& .MuiChip-label': { py: 0 } }}
            />
          )
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          hiddenLabel={!label}
          size="small"
          variant="outlined"
          fullWidth={fullWidth}
          placeholder={maxTags && value.length >= maxTags ? '' : placeholder}
          error={error}
          helperText={helperText}
          slotProps={{
            formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              const nextTag = normalizeTag(inputValue)
              if (!nextTag) {
                return
              }
              if (!allowDuplicates && value.includes(nextTag)) {
                setInputValue('')
                return
              }
              if (maxTags && value.length >= maxTags) {
                return
              }
              commitTags([...value, nextTag])
              setInputValue('')
            }
          }}
        />
      )}
    />
  )
}
