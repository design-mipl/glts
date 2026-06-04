import { Box, Typography } from '@mui/material'
import type { Column } from '@/design-system/UIComponents'
import { Badge } from '@/design-system/UIComponents'
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
      sortable: true,
      minWidth: 150,
      render: (_, row) => row.id,
    },
    {
      key: 'applicationType',
      label: 'Type',
      sortable: true,
      minWidth: 90,
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
      sortable: true,
      minWidth: 100,
      render: (_, row) => (
        <Badge label={getBillableCustomerSegmentLabel(row)} color="neutral" size="sm" />
      ),
    },
    { key: 'companyName', label: 'Company', sortable: true, minWidth: 160 },
    {
      key: 'applicantCount',
      label: 'Applicant / Crew',
      sortable: true,
      minWidth: 140,
      render: (_, row) => getBillableApplicantCrewLabel(row),
    },
    {
      key: 'passportOrBatch',
      label: 'Passport / Batch',
      sortable: true,
      minWidth: 130,
      render: (_, row) => getBillablePassportOrBatchLabel(row),
    },
    {
      key: 'countryVisa',
      label: 'Country / Visa',
      sortable: true,
      minWidth: 160,
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
      sortable: true,
      minWidth: 110,
      render: (_, row) => getAppointmentDate(row as SingleApplicationRow | BulkBatchRow),
    },
    {
      key: 'processingStage',
      label: 'Processing Stage',
      sortable: true,
      minWidth: 150,
      render: (_, row) => row.processingStage,
    },
    {
      key: 'billingEntity',
      label: 'Billing Entity',
      sortable: true,
      minWidth: 170,
      render: (_, row) => resolveApplicationBillingEntity(row),
    },
    {
      key: 'vessel',
      label: 'Vessel',
      sortable: true,
      minWidth: 140,
      render: (_, row) => resolveApplicationVessel(row),
    },
    {
      key: 'status',
      label: 'Status',
      minWidth: 140,
      render: (_, row) => (
        <Badge label={getOperationalStatusLabel(row)} color="info" size="sm" />
      ),
    },
  ]
}

export const billableApplicationColumns = buildColumns()
