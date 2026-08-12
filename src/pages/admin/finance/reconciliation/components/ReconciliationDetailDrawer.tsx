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
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'
import { formatReconciliationMoney } from '../utils/reconciliationListingUtils'

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

  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])
  const referenceLabel = getReconciliationReferenceLabel()

  const claimSheet = useMemo(() => {
    if (!item || item.tab !== 'approved_claim_sheet') return null
    return groundOpsClaimSheetService.getById(item.sourceId) ?? null
  }, [item])

  useEffect(() => {
    if (!item) {
      setReferenceNumber('')
      return
    }
    setReferenceNumber(item.status === 'submitted' ? item.referenceNumber || '' : '')
  }, [item])

  if (!item) return null

  const isSubmitted = item.status === 'submitted'
  const isClaimSheet = item.tab === 'approved_claim_sheet'
  const userDisplay = isSubmitted
    ? item.reconciledBy || item.acPersonName || '—'
    : currentUserName

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

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Reconcile record"
      subtitle={item.claimNumber || item.refNo}
      width={isClaimSheet ? 640 : 480}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Close" variant="neutral" onClick={onClose} />
          {!isSubmitted ? (
            <Button
              label="Submit"
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting || !referenceNumber.trim()}
            />
          ) : null}
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Badge
            label={getReconciliationStatusLabel(item.status)}
            color={isSubmitted ? 'success' : 'warning'}
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
                  <Field label="Mode of payment" value={getExpensePaymentModeLabel(item.paymentMode)} />
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
                <Field label="Route" value={`${item.locationFrom || '—'} → ${item.locationTo || '—'}`} />
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
                value={formatReconciliationMoney(item.total || item.amountInr || item.claimGrandTotal)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Field label="User" value={userDisplay} />
            </Grid>
          </Grid>
        )}

        <FormField label={referenceLabel} required={!isSubmitted}>
          <Input
            value={referenceNumber}
            onChange={setReferenceNumber}
            placeholder={`Enter ${referenceLabel.toLowerCase()}`}
            size="sm"
            disabled={isSubmitted}
            fullWidth
          />
        </FormField>

        {isSubmitted ? (
          <Typography variant="caption" color="text.secondary">
            Submitted by {item.reconciledBy || '—'} on {formatDisplayDate(item.reconciledAt)}
          </Typography>
        ) : null}
      </Stack>
    </Drawer>
  )
}
