import { Box, Typography } from '@mui/material'
import type { Column } from '@/design-system/UIComponents'
import { Badge, Tooltip } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import {
  formatBulkApplicantListingLabel,
  resolveBulkApplicantNames,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  getApplicationTypeLabel,
  getOperationalStatusLabel,
  resolveApplicationBillingEntity,
  resolveApplicationVessel,
} from '@/shared/utils/invoiceBillingEngine'
import {
  getBillableCustomerSegmentLabel,
} from '../../utils/billableApplicationSelectionUtils'

function PaxNameCell({ row }: { row: ApplicationListingRow }) {
  if (row.recordType !== 'bulk') {
    return (
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {(row as SingleApplicationRow).applicantName}
      </Typography>
    )
  }

  const bulk = row as BulkBatchRow
  const passengerNames = resolveBulkApplicantNames(bulk)
  return (
    <Tooltip placement="top-start" maxWidth={320} content={passengerNames.join(', ')}>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ fontSize: 13, cursor: 'default', display: 'inline-block', maxWidth: '100%' }}
      >
        {formatBulkApplicantListingLabel(bulk)}
      </Typography>
    </Tooltip>
  )
}

function buildColumns(): Column<ApplicationListingRow>[] {
  return [
    {
      key: 'gltsReference',
      label: 'GLTS Reference',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      render: (_, row) => row.id,
    },
    {
      key: 'applicationType',
      label: 'Type',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      render: (_, row) => (
        <Badge
          label={getApplicationTypeLabel(row)}
          color={row.recordType === 'bulk' ? 'info' : 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'customerSegment',
      label: 'Segment',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      render: (_, row) => (
        <Badge label={getBillableCustomerSegmentLabel(row)} color="neutral" size="sm" />
      ),
    },
    {
      key: 'companyName',
      label: 'Company',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
    },
    {
      key: 'applicantName',
      label: 'Pax name',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: true,
      render: (_, row) => <PaxNameCell row={row} />,
    },
    {
      key: 'countryVisa',
      label: 'Country / Visa',
      widthSize: adminListingColumnWidthSize('country'),
      sortable: true,
      render: (_, row) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }} noWrap title={row.country}>
            {row.country}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap title={row.visaType}>
            {row.visaType}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'submissionDate',
      label: 'Online Submission Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => row.submissionDate?.trim() || '—',
    },
    {
      key: 'billingEntity',
      label: 'Billing Entity',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      render: (_, row) => resolveApplicationBillingEntity(row),
    },
    {
      key: 'vessel',
      label: 'Vessel',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      render: (_, row) => resolveApplicationVessel(row),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge label={getOperationalStatusLabel(row)} color="info" size="sm" />
      ),
    },
  ]
}

export const billableApplicationColumns = buildColumns()
