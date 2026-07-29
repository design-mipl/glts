import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { FundAllocationBatchRow } from '@/shared/types/fundAllocation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  customerSegmentBadgeColor,
  customerSegmentDisplayLabel,
} from '../config/fundAllocationStatusConfig'

export type FundAllocationBatchAction = 'view_details'

export interface FundAllocationBatchTableColumnsParams {
  onAction: (action: FundAllocationBatchAction, row: FundAllocationBatchRow) => void
}

const stackedLinePrimarySx = {
  fontSize: 13,
  lineHeight: 1.35,
  fontWeight: 600,
} as const

const stackedLineSecondarySx = {
  fontSize: 12,
  lineHeight: 1.35,
  color: 'text.secondary',
} as const

function formatAllocatedAt(value: string): string {
  if (!value.trim()) return '—'
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : value
}

function ApplicationCell({ row }: { row: FundAllocationBatchRow }) {
  return (
    <Box sx={{ minWidth: 0, py: 0.25 }}>
      <Typography variant="body2" noWrap sx={{ ...stackedLinePrimarySx, fontWeight: 500 }}>
        {row.country} • {row.visaType}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineSecondarySx}>
        {row.gltsApplicationId}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineSecondarySx}>
        {row.companyName || '—'}
      </Typography>
    </Box>
  )
}

export function buildFundAllocationBatchTableColumns(
  params: FundAllocationBatchTableColumnsParams,
): Column<FundAllocationBatchRow>[] {
  return [
    {
      key: 'passengers',
      label: 'Passengers',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
      render: (_value, row) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
            {row.passengerLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {row.passengerCount} passenger{row.passengerCount === 1 ? '' : 's'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'customerType',
      label: 'Customer type',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      render: (_value, row) => (
        <Badge
          label={customerSegmentDisplayLabel(row.customerSegment)}
          color={customerSegmentBadgeColor(row.customerSegment)}
        />
      ),
    },
    {
      key: 'application',
      label: 'Application',
      widthSize: adminListingColumnWidthSize('statusGroup'),
      sortable: true,
      searchable: true,
      render: (_value, row) => <ApplicationCell row={row} />,
    },
    {
      key: 'jurisdiction',
      label: 'Jurisdiction',
      widthSize: adminListingColumnWidthSize('jurisdiction'),
      sortable: true,
      render: (_value, row) => <Badge label={row.jurisdiction || '—'} color="info" />,
    },
    {
      key: 'assignedTeam',
      label: 'Team',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      searchable: true,
      render: (_value, row) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
          {row.assignedTeam || '—'}
        </Typography>
      ),
    },
    {
      key: 'assignedUser',
      label: 'User',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
      render: (_value, row) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
          {row.assignedUser || '—'}
        </Typography>
      ),
    },
    {
      key: 'requestedTotal',
      label: 'Requested total',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      render: (_value, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
          {row.requestedTotal > 0 ? formatInr(row.requestedTotal) : '—'}
        </Typography>
      ),
    },
    {
      key: 'allocatedAmount',
      label: 'Allocated fund value',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      render: (_value, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
          {row.allocatedAmount > 0 ? formatInr(row.allocatedAmount) : '—'}
        </Typography>
      ),
    },
    {
      key: 'allocatedAt',
      label: 'Allocated at',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_value, row) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
          {formatAllocatedAt(row.allocatedAt)}
        </Typography>
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <RowActions
          row={row}
          actions={[
            {
              label: 'View details',
              icon: <Eye size={16} />,
              onClick: () => params.onAction('view_details', row),
            },
          ]}
        />
      ),
    },
  ]
}
