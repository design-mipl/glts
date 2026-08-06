import { Box, Typography } from '@mui/material'
import {
  ClipboardCheck,
  FileText,
  MessageSquarePlus,
  UserCog,
} from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { Badge, RowActions, Tooltip, type Column, type Toast } from '@/design-system/UIComponents'
import {
  formatBulkApplicantListingLabel,
  resolveBulkApplicantNames,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  getApplicationOperationalTone,
  getApplicationTypeLabel,
} from '@/pages/customer/features/applications/components/listing/applicationStatus'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import {
  resolveApplicationCreatorLabel,
  resolveApplicationCreatorRoleLabel,
} from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import type { MarineApplicationRow as CorporateApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { isCustomerSubmitted } from '@/shared/services/marineApplicationAdminService'
import { navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { isCorporateReadOnlyWorkspace, isCorporatePendingPaymentWorkspace, opensCorporateViewFormDirectly, resolveCorporateWorkspaceMode } from '../config/CorporateWorkspaceMode'
import { resolveCorporateApplicationQueueTab } from '../config/CorporateApplicationListingTabs'
import { ApplicationSlaCell } from '../../shared/components/ApplicationSlaCell'

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
  onAssignTeam: (row: CorporateApplicationRow) => void,
  fromListing: string,
  row: CorporateApplicationRow,
) {
  const detailPath = `/admin/application-management/corporate/${row.id}`
  const submitted = isCustomerSubmitted(row)
  const readOnlyWorkspace = submitted && isCorporateReadOnlyWorkspace(row)
  const pendingPaymentWorkspace = submitted && isCorporatePendingPaymentWorkspace(row)
  const openViewFormDirectly = submitted && opensCorporateViewFormDirectly(row)
  const workspaceMode = submitted ? resolveCorporateWorkspaceMode(row) : null
  const isSubmissionPending = workspaceMode === 'online_submission'

  const primaryAction = !submitted
    ? {
        label: 'View application',
        icon: <FileText size={16} />,
        onClick: () => navigateFromListing(navigate, detailPath, fromListing),
      }
    : {
        label: readOnlyWorkspace
          ? 'View application'
          : pendingPaymentWorkspace
            ? 'Record payment'
            : isSubmissionPending
              ? 'View Form'
              : 'Verify Documents',
        icon:
          readOnlyWorkspace || pendingPaymentWorkspace || isSubmissionPending ? (
            <FileText size={16} />
          ) : (
            <ClipboardCheck size={16} />
          ),
        onClick: () => {
          navigateFromListing(
            navigate,
            openViewFormDirectly || isSubmissionPending ? `${detailPath}/view-form` : detailPath,
            fromListing,
          )
        },
      }

  return [
    primaryAction,
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
      onClick: () => onAssignTeam(row),
    },
  ]
}

export interface CorporateApplicationTableColumnsParams {
  navigate: NavigateFunction
  showToast: ToastFn
  onAssignTeam: (row: CorporateApplicationRow) => void
  fromListing: string
}

export function buildCorporateApplicationColumns({
  navigate,
  showToast,
  onAssignTeam,
  fromListing,
}: CorporateApplicationTableColumnsParams): Column<CorporateApplicationRow>[] {
  return [
    {
      key: 'createdAt',
      label: 'Creation date',
      widthSize: 'md',
      sortable: true,
      filterable: true,
    },
    {
      key: 'id',
      label: 'GLTS reference',
      widthSize: 'md',
      sortable: true,
      filterable: false,
      render: (value: string, row: CorporateApplicationRow) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
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
      label: 'Pax name',
      widthSize: 'md',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: CorporateApplicationRow) => {
        if (row.recordType !== 'bulk') {
          return (
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              {(row as SingleApplicationRow).applicantName}
            </Typography>
          )
        }

        const passengerNames = resolveBulkApplicantNames(row as BulkBatchRow)
        return (
          <Tooltip placement="top-start" maxWidth={320} content={passengerNames.join(', ')}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: 13, cursor: 'default', display: 'inline-block', maxWidth: '100%' }}
            >
              {formatBulkApplicantListingLabel(row as BulkBatchRow)}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      key: 'companyName',
      label: 'Company name',
      widthSize: 'lg',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: CorporateApplicationRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {resolveApplicationCompanyName(row)}
        </Typography>
      ),
    },
    {
      key: 'countryVisa',
      label: 'Country / Visa',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: CorporateApplicationRow) => (
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
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {value?.trim() ? value : '—'}
        </Typography>
      ),
    },
    {
      key: 'travelDate',
      label: 'Travel date',
      widthSize: 'md',
      sortable: true,
      filterable: true,
    },
    {
      key: 'createdBy',
      label: 'Created by',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: CorporateApplicationRow) => (
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
      widthSize: 'lg',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: CorporateApplicationRow) => (
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
      widthSize: 'md',
      sortable: false,
      filterable: true,
      render: (value: string) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'sla',
      label: 'SLA',
      widthSize: 'sm',
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_: unknown, row: CorporateApplicationRow) => (
        <ApplicationSlaCell
          row={row}
          segment="corporate"
          queueStage={resolveCorporateApplicationQueueTab(row)}
        />
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last updated',
      widthSize: 'md',
      sortable: true,
      filterable: false,
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      render: (_: unknown, row: CorporateApplicationRow) => (
        <RowActions actions={buildRowActions(navigate, showToast, onAssignTeam, fromListing, row)} row={row} />
      ),
    },
  ]
}
