import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import chroma from 'chroma-js'
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'

interface ColorPickerFieldProps {
  label: string
  value?: string
  onChange: (value: string) => void
  helpText?: string
  placeholder?: string
  allowEmpty?: boolean
  onReset?: () => void
  resetLabel?: string
  previewColor?: string
}

function normalizeHex(value: string): string {
  return chroma(value).hex()
}

export default function ColorPickerField({
  label,
  value = '',
  onChange,
  helpText,
  placeholder = '#000000',
  allowEmpty = false,
  onReset,
  resetLabel = 'Reset',
  previewColor,
}: ColorPickerFieldProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const isValid = useMemo(() => {
    if (!inputValue.trim()) {
      return allowEmpty
    }

    return /^#?[0-9A-Fa-f]{6}$/.test(inputValue.trim())
  }, [allowEmpty, inputValue])

  const resolvedPreview = useMemo(() => {
    if (previewColor && chroma.valid(previewColor)) {
      return chroma(previewColor).hex()
    }

    if (value && chroma.valid(value)) {
      return chroma(value).hex()
    }

    return '#000000'
  }, [previewColor, value])

  function commitValue(nextValue: string): void {
    const trimmed = nextValue.trim()

    if (!trimmed) {
      if (allowEmpty) {
        onChange('')
      }
      return
    }

    if (/^#?[0-9A-Fa-f]{6}$/.test(trimmed)) {
      onChange(normalizeHex(trimmed))
    }
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = event.target.value
    setInputValue(nextValue)
    commitValue(nextValue)
  }

  function handlePickerChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = normalizeHex(event.target.value)
    setInputValue(nextValue)
    onChange(nextValue)
  }

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1.5}
        sx={{ mb: 1 }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {label}
        </Typography>
        {onReset && (
          <Button size="small" variant="text" color="inherit" onClick={onReset}>
            {resetLabel}
          </Button>
        )}
      </Stack>

      <TextField
        fullWidth
        size="small"
        value={inputValue}
        onChange={handleTextChange}
        placeholder={placeholder}
        error={!isValid}
        helperText={!isValid ? 'Enter a valid 6-digit hex color.' : helpText}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  component="label"
                  sx={{
                    position: 'relative',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: resolvedPreview,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="input"
                    type="color"
                    value={resolvedPreview}
                    onChange={handlePickerChange}
                    aria-label={`${label} color picker`}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      p: 0,
                      border: 'none',
                    }}
                  />
                </Box>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
