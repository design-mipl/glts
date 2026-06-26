import { Eye, PauseCircle, PencilLine } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import { formatAgreementDate } from '../utils/agreementFormUtils'
import {
  agreementStatusColor,
  agreementStatusLabel,
  billingTypeColor,
  billingTypeLabel,
  canEditAgreement,
  canUpdateAgreementHoldOrTerminate,
  workflowTypeColor,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: CommercialAgreement) => void
  onOpenEdit: (row: CommercialAgreement) => void
  onUpdateStatus: (row: CommercialAgreement) => void
}

export function buildAgreementColumns({
  onOpenDetail,
  onOpenEdit,
  onUpdateStatus,
}: ColumnHandlers): Column<CommercialAgreement>[] {
  return [
    {
      key: 'agreementId',
      label: 'Agreement ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'companyName',
      label: 'Company Name',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'billingType',
      label: 'Billing Type',
      widthSize: adminListingColumnWidthSize('service'),
      filterable: true,
      render: (_, row) => <Badge label={billingTypeLabel[row.billingType]} color={billingTypeColor[row.billingType]} size="sm" />,
    },
    {
      key: 'workflowType',
      label: 'Workflow Type',
      widthSize: adminListingColumnWidthSize('service'),
      filterable: true,
      render: (_, row) => (
        <Badge label={workflowTypeLabel[row.workflowType]} color={workflowTypeColor[row.workflowType]} size="sm" />
      ),
    },
    {
      key: 'totalEntities',
      label: 'Total Entities',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      render: (_, row) => row.entities.length,
    },
    {
      key: 'creditLimit',
      label: 'Credit Limit',
      widthSize: 'md',
      sortable: true,
      render: (_, row) =>
        row.billingConfig.creditLimit
          ? `₹${row.billingConfig.creditLimit.toLocaleString('en-IN')}`
          : '—',
    },
    {
      key: 'advanceRule',
      label: 'Advance Rule',
      widthSize: 'md',
      render: (_, row) => deriveAdvanceRuleSummary(row.billingType, row.billingConfig),
    },
    {
      key: 'startDate',
      label: 'Agreement start date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatAgreementDate(row.startDate),
    },
    {
      key: 'endDate',
      label: 'Agreement expiry date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatAgreementDate(row.endDate),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge label={agreementStatusLabel[row.status]} color={agreementStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => new Date(row.updatedAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
        ]
        if (canEditAgreement(row.status)) {
          actions.push({ label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) })
        }
        if (canUpdateAgreementHoldOrTerminate(row.status)) {
          actions.push({
            label: 'Update status',
            icon: <PauseCircle size={14} />,
            onClick: () => onUpdateStatus(row),
          })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
