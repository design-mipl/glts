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
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { isCustomerSubmitted } from '@/shared/services/marineApplicationAdminService'
import { navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { isMarineReadOnlyWorkspace } from '../config/marineWorkspaceMode'

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
  onAssignTeam: (row: MarineApplicationRow) => void,
  fromListing: string,
  row: MarineApplicationRow,
) {
  const detailPath = `/admin/application-management/marine/${row.id}`
  const submitted = isCustomerSubmitted(row)
  const readOnlyWorkspace = submitted && isMarineReadOnlyWorkspace(row)

  return [
    {
      label: readOnlyWorkspace ? 'View application' : 'Verify Documents',
      icon: readOnlyWorkspace ? <FileText size={16} /> : <ClipboardCheck size={16} />,
      disabled: !submitted,
      onClick: () => {
        if (!submitted) {
          showToast({
            title: 'Draft application',
            description: 'Submit this application before opening document verification.',
            variant: 'info',
          })
          return
        }
        navigateFromListing(
          navigate,
          readOnlyWorkspace ? `${detailPath}/view-form` : detailPath,
          fromListing,
        )
      },
    },
    ...(readOnlyWorkspace
      ? []
      : [
          {
            label: 'View Form',
            icon: <FileText size={16} />,
            disabled: !submitted,
            onClick: () => {
              if (!submitted) {
                showToast({
                  title: 'Draft application',
                  description: 'Submit this application before opening the form assist workspace.',
                  variant: 'info',
                })
                return
              }
              navigateFromListing(navigate, `${detailPath}/view-form`, fromListing)
            },
          },
        ]),
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
      label: 'Pax name',
      widthSize: 'md',
      sortable: false,
      filterable: false,
      render: (_: unknown, row: MarineApplicationRow) => {
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
      render: (_: unknown, row: MarineApplicationRow) => (
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
      key: 'operationalStatus',
      label: 'Status',
      widthSize: 'sm',
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
      render: (_: unknown, row: MarineApplicationRow) => (
        <RowActions actions={buildRowActions(navigate, showToast, onAssignTeam, fromListing, row)} row={row} />
      ),
    },
  ]
}
