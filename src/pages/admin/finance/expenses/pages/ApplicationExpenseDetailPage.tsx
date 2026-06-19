import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import type {
  ApplicationExpenseDetailView,
  ApplicationExpenseProofDocumentType,
  ApplicationExpenseRecord,
} from '@/shared/types/applicationExpenseManagement'
import { ApplicationExpenseSummary } from '../components/detail/ApplicationExpenseSummary'
import type { ExpenseItemAction } from '../components/detail/ExpenseItemsTable'
import { ExpensePassengerWorkspace } from '../components/detail/ExpensePassengerWorkspace'
import { AddExpenseDrawer } from '../components/workspace/AddExpenseDrawer'
import { ExpenseDetailDrawer } from '../components/workspace/ExpenseDetailDrawer'
import { UploadProofModal } from '../components/workspace/UploadProofModal'
import { EXPENSE_LISTING_BASE_PATH } from '../config/expenseListingTabs'
import { useExpenseDetailTravelers } from '../hooks/useExpenseDetailTravelers'

interface ApplicationExpenseDetailContentProps {
  applicationId: string
  detail: ApplicationExpenseDetailView
  onAddExpense: () => void
  onExpenseAction: (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => void
}

function ApplicationExpenseDetailContent({
  applicationId,
  detail,
  onAddExpense,
  onExpenseAction,
}: ApplicationExpenseDetailContentProps) {
  const travelerWorkspace = useExpenseDetailTravelers(applicationId, detail)

  return (
    <ExpensePassengerWorkspace
      applicationId={applicationId}
      applicationDetail={travelerWorkspace.applicationDetail}
      rows={travelerWorkspace.selectableRows}
      overview={travelerWorkspace.overview}
      summaryOverview={travelerWorkspace.summaryOverview}
      singleListing={travelerWorkspace.singleListing}
      selectedTravelerId={travelerWorkspace.selectedTravelerId}
      onSelectTraveler={travelerWorkspace.setSelectedTravelerId}
      selectedRow={travelerWorkspace.selectedRow}
      expenseByPassengerId={travelerWorkspace.expenseByPassengerId}
      rankByPassengerId={travelerWorkspace.rankByPassengerId}
      allExpenses={detail.expenses}
      onAddExpense={onAddExpense}
      onExpenseAction={onExpenseAction}
    />
  )
}

export function ApplicationExpenseDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<ApplicationExpenseDetailView>()
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ApplicationExpenseRecord | null>(null)
  const [viewTarget, setViewTarget] = useState<ApplicationExpenseRecord | null>(null)
  const [proofTarget, setProofTarget] = useState<ApplicationExpenseRecord | null>(null)
  const [proofFileName, setProofFileName] = useState('')
  const [proofDocumentType, setProofDocumentType] = useState<ApplicationExpenseProofDocumentType | ''>('')
  const [deleteTarget, setDeleteTarget] = useState<ApplicationExpenseRecord | null>(null)

  const reload = useCallback(() => {
    if (!applicationId) return
    applicationExpenseManagementService.syncApplication(applicationId)
    setDetail(applicationExpenseManagementService.getApplicationDetail(applicationId))
    setLoading(false)
  }, [applicationId])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    const state = location.state as { openAddExpense?: boolean } | null
    if (state?.openAddExpense) {
      setAddOpen(true)
    }
  }, [location.state])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!detail || !applicationId) {
    return (
      <EmptyState
        variant="no-data"
        title="Application not found"
        action={{ label: 'Back to expenses', onClick: () => navigate(EXPENSE_LISTING_BASE_PATH) }}
      />
    )
  }

  const handleExpenseAction = (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => {
    switch (action) {
      case 'view':
        setViewTarget(expense)
        break
      case 'edit':
        setEditTarget(expense)
        setAddOpen(true)
        break
      case 'upload_proof':
        setProofTarget(expense)
        setProofFileName(expense.proofFileName ?? '')
        setProofDocumentType(expense.proofDocumentType ?? '')
        break
      case 'delete':
        setDeleteTarget(expense)
        break
      default:
        break
    }
  }

  const handleAddSubmit = (input: Parameters<typeof applicationExpenseManagementService.upsertManualExpense>[1]) => {
    if (editTarget) {
      applicationExpenseManagementService.updateExpense(editTarget.id, input)
      showToast({ title: 'Expense updated', variant: 'success' })
    } else {
      applicationExpenseManagementService.upsertManualExpense(applicationId, input)
      showToast({ title: 'Expense added', variant: 'success' })
    }
    setEditTarget(null)
    reload()
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Finance', href: EXPENSE_LISTING_BASE_PATH },
          { label: 'Expense management', href: EXPENSE_LISTING_BASE_PATH },
          { label: applicationId },
        ]}
        summary={
          <ApplicationExpenseSummary detail={detail} />
        }
      >
        <ApplicationExpenseDetailContent
          applicationId={applicationId}
          detail={detail}
          onAddExpense={() => setAddOpen(true)}
          onExpenseAction={handleExpenseAction}
        />
      </AdminDetailShell>

      <AddExpenseDrawer
        open={addOpen}
        onClose={() => {
          setAddOpen(false)
          setEditTarget(null)
        }}
        passengers={detail.passengers}
        recordType={detail.recordType}
        record={editTarget}
        onSubmit={handleAddSubmit}
      />

      <ExpenseDetailDrawer
        open={Boolean(viewTarget)}
        expense={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      <UploadProofModal
        open={Boolean(proofTarget)}
        expenseName={proofTarget?.expenseName}
        fileName={proofFileName}
        onFileNameChange={setProofFileName}
        documentType={proofDocumentType}
        onDocumentTypeChange={setProofDocumentType}
        onClose={() => setProofTarget(null)}
        onSubmit={() => {
          if (!proofTarget || !proofDocumentType) return
          applicationExpenseManagementService.uploadProof(
            proofTarget.id,
            proofFileName.trim(),
            proofDocumentType,
          )
          showToast({ title: 'Proof saved', variant: 'success' })
          setProofTarget(null)
          reload()
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete expense"
        description={`Delete ${deleteTarget?.expenseName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (!deleteTarget) return
          const result = applicationExpenseManagementService.deleteExpense(deleteTarget.id)
          if (!result.ok) {
            showToast({ title: 'Cannot delete', description: result.error, variant: 'error' })
            return
          }
          showToast({ title: 'Expense deleted', variant: 'success' })
          setDeleteTarget(null)
          reload()
        }}
      />
    </>
  )
}
