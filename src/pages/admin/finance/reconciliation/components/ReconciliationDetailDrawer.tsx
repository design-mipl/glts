import { useEffect, useMemo, useState } from 'react'
import { Divider, Grid, Stack, Typography } from '@mui/material'
import { Badge, Button, Drawer, FormField, Input, useToast } from '@/design-system/UIComponents'
import { computeExpenseIwAmount } from '@/pages/admin/finance/expenses/config/expenseDetailFormConfig'
import { ClaimSheetDetailBody } from '@/pages/admin/ground-operations/case-handling/components/ClaimSheetDetailBody'
import { getCurrentUser } from '@/shared/services/authService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import { reconciliationService } from '@/shared/services/reconciliationService'
import type { ReconciliationItem } from '@/shared/types/reconciliation'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getReconciliationReferenceLabel,
  getReconciliationPaymentModeLabel,
  getReconciliationStatusBadgeColor,
  getReconciliationStatusLabel,
  reconciliationRequiresBookEntry,
} from '../config/reconciliationListingConfig'
import { formatReconciliationMoney } from '../utils/reconciliationListingUtils'
import { ReconciliationRejectModal } from './ReconciliationRejectModal'

interface ReconciliationDetailDrawerProps {
  open: boolean
  item: ReconciliationItem | null
  onClose: () => void
  onSubmitted?: () => void
}

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
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
  const [costAmount, setCostAmount] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])
  const referenceLabel = getReconciliationReferenceLabel(item?.tab)
  const requiresBookEntry = reconciliationRequiresBookEntry(item?.tab)

  const claimSheet = useMemo(() => {
    if (!item || item.tab !== 'approved_claim_sheet') return null
    return groundOpsClaimSheetService.getById(item.sourceId) ?? null
  }, [item])

  useEffect(() => {
    if (!item) {
      setReferenceNumber('')
      setCostAmount('')
      setTotalAmount('')
      setInvoiceNumber('')
      setTrackingNumber('')
      setRejectOpen(false)
      return
    }
    setReferenceNumber(item.status === 'submitted' ? item.referenceNumber || '' : '')
    setCostAmount(item.cost > 0 ? String(item.cost) : '')
    setTotalAmount(item.total > 0 ? String(item.total) : '')
    setInvoiceNumber(item.vendorInvoiceNumber || '')
    setTrackingNumber(item.trackingNumber || '')
    setRejectOpen(false)
  }, [item])

  const iwAmount = useMemo(
    () => computeExpenseIwAmount(parseAmount(costAmount), parseAmount(totalAmount)),
    [costAmount, totalAmount],
  )

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
      cost: parseAmount(costAmount),
      total: parseAmount(totalAmount),
      vendorInvoiceNumber: invoiceNumber.trim(),
      trackingNumber: trackingNumber.trim(),
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
      description:
        item.tab === 'courier'
          ? `AWB and amount saved for ${item.claimNumber || item.refNo}.`
          : `${referenceLabel} saved for ${item.claimNumber || item.refNo}.`,
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
                  disabled={
                    submitting ||
                    rejecting ||
                    (requiresBookEntry && !referenceNumber.trim()) ||
                    (item.tab === 'courier' && !trackingNumber.trim())
                  }
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
                    <Field label="Service" value={item.chargesName} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field
                      label="Mode of payment"
                      value={getReconciliationPaymentModeLabel(item.paymentMode)}
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
              {item.tab === 'insurance' || item.tab === 'ticket' ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField label="Cost" helperText="Vendor / actual outlay">
                      <Input
                        value={costAmount}
                        onChange={setCostAmount}
                        placeholder="Enter cost in INR"
                        size="sm"
                        disabled={!isPending}
                        fullWidth
                      />
                    </FormField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField label="IW" helperText="Markup (Total − Cost)">
                      <Input value={formatInr(iwAmount)} disabled size="sm" fullWidth />
                    </FormField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField
                      label="Total"
                      helperText="From agreement / Country Master — can be updated"
                    >
                      <Input
                        value={totalAmount}
                        onChange={setTotalAmount}
                        placeholder="Enter total amount in INR"
                        size="sm"
                        disabled={!isPending}
                        fullWidth
                      />
                    </FormField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField label="Invoice No.">
                      <Input
                        value={invoiceNumber}
                        onChange={setInvoiceNumber}
                        placeholder="Enter invoice number"
                        size="sm"
                        disabled={!isPending}
                        fullWidth
                      />
                    </FormField>
                  </Grid>
                </>
              ) : null}
              {item.tab === 'insurance' ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field label="Policy number" value={item.policyNumber} />
                  </Grid>
                </>
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
              {item.tab !== 'insurance' && item.tab !== 'ticket' && item.tab !== 'courier' ? (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    label="Amount"
                    value={formatReconciliationMoney(
                      item.total || item.amountInr || item.claimGrandTotal,
                    )}
                  />
                </Grid>
              ) : null}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field label="User" value={userDisplay} />
              </Grid>
            </Grid>
          )}

          {item.tab === 'courier' && (isPending || isSubmitted) ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="AWB Number" required={isPending}>
                  <Input
                    value={trackingNumber}
                    onChange={setTrackingNumber}
                    placeholder="Enter AWB number"
                    size="sm"
                    disabled={!isPending}
                    fullWidth
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="Amount" helperText="Courier charge in INR">
                  <Input
                    value={totalAmount}
                    onChange={setTotalAmount}
                    placeholder="Enter amount in INR"
                    size="sm"
                    disabled={!isPending}
                    fullWidth
                  />
                </FormField>
              </Grid>
            </Grid>
          ) : null}

          {(isPending || isSubmitted) && requiresBookEntry ? (
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
