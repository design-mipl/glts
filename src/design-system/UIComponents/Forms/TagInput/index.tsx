import { useMemo, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import type { SxProps, Theme } from '@mui/material/styles'
import type { MouseEvent } from 'react'
import { tokens } from '../../../tokens'
import { Tag } from '../../Display'

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
  sx,
}: TagInputProps) {
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
      options={normalizedSuggestions}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, nextValue) => setInputValue(nextValue)}
      onChange={(_, nextValue) => commitTags(nextValue)}
      filterSelectedOptions={!allowDuplicates}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const tagProps = getTagProps({ index })
          return (
            <Tag
              key={tagProps.key}
              label={option}
              onDelete={
                tagProps.onDelete
                  ? () => tagProps.onDelete?.({} as MouseEvent<HTMLButtonElement>)
                  : undefined
              }
              sx={{ m: tokens.spacing[1] }}
            />
          )
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={maxTags && value.length >= maxTags ? '' : placeholder}
          error={error}
          helperText={helperText}
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
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            alignItems: 'center',
            gap: tokens.spacing[1],
            py: tokens.spacing[1],
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
