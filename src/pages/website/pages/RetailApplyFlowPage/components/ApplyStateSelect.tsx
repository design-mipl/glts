import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
} from '@/pages/website/theme/applyFlowTheme'

interface ApplyStateSelectProps {
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder?: string
  clearable?: boolean
  id?: string
  'aria-label'?: string
}

/**
 * Searchable select, V2-owned.
 *
 * Not the customer portal's `SearchableStateSelect` — that component is shared with the
 * signed-in portal, so restyling it would change a surface outside Website V2.
 */
export function ApplyStateSelect({
  value,
  options,
  onChange,
  placeholder = 'Select',
  clearable = false,
  id,
  'aria-label': ariaLabel,
}: ApplyStateSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter((o) => o.toLowerCase().includes(q)) : options
  }, [options, query])

  useEffect(() => {
    if (!open) return
    function onDocDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQuery('')
  }, [open])

  return (
    <Box ref={rootRef} sx={{ position: 'relative', width: '100%' }}>
      <Box
        component="button"
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Escape') setOpen(false)
        }}
        sx={{
          width: '100%',
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2,
          boxSizing: 'border-box',
          textAlign: 'left',
          appearance: 'none',
          fontFamily: applyFont.body,
          fontSize: 14,
          color: value ? applyFlow.ink : applyFlow.inkFaint,
          backgroundColor: applyFlow.surface,
          border: `1px solid ${open ? applyFlow.accent : applyFlow.hairline}`,
          borderRadius: applyRadius.control,
          boxShadow: open ? `0 0 0 3px ${applyFlow.accentRing}` : 'none',
          cursor: 'pointer',
          transition: `border-color 150ms ${applyMotion.easeOut}, box-shadow 150ms ${applyMotion.easeOut}`,
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': { borderColor: open ? applyFlow.accent : applyFlow.hairlineStrong },
          },
          '&:focus-visible': {
            outline: 'none',
            borderColor: applyFlow.accent,
            boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
          },
        }}
      >
        <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </Box>
        {clearable && value ? (
          <Box
            component="span"
            role="button"
            tabIndex={0}
            aria-label="Clear selection"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onChange('')
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                onChange('')
              }
            }}
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              color: applyFlow.inkFaint,
              flex: '0 0 auto',
              '&:hover': { color: applyFlow.ink },
            }}
          >
            <X size={13} />
          </Box>
        ) : null}
        <ChevronDown
          size={15}
          style={{
            flex: '0 0 auto',
            color: applyFlow.inkFaint,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 180ms ${applyMotion.easeOut}`,
          }}
        />
      </Box>

      {open ? (
        <Box
          role="listbox"
          sx={{
            position: 'absolute',
            zIndex: 20,
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: applyFlow.surface,
            border: `1px solid ${applyFlow.hairline}`,
            borderRadius: applyRadius.control,
            boxShadow: '0 16px 40px -12px rgba(8, 24, 43, 0.28)',
            overflow: 'hidden',
            transformOrigin: 'top center',
            animation: `applySelectIn 160ms ${applyMotion.easeOut}`,
            '@keyframes applySelectIn': {
              from: { opacity: 0, transform: 'scale(0.97) translateY(-4px)' },
              to: { opacity: 1, transform: 'scale(1) translateY(0)' },
            },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${applyFlow.hairlineSoft}` }}>
            <Search size={14} style={{ color: applyFlow.inkFaint, flex: '0 0 auto' }} />
            <Box
              component="input"
              ref={inputRef}
              value={query}
              placeholder="Search"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                fontFamily: applyFont.body,
                fontSize: 13.5,
                color: applyFlow.ink,
                backgroundColor: 'transparent',
                '&::placeholder': { color: applyFlow.inkFaint },
              }}
            />
          </Box>

          <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <Typography sx={{ px: 3, py: 3, fontFamily: applyFont.body, fontSize: 13, color: applyFlow.inkMuted }}>
                No match for “{query}”.
              </Typography>
            ) : (
              filtered.map((opt) => {
                const isSel = opt === value
                return (
                  <Box
                    key={opt}
                    component="button"
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    onClick={() => {
                      onChange(opt)
                      setOpen(false)
                    }}
                    sx={{
                      width: '100%',
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      px: 3,
                      py: 2,
                      appearance: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: applyFont.body,
                      fontSize: 13.5,
                      fontWeight: isSel ? 600 : 400,
                      color: applyFlow.ink,
                      backgroundColor: isSel ? applyFlow.accentSoft : 'transparent',
                      '@media (hover: hover) and (pointer: fine)': {
                        '&:hover': { backgroundColor: isSel ? applyFlow.accentSoft : applyFlow.canvas },
                      },
                      '&:focus-visible': { outline: 'none', backgroundColor: applyFlow.canvas },
                    }}
                  >
                    <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {opt}
                    </Box>
                    {isSel ? <Check size={14} style={{ color: applyFlow.accentInk, flex: '0 0 auto' }} /> : null}
                  </Box>
                )
              })
            )}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
