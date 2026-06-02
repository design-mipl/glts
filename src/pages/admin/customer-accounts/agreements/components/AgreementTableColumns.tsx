import { Eye, PencilLine, ShieldCheck, XCircle } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import {
  agreementStatusColor,
  agreementStatusLabel,
  billingTypeColor,
  billingTypeLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: CommercialAgreement) => void
  onOpenEdit: (row: CommercialAgreement) => void
  onApprove: (row: CommercialAgreement) => void
  onReject: (row: CommercialAgreement) => void
}

export function buildAgreementColumns({
  onOpenDetail,
  onOpenEdit,
  onApprove,
  onReject,
}: ColumnHandlers): Column<CommercialAgreement>[] {
  return [
    { key: 'agreementId', label: 'Agreement ID', sortable: true, searchable: true, hideable: false, minWidth: 130 },
    { key: 'companyName', label: 'Company Name', sortable: true, searchable: true, minWidth: 200 },
    {
      key: 'billingType',
      label: 'Billing Type',
      filterable: true,
      minWidth: 110,
      render: (_, row) => <Badge label={billingTypeLabel[row.billingType]} color={billingTypeColor[row.billingType]} size="sm" />,
    },
    {
      key: 'workflowType',
      label: 'Workflow Type',
      filterable: true,
      minWidth: 120,
      render: (_, row) => (
        <Badge label={workflowTypeLabel[row.workflowType]} color={workflowTypeColor[row.workflowType]} size="sm" />
      ),
    },
    {
      key: 'totalEntities',
      label: 'Total Entities',
      sortable: true,
      minWidth: 110,
      render: (_, row) => row.entities.length,
    },
    {
      key: 'creditLimit',
      label: 'Credit Limit',
      sortable: true,
      minWidth: 120,
      render: (_, row) =>
        row.billingConfig.creditLimit
          ? `₹${row.billingConfig.creditLimit.toLocaleString('en-IN')}`
          : '—',
    },
    {
      key: 'advanceRule',
      label: 'Advance Rule',
      minWidth: 130,
      render: (_, row) => deriveAdvanceRuleSummary(row.billingType, row.billingConfig),
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      render: (_, row) => (
        <Badge label={agreementStatusLabel[row.status]} color={agreementStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      minWidth: 120,
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
      width: 56,
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
        ]
        if (row.status === 'draft' || row.status === 'submitted') {
          actions.push({ label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) })
        }
        if (row.status === 'submitted') {
          actions.push({ label: 'Approve', icon: <ShieldCheck size={14} />, onClick: () => onApprove(row) })
          actions.push({
            label: 'Reject',
            icon: <XCircle size={14} />,
            onClick: () => onReject(row),
          })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
