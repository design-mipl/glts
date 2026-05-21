import {
  Box, Typography, IconButton, Select, MenuItem,
  Button, useTheme, useMediaQuery,
} from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
  onPageSize: (size: number) => void
  pageSizeOptions?: number[]
  loading?: boolean
}

function buildPageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  const left = Math.max(2, page - 1)
  const right = Math.min(totalPages - 1, page + 1)

  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < totalPages - 1) pages.push('...')
  pages.push(totalPages)
  return pages
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  pageSizeOptions = [10, 25, 50, 100],
  loading = false,
}: PaginationProps) {
  const theme = useTheme()
  const isCompact = useMediaQuery(theme.breakpoints.down('xl'))

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, total)
  const pageNumbers = buildPageNumbers(page + 1, totalPages)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, md: 2 },
        px: 2,
        py: 1.5,
        flexWrap: 'wrap',
      }}
    >
      {/* Showing info */}
      <Typography variant="body2" color="text.secondary" sx={{ flex: { xs: 1, md: 'none' } }}>
        {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
      </Typography>

      <Box sx={{ flex: 1 }} />

      {/* Compact: prev/next only */}
      {isCompact ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {page + 1} / {totalPages}
          </Typography>
          <IconButton
            size="small"
            disabled={page === 0 || loading}
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            size="small"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => onPage(page + 1)}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Box>
      ) : (
        <>
          {/* Rows per page */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              Rows per page:
            </Typography>
            <Select
              value={pageSize}
              onChange={(e) => { onPageSize(Number(e.target.value)); onPage(0) }}
              size="small"
              variant="outlined"
              disabled={loading}
              sx={{ fontSize: 13, '& .MuiSelect-select': { py: 0.5, pr: 3 } }}
            >
              {pageSizeOptions.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </Box>

          {/* Page numbers */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <IconButton
              size="small"
              disabled={page === 0 || loading}
              onClick={() => onPage(page - 1)}
            >
              <ChevronLeft size={20} />
            </IconButton>
            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <Typography key={`ellipsis-${i}`} variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
                  …
                </Typography>
              ) : (
                <Button
                  key={p}
                  size="small"
                  variant={p === page + 1 ? 'contained' : 'text'}
                  disabled={loading}
                  onClick={() => onPage((p as number) - 1)}
                  sx={{
                    minWidth: 32,
                    px: 0.5,
                    py: 0.25,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: p === page + 1 ? undefined : 'text.secondary',
                  }}
                >
                  {p}
                </Button>
              )
            )}
            <IconButton
              size="small"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => onPage(page + 1)}
            >
              <ChevronRight size={20} />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  )
}
