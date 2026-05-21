import { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import { Search, X } from 'lucide-react'
import type { SxProps, Theme } from '@mui/material/styles'
import { tokens } from '../../../tokens'

export interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  loading?: boolean
  onClear?: () => void
  debounce?: number
  size?: 'sm' | 'md'
  fullWidth?: boolean
  autoFocus?: boolean
  sx?: SxProps<Theme>
}

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search',
  loading = false,
  onClear,
  debounce = 0,
  size = 'md',
  fullWidth = false,
  autoFocus = false,
  sx,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value ?? '')
  const timeoutRef = useRef<number | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    setInternalValue(value ?? '')
  }, [value])

  useEffect(() => {
    if (!onChange || debounce <= 0) {
      return undefined
    }

    timeoutRef.current = window.setTimeout(() => {
      onChangeRef.current?.(internalValue)
    }, debounce)

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [debounce, internalValue])

  const emitChange = (nextValue: string) => {
    setInternalValue(nextValue)
    if (debounce <= 0) {
      onChange?.(nextValue)
    }
  }

  const inputHeight = size === 'sm' ? 36 : 44

  return (
    <TextField
      value={internalValue}
      onChange={(event) => emitChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSearch?.(internalValue)
        }
      }}
      placeholder={placeholder}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} style={{ opacity: 0.5 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? <CircularProgress size={16} /> : null}
              {!loading && internalValue ? (
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={() => {
                    emitChange('')
                    onClear?.()
                  }}
                >
                  <X size={16} />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        },
      }}
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            height: inputHeight,
            borderRadius: tokens.borderRadius.full,
            pl: tokens.spacing[1],
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
