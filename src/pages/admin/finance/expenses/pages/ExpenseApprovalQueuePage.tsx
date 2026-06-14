import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import type { ExpenseApprovalQueueRow } from '@/shared/types/applicationExpenseManagement'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import {
  buildExpenseApprovalQueueColumns,
  getApprovalQueueCellValue,
  matchesApprovalQueueSearch,
  queueDetailPath,
  type ExpenseQueueAction,
} from '../components/approval/ExpenseApprovalQueueColumns'
import {
  ExpenseApprovalActionModal,
  type ExpenseApprovalModalAction,
} from '../components/workspace/ExpenseApprovalActionModal'
import { EXPENSE_LISTING_BASE_PATH } from '../config/expenseListingTabs'

export function ExpenseApprovalQueuePage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<ExpenseApprovalQueueRow[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [approveTarget, setApproveTarget] = useState<ApplicationExpenseRecord | null>(null)
  const [approvalAction, setApprovalAction] = useState<{
    action: ExpenseApprovalModalAction
    expense: ApplicationExpenseRecord
  } | null>(null)
  const [approvalComment, setApprovalComment] = useState('')

  const loadRows = useCallback(() => {
    applicationExpenseManagementService.syncAllSubmitted()
    setRows(applicationExpenseManagementService.listApprovalQueue())
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows, refreshKey])

  const listing = useCustomerListing({
    rows,
    getCellValue: getApprovalQueueCellValue,
    searchMatch: matchesApprovalQueueSearch,
    initialPageSize: 10,
  })

  const handleQueueAction = useCallback(
    (action: ExpenseQueueAction, row: ExpenseApprovalQueueRow) => {
      if (action === 'view_application') {
        navigate(queueDetailPath(row.applicationId))
        return
      }
      const expense = applicationExpenseManagementService.getExpenseById(row.expenseRecordId)
      if (!expense) {
        showToast({ title: 'Expense not found', variant: 'error' })
        return
      }
      if (action === 'approve') {
        setApproveTarget(expense)
        return
      }
      setApprovalAction({
        action: action === 'reject' ? 'reject' : 'request_clarification',
        expense,
      })
      setApprovalComment('')
    },
    [navigate, showToast],
  )

  const columns = useMemo(
    () => buildExpenseApprovalQueueColumns({ onAction: handleQueueAction }),
    [handleQueueAction],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Expense approval queue"
            description="Review expenses pending approval across submitted applications."
            actions={
              <Button
                label="Back to listing"
                variant="neutral"
                startIcon={<ArrowLeft size={14} />}
                onClick={() => navigate(EXPENSE_LISTING_BASE_PATH)}
              />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search application, company, expense, or vendor…"
          />
        }
        listingContent={
          <AdminListingTable
            columns={columns}
            data={listing.paginatedRows}
            filterSourceData={listing.filterSourceRows}
            rowKey="id"
            state={listing.tableState}
            onStateChange={listing.setTableState}
            columnFilters={listing.columnFilters}
            onColumnFiltersChange={listing.setColumnFilters}
            getCellValue={getApprovalQueueCellValue}
            stickyHeader
            emptyTitle="No expenses pending approval"
            emptyDescription="Expenses sent for approval will appear in this queue."
          />
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={listing.tableState.page}
              pageSize={listing.tableState.pageSize}
              total={listing.filterSourceRows.length}
              onPage={page => listing.setTableState(state => ({ ...state, page }))}
              onPageSize={pageSize =>
                listing.setTableState(state => ({ ...state, pageSize, page: 0 }))
              }
            />
          </Box>
        }
      />

      <ConfirmDialog
        open={Boolean(approveTarget)}
        onClose={() => setApproveTarget(null)}
        title="Approve expense"
        description={`Approve ${approveTarget?.expenseName}? Proof must be uploaded or marked not required.`}
        confirmLabel="Approve"
        onConfirm={() => {
          if (!approveTarget) return
          const result = applicationExpenseManagementService.approve(approveTarget.id)
          if (!result.ok) {
            showToast({ title: 'Cannot approve', description: result.error, variant: 'error' })
            return
          }
          showToast({ title: 'Expense approved', variant: 'success' })
          setApproveTarget(null)
          setRefreshKey(k => k + 1)
        }}
      />

      <ExpenseApprovalActionModal
        open={Boolean(approvalAction)}
        action={approvalAction?.action ?? null}
        expenseName={approvalAction?.expense.expenseName}
        comment={approvalComment}
        onCommentChange={setApprovalComment}
        onClose={() => setApprovalAction(null)}
        onConfirm={() => {
          if (!approvalAction) return
          const result =
            approvalAction.action === 'reject'
              ? applicationExpenseManagementService.reject(approvalAction.expense.id, approvalComment)
              : applicationExpenseManagementService.requestClarification(
                  approvalAction.expense.id,
                  approvalComment,
                )
          if (!result.ok) {
            showToast({ title: 'Action failed', description: result.error, variant: 'error' })
            return
          }
          showToast({
            title: approvalAction.action === 'reject' ? 'Expense rejected' : 'Clarification requested',
            variant: 'info',
          })
          setApprovalAction(null)
          setRefreshKey(k => k + 1)
        }}
      />
    </>
  )
}
