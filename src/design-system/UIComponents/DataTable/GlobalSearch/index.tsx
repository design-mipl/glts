import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Dialog, DialogContent, InputBase, Typography,
  List, ListItemButton, ListItemIcon, ListItemText,
  Skeleton, Divider, IconButton, Chip,
} from '@mui/material'
import { Search, X, FileText, Table, User, Clock } from 'lucide-react'
import type { SearchResult, SearchResults } from '../types'

export interface GlobalSearchProps {
  open: boolean
  onClose: () => void
  onSearch?: (query: string) => Promise<SearchResults>
}

const RECENT_KEY = 'foundation:recent-searches'
const MAX_RECENT = 5

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}
function addRecent(q: string) {
  const prev = getRecent()
  const next = [q, ...prev.filter(x => x !== q)].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}
function removeRecent(q: string) {
  const next = getRecent().filter(x => x !== q)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  page: <FileText size={16} />,
  record: <Table size={16} />,
  user: <User size={16} />,
}

const EMPTY_RESULTS: SearchResults = { pages: [], records: [], users: [] }

export default function GlobalSearch({ open, onClose, onSearch }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS)
  const [loading, setLoading] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [recent, setRecent] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allResults: SearchResult[] = [
    ...results.pages,
    ...results.records,
    ...results.users,
  ]

  // Load recent on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults(EMPTY_RESULTS)
      setFocusedIndex(-1)
      setRecent(getRecent())
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults(EMPTY_RESULTS); setLoading(false); return }
    if (!onSearch) return

    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await onSearch(query)
        setResults(res)
      } catch {
        setResults(EMPTY_RESULTS)
      } finally {
        setLoading(false)
      }
    }, 200)
  }, [query, onSearch])

  const handleSelect = useCallback((result: SearchResult) => {
    addRecent(query || result.title)
    setRecent(getRecent())
    result.onClick?.()
    onClose()
  }, [query, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(i => Math.min(i + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      handleSelect(allResults[focusedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const renderGroup = (label: string, items: SearchResult[], startIndex: number) => {
    if (items.length === 0) return null
    return (
      <Box key={label}>
        <Typography variant="caption" color="text.disabled" sx={{ px: 2, py: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </Typography>
        <List disablePadding>
          {items.map((item, i) => {
            const idx = startIndex + i
            return (
              <ListItemButton
                key={item.id}
                selected={focusedIndex === idx}
                onClick={() => handleSelect(item)}
                sx={{ py: 1, px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                  {item.icon ?? TYPE_ICONS[item.type]}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.subtitle}
                  slotProps={{
                    primary: { variant: 'body2', fontWeight: 500 },
                    secondary: { variant: 'caption' },
                  }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
    )
  }

  const hasResults = allResults.length > 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            position: 'fixed',
            top: { xs: 0, md: '10vh' },
            mx: { xs: 0, md: 'auto' },
            borderRadius: { xs: 0, md: 2 },
            maxHeight: { xs: '100dvh', md: '80vh' },
            width: '100%',
          },
        },
      }}
    >
      {/* Search input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Search size={22} style={{ opacity: 0.5, flexShrink: 0 }} />
        <InputBase
          inputRef={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setFocusedIndex(-1) }}
          onKeyDown={handleKeyDown}
          placeholder="Search pages, records, users..."
          sx={{ flex: 1, fontSize: 16, '& input': { p: 0 } }}
          fullWidth
        />
        {query && (
          <IconButton size="small" onClick={() => { setQuery(''); setResults(EMPTY_RESULTS) }}>
            <X size={16} />
          </IconButton>
        )}
        <Chip label="Esc" size="small" onClick={onClose} sx={{ fontSize: 11, height: 20, cursor: 'pointer' }} />
      </Box>

      {/* Results */}
      <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
        {loading && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[...Array(4)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" height={18} />
                  <Skeleton width="40%" height={14} />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {!loading && query && !hasResults && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No results for "<strong>{query}</strong>"
            </Typography>
          </Box>
        )}

        {!loading && query && hasResults && (
          <>
            {renderGroup('Pages', results.pages, 0)}
            {results.pages.length > 0 && results.records.length > 0 && <Divider />}
            {renderGroup('Records', results.records, results.pages.length)}
            {(results.pages.length + results.records.length > 0) && results.users.length > 0 && <Divider />}
            {renderGroup('Users', results.users, results.pages.length + results.records.length)}
          </>
        )}

        {!loading && !query && recent.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.disabled" sx={{ px: 2, py: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Recent
            </Typography>
            <List disablePadding>
              {recent.map((r) => (
                <ListItemButton
                  key={r}
                  onClick={() => setQuery(r)}
                  sx={{ py: 0.75, px: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                    <Clock size={16} />
                  </ListItemIcon>
                  <ListItemText primary={r} slotProps={{ primary: { variant: 'body2' } }} />
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); removeRecent(r); setRecent(getRecent()) }}
                    sx={{ ml: 1 }}
                  >
                    <X size={14} />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
