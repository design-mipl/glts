import { useMemo, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { Download, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, EmptyState, useToast } from '@/design-system/UIComponents'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { CustomerDetailWorkspace } from '@/pages/customer/features/shared/components/detail/CustomerDetailWorkspace'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail/CustomerDetailSection'
import { getInvoiceOutstandingAmount } from '../utils/financeInvoiceUtils'
import { PaymentProofUploadDrawer } from '../components/payments/PaymentProofUploadDrawer'
import { PaymentTimeline } from '../components/payments/PaymentTimeline'

export function PaymentDetailPage() {
  const { paymentId } = useParams<{ paymentId: string }>()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()
  const [proofOpen, setProofOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const payment = useMemo(
    () => (paymentId ? customerFinanceService.getSessionPayment(paymentId) : undefined),
    [paymentId, refreshKey],
  )

  if (!payment) {
    return (
      <EmptyState
        variant="no-data"
        title="Payment not found"
        description="This payment may not exist or you may not have access to view it."
        action={{ label: 'Back to payments', onClick: () => navigate(`${base}/finance/payments`) }}
      />
    )
  }

  const invoice = payment.invoice
  const outstanding = getInvoiceOutstandingAmount(invoice)

  return (
    <>
      <CustomerDetailWorkspace
        breadcrumbs={[
          { label: 'Payment Management', href: `${base}/finance/payments` },
          { label: payment.receiptNumber },
        ]}
        header={{
          title: payment.receiptNumber,
          subtitle: `Payment against ${payment.invoiceNumber}`,
          meta: (
            <Badge
              label={payment.verificationStatus}
              color={payment.verificationStatus === 'verified' ? 'success' : 'neutral'}
              size="sm"
            />
          ),
          actions: (
            <Stack direction="row" spacing={1}>
              <Button
                label="Upload proof"
                variant="outlined"
                startIcon={<Upload size={14} />}
                onClick={() => setProofOpen(true)}
              />
              <Button
                label="Download receipt"
                variant="contained"
                startIcon={<Download size={14} />}
                onClick={() =>
                  showToast({
                    title: 'Download started',
                    description: `${payment.receiptNumber}.pdf`,
                    variant: 'success',
                  })
                }
              />
            </Stack>
          ),
        }}
      >
        <CustomerDetailSection title="Payment Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Payment ID
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {payment.id}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Payment Date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {payment.paymentDate}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Payment Amount
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatInr(payment.amount)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Payment Mode
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {payment.paymentMode}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Transaction Reference
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {payment.transactionReference}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Verification Status
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                {payment.verificationStatus}
              </Typography>
            </Grid>
          </Grid>
        </CustomerDetailSection>

        <CustomerDetailSection title="Linked Invoice">
          <Stack spacing={1}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="primary.main"
              sx={{ cursor: 'pointer', width: 'fit-content' }}
              onClick={() => navigate(`${base}/finance/invoices/${invoice.id}`)}
            >
              {invoice.invoiceId}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Invoice Amount
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatInr(invoice.totals.finalAmount)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Outstanding Balance
                </Typography>
                <Typography variant="body2" fontWeight={600} color={outstanding > 0 ? 'error.main' : undefined}>
                  {formatInr(outstanding)}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </CustomerDetailSection>

        <CustomerDetailSection title="Receipt">
          <Button
            label={`Download ${payment.receiptNumber}.pdf`}
            variant="outlined"
            startIcon={<Download size={14} />}
            onClick={() =>
              showToast({ title: 'Download started', description: `${payment.receiptNumber}.pdf`, variant: 'success' })
            }
          />
          {payment.payment.proofFileName && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Proof uploaded: {payment.payment.proofFileName}
            </Typography>
          )}
        </CustomerDetailSection>

        {payment.payment.accountsNotes && (
          <CustomerDetailSection title="Remarks">
            <Typography variant="body2" color="text.secondary">
              {payment.payment.accountsNotes}
            </Typography>
          </CustomerDetailSection>
        )}

        <CustomerDetailSection title="Payment Timeline" divider={false}>
          <PaymentTimeline payment={payment} />
        </CustomerDetailSection>
      </CustomerDetailWorkspace>

      <PaymentProofUploadDrawer
        payment={payment}
        open={proofOpen}
        onClose={() => setProofOpen(false)}
        onUploaded={() => setRefreshKey(k => k + 1)}
      />
    </>
  )
}
