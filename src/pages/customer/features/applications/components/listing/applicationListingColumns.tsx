import { Box, Typography } from '@mui/material'
import {
  Eye,
  Download,
  LifeBuoy,
} from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { RowActions, type Column } from '@/design-system/UIComponents'
import type { Toast } from '@/design-system/UIComponents'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { BulkBatchRow, SingleApplicationRow } from '../../data/applicationFlowData'
import {
  getApplicationOperationalTone,
  getApplicationTypeLabel,
  getApplicationTypeTone,
} from './applicationStatus'
import { resolveApplicationCompanyName } from '../../utils/applicationCompanyUtils'
import {
  resolveApplicationCreatorLabel,
  resolveApplicationCreatorRoleLabel,
} from '../../utils/applicationCreatorUtils'

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
    { key: 'travelDate', label: 'Travel date', sortable: true, width: 110 },
    { key: 'submissionDate', label: 'Submission date', sortable: true, width: 120 },
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
    { key: 'lastUpdated', label: 'Last updated', sortable: true, width: 110 },
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
}: ApplicationListingColumnsParams): Column<SingleApplicationRow | BulkBatchRow>[] {
  const columns: Column<SingleApplicationRow | BulkBatchRow>[] = [
    {
      key: 'id',
      label: 'GLTS reference',
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
      label: 'Applicant',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {row.recordType === 'bulk' ? `${row.totalApplicants} travelers` : row.applicantName}
        </Typography>
      ),
    },
    {
      key: 'companyName',
      label: 'Company name',
      sortable: true,
      filterable: true,
      width: 180,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {resolveApplicationCompanyName(row)}
        </Typography>
      ),
    },
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
    { key: 'travelDate', label: 'Travel date', sortable: true, filterable: true, width: 110 },
  ]

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
      label: 'Status',
      sortable: true,
      filterable: true,
      width: 150,
      render: (_: unknown, row: SingleApplicationRow | BulkBatchRow) => (
        <CustomerStatusChip label={row.operationalStatus} tone={getApplicationOperationalTone(row.operationalStatus)} />
      ),
    },
    {
      key: 'processingStage',
      label: 'Processing stage',
      sortable: false,
      filterable: true,
      width: 150,
      render: (value: string) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {value}
        </Typography>
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
    { key: 'lastUpdated', label: 'Last updated', sortable: true, width: 110 },
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
