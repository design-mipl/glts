import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Badge, Drawer, FormField, Input, useToast } from '@/design-system/UIComponents'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { getCurrentUser } from '@/shared/services/authService'
import { reconciliationService } from '@/shared/services/reconciliationService'
import type { ReconciliationPaymentEntryRow } from '@/shared/types/reconciliation'
import { formatVfsGstLabel } from '@/shared/utils/countryVfsServiceRateUtils'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getReconciliationPaymentModeLabel,
  getReconciliationStatusBadgeColor,
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'
import { ReconciliationPaymentEntryRejectModal } from './ReconciliationPaymentEntryRejectModal'
import {
  RECONCILIATION_DRAWER_WIDTH,
  ReconciliationDrawerFooter,
  ReconciliationMetaItem,
  ReconciliationSectionHeading,
  ReconciliationStatusFootnotes,
  ReconciliationSummaryCard,
} from './reconciliationDrawerLayout'

interface ReconciliationPaymentEntryDetailDrawerProps {
  open: boolean
  row: ReconciliationPaymentEntryRow | null
  onClose: () => void
  onSubmitted?: () => void
  onRejected?: () => void
}

const paymentServicesTableTotalRowCellSx = {
  fontSize: 13,
  fontWeight: 600,
  borderBottom: 0,
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'action.hover',
  pt: 1.25,
  pb: 1.25,
} as const

export function ReconciliationPaymentEntryDetailDrawer({
  open,
  row,
  onClose,
  onSubmitted,
  onRejected,
}: ReconciliationPaymentEntryDetailDrawerProps) {
  const { showToast } = useToast()
  const [bookEntryNumber, setBookEntryNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejecting, setRejecting] = useState(false)

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

  if (!row) return null

  const isPending = row.status === 'pending'
  const isSubmitted = row.status === 'submitted'
  const isRejected = row.status === 'rejected'
  const userDisplay = isPending ? currentUserName : row.reconciledBy || '—'
  const servicesTotal = row.services.reduce((sum, line) => sum + line.amount, 0)

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
    const result = reconciliationService.submitPaymentEntry({ id: row.id, referenceNumber })
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
      description: `Payment for ${row.passengerName} has been reconciled.`,
      variant: 'success',
    })
    onSubmitted?.()
    onClose()
  }

  const handleReject = (reason: string) => {
    setRejecting(true)
    const result = reconciliationService.rejectPaymentEntry({ id: row.id, reason })
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
      title: 'Payment entry rejected',
      description: `${row.passengerName} payment is rejected for reconciliation review.`,
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
        title={row.passengerName}
        subtitle={`${row.refNo} · ${getReconciliationPaymentModeLabel(row.paymentMode)}`}
        headerExtra={
          <>
            <Badge
              label={getReconciliationStatusLabel(row.status)}
              color={getReconciliationStatusBadgeColor(row.status)}
              size="sm"
            />
            <Badge
              label={getReconciliationPaymentModeLabel(row.paymentMode)}
              color="neutral"
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
          <ReconciliationSummaryCard title="Payment summary">
            <ReconciliationMetaItem label="GLTS reference" value={row.refNo} mono />
            <ReconciliationMetaItem label="Client" value={row.client} />
            <ReconciliationMetaItem label="Visa country" value={row.visaCountry} />
            <ReconciliationMetaItem
              label="Mode of payment"
              value={getReconciliationPaymentModeLabel(row.paymentMode)}
            />
            <ReconciliationMetaItem
              label="Payment date"
              value={formatDisplayDate(row.paymentDate)}
            />
            <ReconciliationMetaItem
              label="Payment reference"
              value={row.paymentReferenceNumber}
            />
            <ReconciliationMetaItem label="Amount" value={formatInr(row.amountInr)} mono />
            <ReconciliationMetaItem label="Paid by" value={row.staffName} />
          </ReconciliationSummaryCard>

          <Stack spacing={0.75}>
            <ReconciliationSectionHeading>
              {`Services in this payment (${row.serviceCount})`}
            </ReconciliationSectionHeading>
            <Box sx={agreementEmbeddedTableSx}>
              {row.services.length === 0 ? (
                <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    No services linked to this payment entry.
                  </Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service name</TableCell>
                      <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
                      <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                        Rate
                      </TableCell>
                      <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.services.map(line => (
                      <TableRow key={line.id} hover>
                        <TableCell sx={{ fontSize: 13 }}>{line.serviceName}</TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{line.vendorName || '—'}</TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}
                        >
                          {formatInr(line.amount)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 13 }}>
                          <Badge
                            label={formatVfsGstLabel(line.gstIncluded ?? false)}
                            color={line.gstIncluded ? 'success' : 'neutral'}
                            size="sm"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell sx={paymentServicesTableTotalRowCellSx} colSpan={2}>
                        Payment total
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          ...paymentServicesTableTotalRowCellSx,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatInr(servicesTotal)}
                      </TableCell>
                      <TableCell sx={paymentServicesTableTotalRowCellSx} />
                    </TableRow>
                  </TableFooter>
                </Table>
              )}
            </Box>
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

      <ReconciliationPaymentEntryRejectModal
        open={rejectOpen}
        row={row}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        loading={rejecting}
      />
    </>
  )
}
