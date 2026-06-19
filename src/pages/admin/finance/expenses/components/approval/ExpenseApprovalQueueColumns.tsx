import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ExpenseApprovalQueueRow } from '@/shared/types/applicationExpenseManagement'
import { approvalStatusLabel } from '@/shared/utils/applicationExpenseManagementUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { expenseProofStatusColor, expenseProofStatusLabel } from '../../config/expenseStatusConfig'
import { EXPENSE_LISTING_BASE_PATH } from '../../config/expenseListingTabs'

export type ExpenseQueueAction = 'approve' | 'reject' | 'request_clarification' | 'view_application'

export interface ExpenseApprovalQueueHandlers {
  onAction: (action: ExpenseQueueAction, row: ExpenseApprovalQueueRow) => void
}

export function buildExpenseApprovalQueueColumns(
  handlers: ExpenseApprovalQueueHandlers,
): Column<ExpenseApprovalQueueRow>[] {
  return [
    {
      key: 'applicationId',
      label: 'Application ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
    },
    {
      key: 'companyName',
      label: 'Company Name',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
    },
    {
      key: 'expenseName',
      label: 'Expense Name',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: true,
    },
    {
      key: 'vendorStaffPartner',
      label: 'Vendor / Staff',
      widthSize: adminListingColumnWidthSize('vendor'),
    },
    {
      key: 'passengerMappingLabel',
      label: 'Passenger Mapping',
      widthSize: adminListingColumnWidthSize('assignee'),
    },
    {
      key: 'amount',
      label: 'Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_: unknown, row) => formatInr(row.amount),
    },
    {
      key: 'proofStatus',
      label: 'Proof Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_: unknown, row) => (
        <Badge
          label={expenseProofStatusLabel[row.proofStatus]}
          color={expenseProofStatusColor[row.proofStatus]}
          size="sm"
        />
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      widthSize: adminListingColumnWidthSize('assignee'),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
    },
    {
      key: 'approvalStatus',
      label: 'Approval Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_: unknown, row) => (
        <Badge label={approvalStatusLabel(row.approvalStatus)} color="warning" size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      render: (_: unknown, row) => (
        <RowActions
          row={row}
          actions={[
            { label: 'Approve', onClick: () => handlers.onAction('approve', row) },
            { label: 'Reject', onClick: () => handlers.onAction('reject', row) },
            { label: 'Request Clarification', onClick: () => handlers.onAction('request_clarification', row) },
            {
              label: 'View Application Detail',
              onClick: () => handlers.onAction('view_application', row),
            },
          ]}
        />
      ),
    },
  ]
}

export function getApprovalQueueCellValue(row: ExpenseApprovalQueueRow, key: string): string {
  switch (key) {
    case 'applicationId':
      return row.applicationId
    case 'companyName':
      return row.companyName
    case 'expenseName':
      return row.expenseName
    case 'vendorStaffPartner':
      return row.vendorStaffPartner
    case 'passengerMappingLabel':
      return row.passengerMappingLabel
    case 'amount':
      return formatInr(row.amount)
    case 'proofStatus':
      return row.proofStatus
    case 'createdBy':
      return row.createdBy
    case 'createdDate':
      return row.createdDate
    case 'approvalStatus':
      return row.approvalStatus
    default:
      return ''
  }
}

export function matchesApprovalQueueSearch(row: ExpenseApprovalQueueRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [row.applicationId, row.companyName, row.expenseName, row.vendorStaffPartner]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function queueDetailPath(applicationId: string) {
  return `${EXPENSE_LISTING_BASE_PATH}/${applicationId}`
}
