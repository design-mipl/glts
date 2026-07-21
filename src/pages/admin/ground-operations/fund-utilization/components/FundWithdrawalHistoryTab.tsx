import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { EmptyState, Pagination } from '@/design-system/UIComponents'
import type { FundBankWithdrawalEntry } from '@/shared/types/fundUtilization'
import { formatInr } from '@/shared/utils/invoiceCalculations'

const DEFAULT_PAGE_SIZE = 5
const PAGE_SIZE_OPTIONS = [5, 10, 25]

function formatDisplayDateTime(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim())
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : value
}

function HistoryRow({ entry }: { entry: FundBankWithdrawalEntry }) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 1,
        borderRadius: 1.25,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0.75}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack spacing={0.25} minWidth={0}>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
              {formatInr(entry.amount)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              Withdrawn by {entry.withdrawnBy}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, flexShrink: 0 }}>
            {formatDisplayDateTime(entry.recordedAt)}
          </Typography>
        </Stack>
        {entry.remarks.trim() ? (
          <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.45 }}>
            {entry.remarks}
          </Typography>
        ) : null}
        {entry.recordedBy.trim() && entry.recordedBy !== entry.withdrawnBy ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            Recorded by {entry.recordedBy}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  )
}

interface FundWithdrawalHistoryTabProps {
  entries: FundBankWithdrawalEntry[]
}

export function FundWithdrawalHistoryTab({ entries }: FundWithdrawalHistoryTabProps) {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [entries.length])

  const total = entries.length

  const paginatedEntries = useMemo(() => {
    const start = page * pageSize
    return entries.slice(start, start + pageSize)
  }, [entries, page, pageSize])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1)
    if (page > maxPage) setPage(maxPage)
  }, [page, pageSize, total])

  if (entries.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <EmptyState
          title="No withdrawals yet"
          description="Bank withdrawals recorded against the team float will appear here."
        />
      </Box>
    )
  }

  return (
    <Stack spacing={0} sx={{ flex: 1, minHeight: 0, height: '100%' }}>
      <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pb: 1.5 }}>
        {paginatedEntries.map(entry => (
          <HistoryRow key={entry.id} entry={entry} />
        ))}
      </Stack>

      <Box
        sx={{
          flexShrink: 0,
          mx: '-10px',
          mb: '-10px',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
          onPageSize={size => {
            setPageSize(size)
            setPage(0)
          }}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      </Box>
    </Stack>
  )
}
