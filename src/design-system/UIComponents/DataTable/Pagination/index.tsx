import { Box, Typography, IconButton, Button, useTheme, useMediaQuery } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Select from '../../Primitives/Select'

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

const PAGE_SIZE_SELECT_SX = {
  minWidth: 80,
  width: 80,
  flexShrink: 0,
} as const

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
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'))

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, total)
  const pageNumbers = buildPageNumbers(page + 1, totalPages)

  const pageSizeSelect = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        Rows per page:
      </Typography>
      <Select
        value={pageSize}
        onChange={(value) => {
          onPageSize(Number(value))
          onPage(0)
        }}
        options={pageSizeOptions.map((s) => ({ label: String(s), value: s }))}
        size="sm"
        disabled={loading}
        sx={PAGE_SIZE_SELECT_SX}
      />
    </Box>
  )

  const pageControls = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
      <IconButton
        size="small"
        disabled={page === 0 || loading}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </IconButton>
      {isCompact ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 0.5, minWidth: 48, textAlign: 'center' }}>
          {page + 1} / {totalPages}
        </Typography>
      ) : (
        pageNumbers.map((p, i) =>
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
          ),
        )
      )}
      <IconButton
        size="small"
        disabled={page >= totalPages - 1 || loading}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </IconButton>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, md: 2 },
        px: 2,
        py: 1.5,
        flexWrap: 'wrap',
        rowGap: 1.5,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: 0 }}
      >
        {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, md: 2 },
          flexShrink: 0,
          flexWrap: 'wrap',
          ml: { xs: 0, sm: 'auto' },
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-end', sm: 'flex-end' },
        }}
      >
        {pageSizeSelect}
        {pageControls}
      </Box>
    </Box>
  )
}
