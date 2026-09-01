import { useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack } from '@mui/material'
import { Badge, Drawer, FormField, Input, useToast } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { computeExpenseIwAmount } from '@/pages/admin/finance/expenses/config/expenseDetailFormConfig'
import { getCurrentUser } from '@/shared/services/authService'
import { reconciliationService } from '@/shared/services/reconciliationService'
import type { ReconciliationItem } from '@/shared/types/reconciliation'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getReconciliationStatusBadgeColor,
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'
import { formatReconciliationMoney } from '../utils/reconciliationListingUtils'
import { ReconciliationRejectModal } from './ReconciliationRejectModal'
import {
  RECONCILIATION_DRAWER_WIDTH,
  ReconciliationDrawerFooter,
  ReconciliationMetaItem,
  ReconciliationStatusFootnotes,
  ReconciliationSummaryCard,
} from './reconciliationDrawerLayout'

interface ReconciliationDetailDrawerProps {
  open: boolean
  item: ReconciliationItem | null
  onClose: () => void
  onSubmitted?: () => void
  onRejected?: () => void
}

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function ReconciliationDetailDrawer({
  open,
  item,
  onClose,
  onSubmitted,
  onRejected,
}: ReconciliationDetailDrawerProps) {
  const { showToast } = useToast()
  const [costAmount, setCostAmount] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const currentUserName = useMemo(() => getCurrentUser()?.name?.trim() || 'Accounts user', [])

  useEffect(() => {
    if (!item) {
      setCostAmount('')
      setTotalAmount('')
      setInvoiceNumber('')
      setTrackingNumber('')
      setRejectOpen(false)
      return
    }
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
  const isInsuranceOrTicket = item.tab === 'insurance' || item.tab === 'ticket'
  const isCourier = item.tab === 'courier'
  const userDisplay = isPending ? currentUserName : item.reconciledBy || item.acPersonName || '—'

  const tabBadgeLabel =
    item.tab === 'insurance'
      ? 'Insurance'
      : item.tab === 'ticket'
        ? 'Ticket'
        : item.tab === 'courier'
          ? 'Courier'
          : item.tab

  const handleSubmit = () => {
    setSubmitting(true)
    const result = reconciliationService.submitReference({
      id: item.id,
      referenceNumber: '',
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
      description: isCourier
        ? `AWB and amount saved for ${item.refNo}.`
        : `${item.refNo} has been reconciled.`,
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
      title: 'Reconciliation rejected',
      description: `${item.refNo} was rejected and the expense was updated.`,
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
        title={item.passengerName || item.refNo}
        subtitle={`${item.refNo} · ${item.visaCountry}`}
        headerExtra={
          <>
            <Badge
              label={getReconciliationStatusLabel(item.status)}
              color={getReconciliationStatusBadgeColor(item.status)}
              size="sm"
            />
            <Badge label={tabBadgeLabel} color="neutral" size="sm" />
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
            submitDisabled={isCourier && !trackingNumber.trim()}
          />
        }
      >
        <Stack spacing={2}>
          <ReconciliationSummaryCard title="Record summary">
            <ReconciliationMetaItem label="GLTS reference" value={item.refNo} mono />
            <ReconciliationMetaItem label="Passenger" value={item.passengerName} />
            <ReconciliationMetaItem label="Client" value={item.client} />
            <ReconciliationMetaItem label="Vendor" value={item.vendor} />
            <ReconciliationMetaItem label="Visa country" value={item.visaCountry} />
            {item.tab === 'insurance' ? (
              <ReconciliationMetaItem label="Policy number" value={item.policyNumber} />
            ) : null}
            <ReconciliationMetaItem
              label="Date"
              value={formatDisplayDate(item.bookingDate || item.paymentDate)}
            />
            {!isCourier ? (
              <ReconciliationMetaItem
                label="Amount"
                value={formatReconciliationMoney(item.total || item.amountInr)}
                mono
              />
            ) : null}
            {isCourier ? (
              <ReconciliationMetaItem label="Tracking" value={item.trackingNumber} />
            ) : null}
          </ReconciliationSummaryCard>

          <Divider />

          <AdminOverlayFormSection
            title="Reconciliation inputs"
            importance="primary"
            columns={2}
          >
            {isInsuranceOrTicket ? (
              <>
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
                <FormField label="IW" helperText="Markup (Total − Cost)">
                  <Input value={formatInr(iwAmount)} disabled size="sm" fullWidth />
                </FormField>
                <FormField label="Total" helperText="From agreement / Country Master">
                  <Input
                    value={totalAmount}
                    onChange={setTotalAmount}
                    placeholder="Enter total amount in INR"
                    size="sm"
                    disabled={!isPending}
                    fullWidth
                  />
                </FormField>
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
              </>
            ) : null}
            {isCourier ? (
              <>
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
              </>
            ) : null}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <FormField label="User">
                <Input value={userDisplay} disabled size="sm" fullWidth />
              </FormField>
            </Box>
          </AdminOverlayFormSection>

          <ReconciliationStatusFootnotes
            isSubmitted={isSubmitted}
            isRejected={isRejected}
            reconciledBy={item.reconciledBy}
            reconciledAt={item.reconciledAt}
            rejectionReason={item.rejectionReason}
          />
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
