import {
  Dialog, Box, InputBase, Typography, Divider, Skeleton,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface SearchResult {
  id: string
  type: 'page' | 'record' | 'user'
  title: string
  subtitle?: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
}

export interface SearchResults {
  pages: SearchResult[]
  records: SearchResult[]
  users: SearchResult[]
}

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onSearch: (query: string) => Promise<SearchResults>
}

const STORAGE_KEY = 'foundation:recent-searches'
const MAX_RECENT = 5

function getRecent(): SearchResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveRecent(item: SearchResult) {
  const existing = getRecent().filter(r => r.id !== item.id)
  const updated = [{ ...item, icon: undefined }, ...existing].slice(0, MAX_RECENT)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch { /* ignore */ }
}

function ResultItem({
  item,
  highlighted,
  onSelect,
  ref: _ref,
}: {
  item: SearchResult
  highlighted: boolean
  onSelect: (item: SearchResult) => void
  ref?: React.RefObject<HTMLDivElement | null>
}) {
  const theme = useTheme()
  return (
    <Box
      onClick={() => onSelect(item)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 0,
        height: 48,
        borderRadius: tokens.borderRadius.md,
        mx: 1,
        cursor: 'pointer',
        bgcolor: highlighted ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
        transition: `background-color ${tokens.transition.fast}`,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        },
      }}
    >
      <Box sx={{ fontSize: 20, color: 'text.secondary', display: 'flex', flexShrink: 0, width: 20 }}>
        {item.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} noWrap>{item.title}</Typography>
        {item.subtitle && (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {item.subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'block',
        px: 2,
        pt: 1.5,
        pb: 0.5,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: 'text.disabled',
      }}
    >
      {label}
    </Typography>
  )
}

export default function CommandPalette({ open, onClose, onSearch }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [recent, setRecent] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults(null)
      setHighlighted(0)
      setRecent(getRecent())
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await onSearch(query)
        setResults(r)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, onSearch])

  const allResults: SearchResult[] = results
    ? [...(results.pages ?? []), ...(results.records ?? []), ...(results.users ?? [])]
    : recent

  const handleSelect = useCallback((item: SearchResult) => {
    saveRecent(item)
    onClose()
    if (item.href) navigate(item.href)
    else item.onClick?.()
  }, [navigate, onClose])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (allResults[highlighted]) handleSelect(allResults[highlighted])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const hasQuery = query.trim().length > 0
  const hasResults = results && (
    (results.pages?.length ?? 0) +
    (results.records?.length ?? 0) +
    (results.users?.length ?? 0)
  ) > 0

  let resultOffset = 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      onKeyDown={handleKeyDown}
      slotProps={{
        paper: {
          sx: {
            borderRadius: tokens.borderRadius.xl,
            overflow: 'hidden',
            p: 0,
            m: { xs: 1, sm: 2 },
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(2px)' },
        },
      }}
    >
      {/* Search input */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, height: 56 }}>
        <SearchIcon sx={{ fontSize: 22, color: 'text.secondary', flexShrink: 0 }} />
        <InputBase
          inputRef={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setHighlighted(0) }}
          placeholder="Search pages, records, users..."
          fullWidth
          sx={{
            fontSize: 16,
            '& input': { p: 0 },
          }}
        />
        <Box
          component="kbd"
          sx={{
            fontSize: 11,
            color: 'text.disabled',
            bgcolor: 'action.selected',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '4px',
            px: 0.75,
            py: 0.25,
            fontFamily: 'inherit',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          ESC
        </Box>
      </Box>

      <Divider />

      {/* Results area */}
      <Box sx={{ maxHeight: 400, overflowY: 'auto', py: 1 }}>
        {/* Loading */}
        {loading && (
          <Box sx={{ px: 2, py: 1 }}>
            {[0, 1, 2].map(i => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 48, px: 0 }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="55%" height={16} />
                  <Skeleton width="35%" height={12} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* No query: recent searches */}
        {!loading && !hasQuery && recent.length > 0 && (
          <>
            <SectionLabel label="Recent" />
            {recent.map((item, i) => (
              <ResultItem
                key={item.id}
                item={{ ...item, icon: item.icon ?? <AccessTimeIcon sx={{ fontSize: 20 }} /> }}
                highlighted={highlighted === i}
                onSelect={handleSelect}
              />
            ))}
          </>
        )}

        {/* No query, no recent */}
        {!loading && !hasQuery && recent.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Start typing to search...
            </Typography>
          </Box>
        )}

        {/* Has query, has results */}
        {!loading && hasQuery && hasResults && results && (
          <>
            {results.pages && results.pages.length > 0 && (
              <>
                <SectionLabel label="Pages" />
                {results.pages.map((item, i) => {
                  const idx = resultOffset + i
                  return (
                    <ResultItem key={item.id} item={item} highlighted={highlighted === idx} onSelect={handleSelect} />
                  )
                })}
                {(() => { resultOffset += results.pages.length; return null })()}
              </>
            )}
            {results.records && results.records.length > 0 && (
              <>
                <SectionLabel label="Records" />
                {results.records.map((item, i) => {
                  const idx = resultOffset + i
                  return (
                    <ResultItem key={item.id} item={item} highlighted={highlighted === idx} onSelect={handleSelect} />
                  )
                })}
                {(() => { resultOffset += results.records.length; return null })()}
              </>
            )}
            {results.users && results.users.length > 0 && (
              <>
                <SectionLabel label="Users" />
                {results.users.map((item, i) => {
                  const idx = resultOffset + i
                  return (
                    <ResultItem key={item.id} item={item} highlighted={highlighted === idx} onSelect={handleSelect} />
                  )
                })}
              </>
            )}
          </>
        )}

        {/* Has query, no results */}
        {!loading && hasQuery && !hasResults && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No results for "{query}"
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
              Try searching for something else
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
