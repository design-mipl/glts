import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Eye, Wallet } from 'lucide-react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { getApplicationOperationalTone } from '@/pages/customer/features/applications/components/listing/applicationStatus'
import { formatTravelDateLabel } from '@/pages/admin/assignment-priority/utils/assignmentQueueListingUtils'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  customerSegmentBadgeColor,
  customerSegmentDisplayLabel,
  fundAllocationStatusBadgeColor,
  fundAllocationStatusLabel,
} from '../config/fundAllocationStatusConfig'

export type FundAllocationAdminAction = 'allocate_funds' | 'view_details'

export interface FundAllocationTableColumnsParams {
  listingTab: 'pending_allocation' | 'allocated'
  onAction: (action: FundAllocationAdminAction, row: FundAllocationPassengerRow) => void
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

const stackedLineTertiarySx = {
  fontSize: 12,
  lineHeight: 1.35,
  color: 'text.secondary',
} as const

function operationalStatusBadgeColor(status: string): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
  const tone = getApplicationOperationalTone(status)
  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'critical') return 'error'
  if (tone === 'info') return 'info'
  return 'neutral'
}

function ApplicationCell({ row }: { row: FundAllocationPassengerRow }) {
  return (
    <Box sx={{ minWidth: 0, py: 0.25 }}>
      <Typography variant="body2" noWrap sx={{ ...stackedLinePrimarySx, fontWeight: 500 }}>
        {row.country} • {row.visaType}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineSecondarySx}>
        {row.gltsApplicationId}
      </Typography>
      <Typography variant="body2" noWrap sx={stackedLineTertiarySx}>
        {row.companyName || '—'}
      </Typography>
    </Box>
  )
}

function StackedStatus({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, py: 0.25 }}>
      {children}
    </Box>
  )
}

function StatusCell({ row }: { row: FundAllocationPassengerRow }) {
  return (
    <StackedStatus>
      <Badge
        label={fundAllocationStatusLabel(row.allocationStatus)}
        color={fundAllocationStatusBadgeColor(row.allocationStatus)}
      />
      <Badge label={row.submissionStatus} color={operationalStatusBadgeColor(row.submissionStatus)} />
    </StackedStatus>
  )
}

function buildRowActions(params: FundAllocationTableColumnsParams, row: FundAllocationPassengerRow) {
  const actions = [
    {
      label: 'View details',
      icon: <Eye size={16} />,
      onClick: () => params.onAction('view_details', row),
    },
  ]

  if (params.listingTab === 'pending_allocation') {
    return [
      {
        label: 'Allocate funds',
        icon: <Wallet size={16} />,
        onClick: () => params.onAction('allocate_funds', row),
      },
      ...actions,
    ]
  }

  return actions
}

export function buildFundAllocationTableColumns(
  params: FundAllocationTableColumnsParams,
): Column<FundAllocationPassengerRow>[] {
  const amountColumn =
    params.listingTab === 'allocated'
      ? {
          key: 'allocatedAmount',
          label: 'Allocated fund value',
          widthSize: adminListingColumnWidthSize('count'),
          sortable: true,
          render: (_value: unknown, row: FundAllocationPassengerRow) => (
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
              {row.allocatedAmount > 0 ? formatInr(row.allocatedAmount) : '—'}
            </Typography>
          ),
        }
      : {
          key: 'suggestedAmount',
          label: 'Catalog total',
          widthSize: adminListingColumnWidthSize('count'),
          sortable: true,
          render: (_value: unknown, row: FundAllocationPassengerRow) => (
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              {row.suggestedAllocationAmount > 0 ? formatInr(row.suggestedAllocationAmount) : '—'}
            </Typography>
          ),
        }

  return [
    {
      key: 'passenger',
      label: 'Passenger',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
      render: (_value, row) => (
        <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
          {row.passengerName}
        </Typography>
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
      key: 'travelDate',
      label: 'Travel date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_value, row) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
          {formatTravelDateLabel(row.travelDate)}
        </Typography>
      ),
    },
    {
      key: 'submissionDate',
      label: 'VFS submission date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_value, row) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
          {formatTravelDateLabel(row.submissionDate)}
        </Typography>
      ),
    },
    amountColumn,
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('statusGroup'),
      sortable: true,
      render: (_value, row) => <StatusCell row={row} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => <RowActions row={row} actions={buildRowActions(params, row)} />,
    },
  ]
}
