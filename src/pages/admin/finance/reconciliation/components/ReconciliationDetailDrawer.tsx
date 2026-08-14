import { useEffect, useMemo, useState } from 'react'
import { Divider, Grid, Stack, Typography } from '@mui/material'
import { Badge, Button, Drawer, FormField, Input, useToast } from '@/design-system/UIComponents'
import { getExpensePaymentModeLabel } from '@/pages/admin/finance/expenses/config/expenseDetailFormConfig'
import { ClaimSheetDetailBody } from '@/pages/admin/ground-operations/case-handling/components/ClaimSheetDetailBody'
import { getCurrentUser } from '@/shared/services/authService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import { reconciliationService } from '@/shared/services/reconciliationService'
import type { ReconciliationItem } from '@/shared/types/reconciliation'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import {
  getReconciliationReferenceLabel,
  getReconciliationStatusBadgeColor,
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'
import { formatReconciliationMoney } from '../utils/reconciliationListingUtils'
import { ReconciliationRejectModal } from './ReconciliationRejectModal'

interface ReconciliationDetailDrawerProps {
  open: boolean
  item: ReconciliationItem | null
  onClose: () => void
  onSubmitted?: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function ReconciliationDetailDrawer({
  open,
  item,
  onClose,
  onSubmitted,
}: ReconciliationDetailDrawerProps) {
  const { showToast } = useToast()
  const [referenceNumber, setReferenceNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])
  const referenceLabel = getReconciliationReferenceLabel()

  const claimSheet = useMemo(() => {
    if (!item || item.tab !== 'approved_claim_sheet') return null
    return groundOpsClaimSheetService.getById(item.sourceId) ?? null
  }, [item])

  useEffect(() => {
    if (!item) {
      setReferenceNumber('')
      setRejectOpen(false)
      return
    }
    setReferenceNumber(item.status === 'submitted' ? item.referenceNumber || '' : '')
    setRejectOpen(false)
  }, [item])

  if (!item) return null

  const isPending = item.status === 'pending'
  const isSubmitted = item.status === 'submitted'
  const isRejected = item.status === 'rejected'
  const isClaimSheet = item.tab === 'approved_claim_sheet'
  const userDisplay = isPending
    ? currentUserName
    : item.reconciledBy || item.acPersonName || '—'

  const handleSubmit = () => {
    setSubmitting(true)
    const result = reconciliationService.submitReference({
      id: item.id,
      referenceNumber,
    })
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
      description: `${referenceLabel} saved for ${item.claimNumber || item.refNo}.`,
      variant: 'success',
    })
    onSubmitted?.()
    onClose()
  }

  const handleReject = (reason: string) => {
    setRejecting(true)
    const result = reconciliationService.reject({ id: item.id, reason })
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
      title: isClaimSheet ? 'Claim sheet rejected' : 'Reconciliation rejected',
      description: isClaimSheet
        ? `${item.claimNumber || item.refNo} is rejected. Ground Operations can revise and resubmit.`
        : `${item.refNo} was rejected and the expense was updated.`,
      variant: 'warning',
    })
    setRejectOpen(false)
    onSubmitted?.()
    onClose()
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title="Reconcile record"
        subtitle={item.claimNumber || item.refNo}
        width={isClaimSheet ? 640 : 480}
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
            <Button label="Close" variant="neutral" onClick={onClose} />
            {isPending ? (
              <>
                <Button
                  label="Reject"
                  variant="contained"
                  color="error"
                  onClick={() => setRejectOpen(true)}
                  disabled={submitting || rejecting}
                />
                <Button
                  label="Submit"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || rejecting || !referenceNumber.trim()}
                />
              </>
            ) : null}
          </Stack>
        }
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Badge
              label={getReconciliationStatusLabel(item.status)}
              color={getReconciliationStatusBadgeColor(item.status)}
              size="sm"
            />
            {item.claimNumber ? <Badge label={item.claimNumber} color="neutral" size="sm" /> : null}
          </Stack>

          {isClaimSheet && claimSheet ? (
            <>
              <ClaimSheetDetailBody
                sheet={claimSheet}
                onDownloadPdf={() => {
                  showToast({
                    title: 'Download started',
                    description: groundOpsClaimSheetService.getPdfDownloadLabel(claimSheet),
                    variant: 'success',
                  })
                }}
                onDownloadProofs={() => {
                  showToast({
                    title: 'Download started',
                    description: groundOpsClaimSheetService.getProofsDownloadLabel(claimSheet),
                    variant: 'success',
                  })
                }}
              />
              <Divider />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="User" value={userDisplay} />
                </Grid>
                {item.passengerName && item.passengerName !== '—' ? (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Selected case passenger" value={item.passengerName} />
                  </Grid>
                ) : null}
              </Grid>
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field label="Passenger" value={item.passengerName} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field label="Client" value={item.client} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field label="Vendor" value={item.vendor} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field label="Visa country" value={item.visaCountry} />
              </Grid>
              {item.tab === 'mode_of_payment' ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Charges name" value={item.chargesName} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field
                      label="Mode of payment"
                      value={getExpensePaymentModeLabel(item.paymentMode)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Card used" value={item.cardUsed} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Staff" value={item.staffName} />
                  </Grid>
                </>
              ) : null}
              {item.tab === 'insurance' ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Policy number" value={item.policyNumber} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Vendor invoice" value={item.vendorInvoiceNumber} />
                  </Grid>
                </>
              ) : null}
              {item.tab === 'courier' ? (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Tracking no (AWB)" value={item.trackingNumber} />
                </Grid>
              ) : null}
              {(item.tab === 'ticket' || item.tab === 'courier') &&
              (item.locationFrom || item.locationTo) ? (
                <Grid size={{ xs: 12 }}>
                  <Field
                    label="Route"
                    value={`${item.locationFrom || '—'} → ${item.locationTo || '—'}`}
                  />
                </Grid>
              ) : null}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field
                  label="Date"
                  value={formatDisplayDate(item.bookingDate || item.paymentDate)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field
                  label="Amount"
                  value={formatReconciliationMoney(
                    item.total || item.amountInr || item.claimGrandTotal,
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field label="User" value={userDisplay} />
              </Grid>
            </Grid>
          )}

          {isPending || isSubmitted ? (
            <FormField label={referenceLabel} required={isPending}>
              <Input
                value={referenceNumber}
                onChange={setReferenceNumber}
                placeholder={`Enter ${referenceLabel.toLowerCase()}`}
                size="sm"
                disabled={!isPending}
                fullWidth
              />
            </FormField>
          ) : null}

          {isSubmitted ? (
            <Typography variant="caption" color="text.secondary">
              Submitted by {item.reconciledBy || '—'} on {formatDisplayDate(item.reconciledAt)}
            </Typography>
          ) : null}

          {isRejected ? (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                Rejected by {item.reconciledBy || '—'} on {formatDisplayDate(item.reconciledAt)}
              </Typography>
              {item.rejectionReason ? (
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  Reason: {item.rejectionReason}
                </Typography>
              ) : null}
            </Stack>
          ) : null}
        </Stack>
      </Drawer>

      <ReconciliationRejectModal
        open={rejectOpen}
        item={item}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        loading={rejecting}
      />
    </>
  )
}
