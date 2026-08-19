import { Box, Typography } from '@mui/material'
import {
  Eye,
  Download,
  LifeBuoy,
} from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { RowActions, Tooltip, type Column } from '@/design-system/UIComponents'
import type { Toast } from '@/design-system/UIComponents'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  formatBulkApplicantListingLabel,
  resolveBulkApplicantNames,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '../../data/applicationFlowData'
import {
  getApplicationOperationalTone,
  getApplicationTypeLabel,
  getApplicationTypeTone,
} from './applicationStatus'
import { resolveApplicationCompanyName, resolveApplicationTravelerRole, resolveApplicationTravelerRoleLabel, resolveApplicationVesselName } from '../../utils/applicationCompanyUtils'
import {
  resolveApplicationBillingEntity,
  resolveApplicationCompassNo,
  resolveApplicationJoiningPort,
  resolveApplicationPoCidNo,
} from '../../utils/applicationReferenceUtils'
import {
  resolveApplicationCreatorLabel,
  resolveApplicationCreatorRoleLabel,
} from '../../utils/applicationCreatorUtils'
import type { ApplicationCustomerSegment } from '../../types/applicationListing.types'
import {
  getTravelerRoleColumnKey,
  showsMarineReferenceFields,
  showsTravelerRoleColumn,
  usesDesignationLabel,
} from '@/shared/utils/applicationSegmentListingPolicy'
import { formatDisplayDate, formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

type ToastFn = (toast: Omit<Toast, 'id'>) => void

function buildRowActions(
  base: string,
  navigate: NavigateFunction,
  showToast: ToastFn,
  rowId: string,
  _operationalStatus: string,
) {
  const detailPath = `${base}/applications/${rowId}`

  return [
    { label: 'View details', icon: <Eye size={16} />, onClick: () => navigate(detailPath) },
    {
      label: 'Download summary',
      icon: <Download size={16} />,
      onClick: () =>
        showToast({ title: 'Download started', description: 'Summary PDF will download shortly.', variant: 'success' }),
      divider: true,
    },
    {
      label: 'Raise support ticket',
      icon: <LifeBuoy size={16} />,
      onClick: () =>
        showToast({ title: 'Support ticket', description: 'Our team will contact you within one business day.', variant: 'info' }),
    },
  ]
}

export interface ApplicationListingColumnsParams {
  base: string
  navigate: NavigateFunction
  showToast: ToastFn
  showCreatedBy?: boolean
  customerSegment?: ApplicationCustomerSegment
}

export function buildSingleApplicationColumns({
  base,
  navigate,
  showToast,
}: ApplicationListingColumnsParams): Column<SingleApplicationRow>[] {
  return [
    {
      key: 'id',
      label: 'Application ID',
      sortable: true,
      filterable: true,
      width: 150,
      render: (value: string) => (
        <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'applicantName',
      label: 'Applicant name',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: SingleApplicationRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {row.countryFlag} {row.country}
        </Typography>
      ),
    },
    { key: 'visaType', label: 'Visa type', sortable: true, filterable: true, width: 140 },
    { key: 'travelDate', label: 'Travel date', sortable: true, width: 110, render: (_, row) => formatDisplayDate(row.travelDate) },
    { key: 'submissionDate', label: 'Submission date', sortable: true, width: 120, render: (_, row) => formatDisplayDate(row.submissionDate) },
    {
      key: 'operationalStatus',
      label: 'Current status',
      sortable: true,
      filterable: true,
      width: 150,
      render: (_: unknown, row: SingleApplicationRow) => (
        <CustomerStatusChip label={row.operationalStatus} tone={getApplicationOperationalTone(row.operationalStatus)} />
      ),
    },
    { key: 'lastUpdated', label: 'Last updated', sortable: true, width: 110, render: (_, row) => formatDisplayDateTime(row.lastUpdated) },
    {
      key: 'actions',
      label: '',
      sortable: false,
      hideable: false,
      width: 56,
      render: (_: unknown, row: SingleApplicationRow) => (
        <RowActions
          actions={buildRowActions(base, navigate, showToast, row.id, row.operationalStatus)}
          row={row}
        />
      ),
    },
  ]
}

/** Unified listing columns — single and bulk applications in one table. */
export function buildUnifiedApplicationColumns({
  base,
  navigate,
  showToast,
  showCreatedBy = true,
  customerSegment = 'retail',
}: ApplicationListingColumnsParams): Column<SingleApplicationRow | BulkBatchRow>[] {
  const roleColumnKey = getTravelerRoleColumnKey(customerSegment)
  const roleColumnLabel = resolveApplicationTravelerRoleLabel(customerSegment)

  const columns: Column<SingleApplicationRow | BulkBatchRow>[] = [
    {
      key: 'id',
      label: 'GLTS ref no',
      sortable: true,
      filterable: false,
      width: 160,
      render: (value: string, row: SingleApplicationRow | BulkBatchRow) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            color="primary.main"
            sx={{ fontSize: 13, fontFamily: 'monospace' }}
          >
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {row.recordType === 'bulk' ? 'Batch' : 'Application'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'applicationType',
      label: 'Type',
      sortable: false,
      filterable: true,
      width: 100,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <CustomerStatusChip
          label={getApplicationTypeLabel(row.recordType)}
          tone={getApplicationTypeTone(row.recordType)}
        />
      ),
    },
    {
      key: 'applicantName',
      label: 'Pax name',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => {
        if (row.recordType !== 'bulk') {
          return (
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              {row.applicantName}
            </Typography>
          )
        }

        const passengerNames = resolveBulkApplicantNames(row)
        return (
          <Tooltip
            placement="top-start"
            maxWidth={320}
            content={passengerNames.join(', ')}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: 13, cursor: 'default', display: 'inline-block', maxWidth: '100%' }}
            >
              {formatBulkApplicantListingLabel(row)}
            </Typography>
          </Tooltip>
        )
      },
    },
  ]

  if (showsTravelerRoleColumn(customerSegment) && roleColumnKey) {
    columns.push({
      key: roleColumnKey,
      label: roleColumnLabel,
      sortable: false,
      filterable: false,
      width: 130,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationTravelerRole(row, customerSegment)}
        </Typography>
      ),
    })
  }

  columns.push(
    {
      key: 'billingEntityName',
      label: 'Billing entity',
      sortable: false,
      filterable: false,
      width: 150,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationBillingEntity(row)}
        </Typography>
      ),
    },
  )

  if (showsMarineReferenceFields(customerSegment)) {
    columns.push(
      {
        key: 'poCidNo',
        label: 'PO / CID no.',
        sortable: false,
        filterable: false,
        width: 130,
        render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {resolveApplicationPoCidNo(row)}
          </Typography>
        ),
      },
      {
        key: 'compassNo',
        label: 'Compass No.',
        sortable: false,
        filterable: false,
        width: 130,
        render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {resolveApplicationCompassNo(row)}
          </Typography>
        ),
      },
      {
        key: 'joiningPort',
        label: 'Joining port',
        sortable: false,
        filterable: false,
        width: 120,
        render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {resolveApplicationJoiningPort(row)}
          </Typography>
        ),
      },
      {
        key: 'vesselName',
        label: 'Vessel name',
        sortable: true,
        filterable: true,
        width: 160,
        render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {resolveApplicationVesselName(row)}
          </Typography>
        ),
      },
    )
  }

  if (usesDesignationLabel(customerSegment)) {
    columns.push({
      key: 'companyName',
      label: 'Company name',
      sortable: true,
      filterable: true,
      width: 160,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {resolveApplicationCompanyName(row)}
        </Typography>
      ),
    })
  }

  columns.push(
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {row.countryFlag} {row.country}
        </Typography>
      ),
    },
    { key: 'visaType', label: 'Visa type', sortable: false, filterable: true, width: 130 },
    { key: 'travelDate', label: 'Date of Travel', sortable: true, filterable: true, width: 120, render: (_, row) => formatDisplayDate(row.travelDate) },
    {
      key: 'processingStage',
      label: 'Processing stage',
      sortable: false,
      filterable: true,
      width: 160,
      render: (value: string) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    { key: 'submissionDate', label: 'Submission Date', sortable: true, filterable: false, width: 130, render: (_, row) => formatDisplayDate(row.submissionDate) },
    {
      key: 'tentativeCollectionDate',
      label: 'Tentative Collection Date',
      sortable: true,
      filterable: false,
      width: 170,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {formatDisplayDate(row.tentativeCollectionDate)}
        </Typography>
      ),
    },
  )

  if (showCreatedBy) {
    columns.push({
      key: 'createdBy',
      label: 'Created by',
      sortable: true,
      filterable: true,
      width: 150,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {resolveApplicationCreatorLabel(row.createdByEmail)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {resolveApplicationCreatorRoleLabel(row.createdByRole)}
          </Typography>
        </Box>
      ),
    })
  }

  columns.push(
    {
      key: 'operationalStatus',
      label: 'Visa status',
      sortable: true,
      filterable: true,
      width: 150,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <CustomerStatusChip label={row.operationalStatus} tone={getApplicationOperationalTone(row.operationalStatus)} />
      ),
    },
    { key: 'lastUpdated', label: 'Last updated', sortable: true, filterable: false, width: 110 },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      width: 56,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <RowActions
          actions={buildRowActions(base, navigate, showToast, row.id, row.operationalStatus)}
          row={row}
        />
      ),
    },
  )

  return columns
}

