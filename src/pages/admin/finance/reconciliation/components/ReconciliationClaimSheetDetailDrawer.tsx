import { useEffect, useMemo, useState } from 'react'
import { Divider, Stack } from '@mui/material'
import { Badge, Drawer, FormField, Input, useToast } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { ClaimSheetDetailBody } from '@/pages/admin/ground-operations/case-handling/components/ClaimSheetDetailBody'
import { getCurrentUser } from '@/shared/services/authService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import { reconciliationService } from '@/shared/services/reconciliationService'
import type { ReconciliationClaimSheetRow } from '@/shared/types/reconciliation'
import {
  CLAIM_SHEET_STATUS_LABEL,
  getClaimSheetFundTransferLabel,
  getClaimSheetStatusBadgeColor,
  isClaimSheetBankTransferKpis,
} from '@/shared/types/groundOpsClaimSheet'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  formatSettlementAmountLabel,
} from '@/shared/utils/fundSettlementDisplay'
import {
  getReconciliationStatusBadgeColor,
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'
import { ReconciliationClaimSheetRejectModal } from './ReconciliationClaimSheetRejectModal'
import {
  RECONCILIATION_DRAWER_WIDTH,
  ReconciliationDrawerFooter,
  ReconciliationMetaItem,
  ReconciliationSectionHeading,
  ReconciliationStatusFootnotes,
  ReconciliationSummaryCard,
} from './reconciliationDrawerLayout'

interface ReconciliationClaimSheetDetailDrawerProps {
  open: boolean
  row: ReconciliationClaimSheetRow | null
  onClose: () => void
  onSubmitted?: () => void
  onRejected?: () => void
}

export function ReconciliationClaimSheetDetailDrawer({
  open,
  row,
  onClose,
  onSubmitted,
  onRejected,
}: ReconciliationClaimSheetDetailDrawerProps) {
  const { showToast } = useToast()
  const [bookEntryNumber, setBookEntryNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const sheet = row?.sheet ?? null
  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])

  useEffect(() => {
    if (!row) {
      setBookEntryNumber('')
      setRejectOpen(false)
      return
    }
    setBookEntryNumber(row.referenceNumber || '')
    setRejectOpen(false)
  }, [row])

  if (!row || !sheet) return null

  const isPending = row.status === 'pending'
  const isSubmitted = row.status === 'submitted'
  const isRejected = row.status === 'rejected'
  const userDisplay = isPending ? currentUserName : row.reconciledBy || '—'
  const settlementConvention = isClaimSheetBankTransferKpis(sheet.fundTransferType)
    ? 'closing_cash'
    : 'expense_vs_allocated'

  const handleSubmit = () => {
    const referenceNumber = bookEntryNumber.trim()
    if (!referenceNumber) {
      showToast({
        title: 'Book entry required',
        description: 'Enter the book entry number before submitting.',
        variant: 'error',
      })
      return
    }

    setSubmitting(true)
    const result = reconciliationService.submitClaimSheetReference({ id: row.id, referenceNumber })
    setSubmitting(false)

    if (!result.ok) {
      showToast({
        title: 'Could not submit',
        description: result.error,
        variant: 'error',
      })
      return
    }

    showToast({
      title: 'Reconciliation submitted',
      description: `${sheet.claimNumber} has been reconciled.`,
      variant: 'success',
    })
    onSubmitted?.()
    onClose()
  }

  const handleReject = (reason: string) => {
    setRejecting(true)
    const result = reconciliationService.rejectClaimSheet({ id: row.id, reason })
    setRejecting(false)

    if (!result.ok) {
      showToast({
        title: 'Could not reject',
        description: result.error,
        variant: 'error',
      })
      return
    }

    showToast({
      title: 'Claim sheet rejected',
      description: `${sheet.claimNumber} is rejected. Ground Operations can revise and resubmit.`,
      variant: 'warning',
    })
    setRejectOpen(false)
    onRejected?.()
    onClose()
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={sheet.claimNumber}
        subtitle={`${sheet.generatedBy} · ${sheet.team || '—'}`}
        headerExtra={
          <>
            <Badge
              label={getReconciliationStatusLabel(row.status)}
              color={getReconciliationStatusBadgeColor(row.status)}
              size="sm"
            />
            <Badge
              label={CLAIM_SHEET_STATUS_LABEL[sheet.status]}
              color={getClaimSheetStatusBadgeColor(sheet.status)}
              size="sm"
            />
          </>
        }
        width={RECONCILIATION_DRAWER_WIDTH}
        bodyVariant="paper"
        footer={
          <ReconciliationDrawerFooter
            onClose={onClose}
            isPending={isPending}
            onReject={() => setRejectOpen(true)}
            onSubmit={handleSubmit}
            submitting={submitting}
            rejecting={rejecting}
            submitDisabled={!bookEntryNumber.trim()}
          />
        }
      >
        <Stack spacing={2}>
          <ReconciliationSummaryCard title="Claim sheet summary">
            <ReconciliationMetaItem
              label="Transfer type"
              value={getClaimSheetFundTransferLabel(sheet.fundTransferType)}
            />
            <ReconciliationMetaItem label="Generated by" value={sheet.generatedBy} />
            <ReconciliationMetaItem label="Team" value={sheet.team} />
            <ReconciliationMetaItem label="Cases" value={String(sheet.cases.length)} />
            <ReconciliationMetaItem
              label="Allocated amount"
              value={formatInr(sheet.kpis.allocatedAmount)}
              mono
            />
            <ReconciliationMetaItem
              label="Expenses incurred"
              value={formatInr(sheet.kpis.expensesIncurred)}
              mono
            />
            <ReconciliationMetaItem
              label="Settlement amount"
              value={formatSettlementAmountLabel(sheet.kpis.settlementAmount, settlementConvention)}
              mono
            />
            <ReconciliationMetaItem
              label="Generated at"
              value={formatDisplayDateTime(sheet.generatedAt)}
            />
          </ReconciliationSummaryCard>

          <Stack spacing={1.25}>
            <ReconciliationSectionHeading>Claim sheet detail</ReconciliationSectionHeading>
            <ClaimSheetDetailBody
              sheet={sheet}
              onDownloadPdf={() =>
                showToast({
                  title: 'PDF download started',
                  description: groundOpsClaimSheetService.getPdfDownloadLabel(sheet),
                  variant: 'success',
                })
              }
              onDownloadProofs={() =>
                showToast({
                  title: 'Proofs download started',
                  description: groundOpsClaimSheetService.getProofsDownloadLabel(sheet),
                  variant: 'success',
                })
              }
            />
          </Stack>

          <Divider />

          <AdminOverlayFormSection title="Reconciliation" importance="primary" columns={2}>
            {isPending ? (
              <FormField label="Book entry number" required>
                <Input
                  value={bookEntryNumber}
                  onChange={setBookEntryNumber}
                  placeholder="Enter book entry number"
                  size="sm"
                  fullWidth
                />
              </FormField>
            ) : (
              <FormField label="Book entry number">
                <Input value={row.referenceNumber || '—'} disabled size="sm" fullWidth />
              </FormField>
            )}
            <FormField label="User">
              <Input value={userDisplay} disabled size="sm" fullWidth />
            </FormField>
          </AdminOverlayFormSection>

          <ReconciliationStatusFootnotes
            isSubmitted={isSubmitted}
            isRejected={isRejected}
            reconciledBy={row.reconciledBy}
            reconciledAt={row.reconciledAt}
            rejectionReason={row.rejectionReason}
          />
        </Stack>
      </Drawer>

      <ReconciliationClaimSheetRejectModal
        open={rejectOpen}
        row={row}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        loading={rejecting}
      />
    </>
  )
}
