import { useState, useRef, useEffect } from 'react'
import {
  Box, TextField, Select, MenuItem, Switch,
  IconButton, FormControl,
} from '@mui/material'
import { Check, X } from 'lucide-react'
import type { Column } from '../types'

export interface InlineEditProps {
  value: any
  column: Column
  onSave: (value: any) => void
  onCancel: () => void
}

export default function InlineEdit({ value, column, onSave, onCancel }: InlineEditProps) {
  const [draft, setDraft] = useState(value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); onSave(draft) }
    if (e.key === 'Escape') { e.preventDefault(); onCancel() }
  }

  const editStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'background.paper',
      boxShadow: 2,
    },
  }

  if (column.renderEdit) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {column.renderEdit(draft, {} as any, setDraft)}
        <IconButton size="small" onClick={() => onSave(draft)}><Check size={16} /></IconButton>
        <IconButton size="small" onClick={onCancel}><X size={16} /></IconButton>
      </Box>
    )
  }

  const type = column.type ?? 'text'

  if (type === 'boolean') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Switch
          size="small"
          checked={Boolean(draft)}
          onChange={(e) => setDraft(e.target.checked)}
          onKeyDown={handleKeyDown}
        />
        <IconButton size="small" onClick={() => onSave(draft)}><Check size={16} /></IconButton>
        <IconButton size="small" onClick={onCancel}><X size={16} /></IconButton>
      </Box>
    )
  }

  if (type === 'select' && column.options) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            onKeyDown={handleKeyDown}
            onBlur={() => onSave(draft)}
            sx={editStyle}
          >
            {column.options.map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton size="small" onClick={() => onSave(draft)}><Check size={16} /></IconButton>
        <IconButton size="small" onClick={onCancel}><X size={16} /></IconButton>
      </Box>
    )
  }

  const inputType = type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'email' ? 'email' : type === 'url' ? 'url' : 'text'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <TextField
        size="small"
        value={draft}
        type={inputType}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onSave(draft)}
        inputRef={inputRef}
        sx={{ ...editStyle, minWidth: 120 }}
        slotProps={{ htmlInput: { style: { fontSize: 14 } } }}
      />
      <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); onSave(draft) }}>
        <Check size={16} />
      </IconButton>
      <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); onCancel() }}>
        <X size={16} />
      </IconButton>
    </Box>
  )
}
