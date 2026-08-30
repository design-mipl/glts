import { Box, Typography } from '@mui/material'
import {
  ClipboardCheck,
  FileText,
  MessageSquarePlus,
  Play,
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
import { getApplicationOperationalBadgeColor } from '@/pages/customer/features/applications/components/listing/applicationStatus'
import { resolveApplicationCreatorLabel, resolveApplicationCreatorRoleLabel } from '@/pages/customer/features/applications/utils/applicationCreatorUtils'
import type { MarineApplicationRow as RetailApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { isCustomerSubmitted } from '@/shared/services/marineApplicationAdminService'
import { formatRetailApplyDropOffLines } from '@/shared/utils/retailApplyDropOff'
import { formatDisplayDate, formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'
import { navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { isRetailReadOnlyWorkspace, isRetailPendingPaymentWorkspace, opensRetailViewFormDirectly, resolveRetailWorkspaceMode } from '../config/RetailWorkspaceMode'
import { resolveRetailApplicationQueueTab } from '../config/RetailApplicationListingTabs'
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
  onAssignTeam: (row: RetailApplicationRow) => void,
  fromListing: string,
  row: RetailApplicationRow,
) {
  const detailPath = `/admin/application-management/retail/${row.id}`
  const submitted = isCustomerSubmitted(row)
  const readOnlyWorkspace = submitted && isRetailReadOnlyWorkspace(row, fromListing)
  const pendingPaymentWorkspace = submitted && isRetailPendingPaymentWorkspace(row, fromListing)
  const openViewFormDirectly = submitted && opensRetailViewFormDirectly(row, fromListing)
  const workspaceMode = submitted ? resolveRetailWorkspaceMode(row, fromListing) : null
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

  const continuePath = `/admin/application-management/retail/new?application=${encodeURIComponent(row.id)}`

  return [
    primaryAction,
    ...(!submitted
      ? [
          {
            label: 'Continue application',
            icon: <Play size={16} />,
            onClick: () => navigateFromListing(navigate, continuePath, fromListing),
          },
        ]
      : []),
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

export interface RetailApplicationTableColumnsParams {
  navigate: NavigateFunction
  showToast: ToastFn
  onAssignTeam: (row: RetailApplicationRow) => void
  fromListing: string
}

export function buildRetailApplicationColumns({
  navigate,
  showToast,
  onAssignTeam,
  fromListing,
}: RetailApplicationTableColumnsParams): Column<RetailApplicationRow>[] {
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
      render: (value: string) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ fontSize: 13, fontFamily: 'monospace' }}
          >
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'applicantName',
      label: 'Pax name',
      widthSize: 'md',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: RetailApplicationRow) => {
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
      key: 'countryVisa',
      label: 'Country / Visa',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: RetailApplicationRow) => (
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
      render: (_: unknown, row: RetailApplicationRow) => (
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
      render: (_: unknown, row: RetailApplicationRow) => (
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
      render: (_: unknown, row: RetailApplicationRow) =>
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
      widthSize: 'xl',
      sortable: true,
      filterable: true,
      render: (_: unknown, row: RetailApplicationRow) => (
        <Badge
          label={row.operationalStatus}
          color={getApplicationOperationalBadgeColor(row.operationalStatus)}
          size="sm"
        />
      ),
    },
    {
      key: 'processingStage',
      label: 'Stage',
      widthSize: 'lg',
      sortable: false,
      filterable: true,
      render: (_: unknown, row: RetailApplicationRow) => {
        if (
          row.recordType === 'single' &&
          row.operationalStatus === 'Draft' &&
          row.retailApply
        ) {
          const { primary, secondary } = formatRetailApplyDropOffLines(row.retailApply)
          return (
            <Box sx={{ minWidth: 0, py: 0.25 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: 12, lineHeight: 1.3, whiteSpace: 'nowrap' }}
              >
                {primary}
              </Typography>
              {secondary ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {secondary}
                </Typography>
              ) : null}
            </Box>
          )
        }

        return (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {row.processingStage}
          </Typography>
        )
      },
    },
    {
      key: 'sla',
      label: 'SLA',
      widthSize: 'sm',
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_: unknown, row: RetailApplicationRow) => (
        <ApplicationSlaCell
          row={row}
          segment="retail"
          queueStage={resolveRetailApplicationQueueTab(row)}
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
      render: (_: unknown, row: RetailApplicationRow) => (
        <RowActions actions={buildRowActions(navigate, showToast, onAssignTeam, fromListing, row)} row={row} />
      ),
    },
  ]
}
