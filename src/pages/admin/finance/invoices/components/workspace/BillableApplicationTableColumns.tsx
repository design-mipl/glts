import { Box, Typography } from '@mui/material'
import type { Column } from '@/design-system/UIComponents'
import { Badge } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  getApplicationTypeLabel,
  getAppointmentDate,
  getOperationalStatusLabel,
  resolveApplicationBillingEntity,
  resolveApplicationVessel,
} from '@/shared/utils/invoiceBillingEngine'
import {
  getBillableApplicantCrewLabel,
  getBillableCustomerSegmentLabel,
  getBillablePassportOrBatchLabel,
} from '../../utils/billableApplicationSelectionUtils'

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
      key: 'applicantCount',
      label: 'Applicant / Crew',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: true,
      render: (_, row) => getBillableApplicantCrewLabel(row),
    },
    {
      key: 'passportOrBatch',
      label: 'Passport / Batch',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: true,
      render: (_, row) => getBillablePassportOrBatchLabel(row),
    },
    {
      key: 'countryVisa',
      label: 'Country / Visa',
      widthSize: adminListingColumnWidthSize('applicationSummary'),
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
      key: 'appointmentDate',
      label: 'Appointment',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => getAppointmentDate(row as SingleApplicationRow | BulkBatchRow),
    },
    {
      key: 'processingStage',
      label: 'Processing Stage',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: true,
      render: (_, row) => row.processingStage,
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
