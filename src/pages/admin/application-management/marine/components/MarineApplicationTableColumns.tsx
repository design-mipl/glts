import { Box, Typography } from '@mui/material'
import {
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  MessageSquarePlus,
  UserCog,
} from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { Badge, RowActions, type Column, type Toast } from '@/design-system/UIComponents'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  getApplicationOperationalTone,
  getApplicationTypeLabel,
} from '@/pages/customer/features/applications/components/listing/applicationStatus'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import {
  resolveApplicationCreatorLabel,
  resolveApplicationCreatorRoleLabel,
} from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'

type ToastFn = (toast: Omit<Toast, 'id'>) => void

function operationalStatusBadgeColor(
  status: string,
): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
  const tone = getApplicationOperationalTone(status)
  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'critical') return 'error'
  if (tone === 'info') return 'info'
  return 'neutral'
}

function buildRowActions(
  navigate: NavigateFunction,
  showToast: ToastFn,
  rowId: string,
) {
  const detailPath = `/admin/application-management/marine/${rowId}`

  return [
    {
      label: 'Verify Documents',
      icon: <ClipboardCheck size={16} />,
      onClick: () => navigate(detailPath),
    },
    {
      label: 'View Form',
      icon: <FileText size={16} />,
      onClick: () => navigate(`${detailPath}/view-form`),
    },
    {
      label: 'View Details',
      icon: <Eye size={16} />,
      onClick: () => navigate(detailPath),
      divider: true,
    },
    {
      label: 'Timeline',
      icon: <Clock3 size={16} />,
      onClick: () =>
        showToast({
          title: 'Timeline',
          description: 'Application timeline will open here.',
          variant: 'info',
        }),
    },
    {
      label: 'Add Remarks',
      icon: <MessageSquarePlus size={16} />,
      onClick: () =>
        showToast({
          title: 'Add remarks',
          description: 'Internal remarks dialog will open here.',
          variant: 'info',
        }),
    },
    {
      label: 'Assign Team',
      icon: <UserCog size={16} />,
      onClick: () =>
        showToast({
          title: 'Assign team',
          description: 'Team assignment dialog will open here.',
          variant: 'info',
        }),
    },
  ]
}

export interface MarineApplicationTableColumnsParams {
  navigate: NavigateFunction
  showToast: ToastFn
}

export function buildMarineApplicationColumns({
  navigate,
  showToast,
}: MarineApplicationTableColumnsParams): Column<MarineApplicationRow>[] {
  return [
    {
      key: 'id',
      label: 'GLTS reference',
      sortable: true,
      filterable: false,
      render: (value: string, row: MarineApplicationRow) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            color="primary.main"
            sx={{ fontSize: 13, fontFamily: 'monospace' }}
          >
            {value}
          </Typography>
          <Box sx={{ mt: 0.35 }}>
            <Badge
              label={getApplicationTypeLabel(row.recordType)}
              color={row.recordType === 'bulk' ? 'info' : 'neutral'}
              size="sm"
            />
          </Box>
        </Box>
      ),
    },
    {
      key: 'applicantName',
      label: 'Applicant',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {row.recordType === 'bulk'
            ? `${(row as BulkBatchRow).totalApplicants} travelers`
            : (row as SingleApplicationRow).applicantName}
        </Typography>
      ),
    },
    {
      key: 'companyName',
      label: 'Company name',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {resolveApplicationCompanyName(row)}
        </Typography>
      ),
    },
    {
      key: 'countryVisa',
      label: 'Country / Visa',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Box>
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {row.countryFlag} {row.country}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block' }}>
            {row.visaType}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'jurisdiction',
      label: 'Jurisdiction',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {value?.trim() ? value : '—'}
        </Typography>
      ),
    },
    { key: 'travelDate', label: 'Travel date', sortable: true, filterable: true },
    {
      key: 'createdBy',
      label: 'Created by',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {resolveApplicationCreatorLabel(row.createdByEmail)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {resolveApplicationCreatorRoleLabel(row.createdByRole)}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'operationalStatus',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Badge
          label={row.operationalStatus}
          color={operationalStatusBadgeColor(row.operationalStatus)}
          size="sm"
        />
      ),
    },
    {
      key: 'processingStage',
      label: 'Processing stage',
      sortable: false,
      filterable: true,
      render: (value: string) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    { key: 'lastUpdated', label: 'Last updated', sortable: true, filterable: false },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      width: 60,
      render: (_: unknown, row: MarineApplicationRow) => (
        <RowActions actions={buildRowActions(navigate, showToast, row.id)} row={row} />
      ),
    },
  ]
}
