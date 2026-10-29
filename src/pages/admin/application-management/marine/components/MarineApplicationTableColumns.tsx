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
  getApplicationOperationalBadgeColor,
  getApplicationTypeLabel,
} from '@/pages/customer/features/applications/components/listing/applicationStatus'
import { resolveApplicationCompanyName, resolveApplicationVesselName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import {
  resolveApplicationBillingEntity,
  resolveApplicationCompassNo,
  resolveApplicationJoiningPort,
  resolveApplicationPoCidNo,
} from '@/pages/customer/features/applications/utils/applicationReferenceUtils'
import {
  resolveApplicationCreatorLabel,
  resolveApplicationCreatorRoleLabel,
} from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { isCustomerSubmitted } from '@/shared/services/marineApplicationAdminService'
import { formatDisplayDate, formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'
import { navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { isMarineReadOnlyWorkspace, isMarinePendingPaymentWorkspace, opensMarineViewFormDirectly, resolveMarineWorkspaceMode } from '../config/marineWorkspaceMode'
import { resolveMarineApplicationQueueTab } from '../config/marineApplicationListingTabs'
import { ApplicationSlaCell } from '../../shared/components/ApplicationSlaCell'
import { ApplicationVipStar } from '../../shared/components/ApplicationVipStar'
import {
  applicationPriorityBadgeColor,
  applicationPriorityLabel,
} from '../../shared/config/applicationConsultantConfig'
import {
  resolveApplicationConsultantName,
  resolveApplicationConsultantTeamName,
} from '../../shared/utils/applicationConsultantUtils'

type ToastFn = (toast: Omit<Toast, 'id'>) => void

function buildRowActions(
  navigate: NavigateFunction,
  showToast: ToastFn,
  onAssignTeam: (row: MarineApplicationRow) => void,
  fromListing: string,
  row: MarineApplicationRow,
) {
  const detailPath = `/admin/application-management/marine/${row.id}`
  const submitted = isCustomerSubmitted(row)
  const readOnlyWorkspace = submitted && isMarineReadOnlyWorkspace(row, fromListing)
  const pendingPaymentWorkspace = submitted && isMarinePendingPaymentWorkspace(row, fromListing)
  const openViewFormDirectly = submitted && opensMarineViewFormDirectly(row, fromListing)
  const workspaceMode = submitted ? resolveMarineWorkspaceMode(row, fromListing) : null
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
      label: 'Assign consultant',
      icon: <UserCog size={16} />,
      onClick: () => onAssignTeam(row),
    },
  ]
}

export interface MarineApplicationTableColumnsParams {
  navigate: NavigateFunction
  showToast: ToastFn
  onAssignTeam: (row: MarineApplicationRow) => void
  fromListing: string
}

export function buildMarineApplicationColumns({
  navigate,
  showToast,
  onAssignTeam,
  fromListing,
}: MarineApplicationTableColumnsParams): Column<MarineApplicationRow>[] {
  return [
    {
      key: 'createdAt',
      label: 'Creation date',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_, row) => formatDisplayDateTime(row.createdAt),
    },
    {
      key: 'id',
      label: 'GLTS reference',
      widthSize: 'md',
      sortable: true,
      filterable: false,
      render: (value: string, row: MarineApplicationRow) => (
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
      render: (_: unknown, row: MarineApplicationRow) => {
        const vipStar = row.isVip ? <ApplicationVipStar /> : null
        if (row.recordType !== 'bulk') {
          return (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              {vipStar}
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                {(row as SingleApplicationRow).applicantName}
              </Typography>
            </Box>
          )
        }

        const passengerNames = resolveBulkApplicantNames(row as BulkBatchRow)
        return (
          <Tooltip placement="top-start" maxWidth={320} content={passengerNames.join(', ')}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, minWidth: 0, maxWidth: '100%' }}>
              {vipStar}
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: 13, cursor: 'default', display: 'inline-block', maxWidth: '100%' }}
              >
                {formatBulkApplicantListingLabel(row as BulkBatchRow)}
              </Typography>
            </Box>
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
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {resolveApplicationCompanyName(row)}
        </Typography>
      ),
    },
    {
      key: 'vesselName',
      label: 'Vessel',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationVesselName(row)}
        </Typography>
      ),
    },
    {
      key: 'billingEntityName',
      label: 'Billing entity',
      widthSize: 'md',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationBillingEntity(row)}
        </Typography>
      ),
    },
    {
      key: 'poCidNo',
      label: 'PO / CID no.',
      widthSize: 'sm',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationPoCidNo(row)}
        </Typography>
      ),
    },
    {
      key: 'compassNo',
      label: 'Compass No.',
      widthSize: 'sm',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationCompassNo(row)}
        </Typography>
      ),
    },
    {
      key: 'joiningPort',
      label: 'Joining port',
      widthSize: 'sm',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {resolveApplicationJoiningPort(row)}
        </Typography>
      ),
    },
    {
      key: 'countryVisa',
      label: 'Country / Visa',
      widthSize: 'md',
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
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {formatDisplayDate(value)}
        </Typography>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created by',
      widthSize: 'md',
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
      key: 'consultant',
      label: 'Consultant',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {resolveApplicationConsultantName(row)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {resolveApplicationConsultantTeamName(row)}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) =>
        row.priority ? (
          <Badge
            label={applicationPriorityLabel[row.priority]}
            color={applicationPriorityBadgeColor(row.priority)}
            size="sm"
          />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            —
          </Typography>
        ),
    },
    {
      key: 'operationalStatus',
      label: 'Status',
      widthSize: 'xxl',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: MarineApplicationRow) => (
        <Badge
          label={row.operationalStatus}
          color={getApplicationOperationalBadgeColor(row.operationalStatus)}
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
      render: (_: unknown, row: MarineApplicationRow) => (
        <ApplicationSlaCell
          row={row}
          segment="marine"
          queueStage={resolveMarineApplicationQueueTab(row)}
        />
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last updated',
      widthSize: 'md',
      sortable: true,
      filterable: false,
      render: (_, row) => formatDisplayDateTime(row.lastUpdated),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      render: (_: unknown, row: MarineApplicationRow) => (
        <RowActions actions={buildRowActions(navigate, showToast, onAssignTeam, fromListing, row)} row={row} />
      ),
    },
  ]
}