/** @deprecated Use buildUnifiedApplicationColumns */
export const buildMixedApplicationColumns = buildUnifiedApplicationColumns

export function buildBulkApplicationColumns({
  base,
  navigate,
  showToast,
}: ApplicationListingColumnsParams): Column<BulkBatchRow>[] {
  return [
    {
      key: 'id',
      label: 'Batch ID',
      sortable: true,
      filterable: true,
      width: 160,
      render: (value: string) => (
        <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'companyName',
      label: 'Company name',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: BulkBatchRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {row.countryFlag} {row.country}
        </Typography>
      ),
    },
    { key: 'visaType', label: 'Visa type', sortable: true, filterable: true, width: 140 },
    { key: 'totalApplicants', label: 'Total applicants', sortable: true, align: 'right', width: 110 },
    { key: 'verifiedApplicants', label: 'Verified applicants', sortable: true, align: 'right', width: 130 },
    {
      key: 'pendingCorrections',
      label: 'Pending corrections',
      sortable: true,
      align: 'right',
      width: 130,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={600} color={Number(value) > 0 ? 'warning.main' : 'text.primary'} sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'operationalStatus',
      label: 'Current status',
      sortable: true,
      filterable: true,
      width: 150,
      render: (_: unknown, row: BulkBatchRow) => (
        <CustomerStatusChip label={row.operationalStatus} tone={getApplicationOperationalTone(row.operationalStatus)} />
      ),
    },
    { key: 'lastUpdated', label: 'Last updated', sortable: true, width: 110, render: (_, row) => formatDisplayDateTime(row.lastUpdated) },
    {
      key: 'actions',
      label: '',
      sortable: false,
      hideable: false,
      width: 56,
      render: (_: unknown, row: BulkBatchRow) => (
        <RowActions
          actions={buildRowActions(base, navigate, showToast, row.id, row.operationalStatus)}
          row={row}
        />
      ),
    },
  ]
}
