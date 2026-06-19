import { useCallback } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { Download } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, EmptyState, useToast } from '@/design-system/UIComponents'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { CustomerDetailWorkspace } from '@/pages/customer/features/shared/components/detail/CustomerDetailWorkspace'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail/CustomerDetailSection'
import { FinanceStatusBadges } from '../components/shared/FinanceStatusBadges'
import { getCustomerInvoiceTypeLabel } from '../utils/customerInvoiceTypeLabels'
import { resolveCustomerBillingInfo } from '../utils/financeBillingResolver'
import { getInvoicePaidAmount, getInvoiceOutstandingAmount } from '../utils/financeInvoiceUtils'
import { InvoiceLinkedApplicationsTable } from '../components/invoices/InvoiceLinkedApplicationsTable'
import { InvoiceDocumentsSection } from '../components/invoices/InvoiceDocumentsSection'

export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()

  const invoice = invoiceId ? customerFinanceService.getSessionInvoice(invoiceId) : undefined

  const handleNavigateApplication = useCallback(
    (applicationId: string) => navigate(`${base}/applications/${applicationId}`),
    [base, navigate],
  )

  if (!invoice) {
    return (
      <EmptyState
        variant="no-data"
        title="Invoice not found"
        description="This invoice may not exist or you may not have access to view it."
        action={{ label: 'Back to invoices', onClick: () => navigate(`${base}/finance/invoices`) }}
      />
    )
  }

  const billing = resolveCustomerBillingInfo(invoice.companyName)
  const paid = getInvoicePaidAmount(invoice)
  const outstanding = getInvoiceOutstandingAmount(invoice)

  return (
    <CustomerDetailWorkspace
      breadcrumbs={[
        { label: 'Invoice Management', href: `${base}/finance/invoices` },
        { label: invoice.invoiceId },
      ]}
      header={{
        title: invoice.invoiceId,
        subtitle: getCustomerInvoiceTypeLabel(invoice),
        meta: (
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Typography variant="body2" color="text.secondary">
              Invoice date: {invoice.invoiceDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due date: {invoice.dueDate}
            </Typography>
            <FinanceStatusBadges invoice={invoice} />
          </Stack>
        ),
        actions: (
          <Button
            label="Download invoice"
            variant="outlined"
            startIcon={<Download size={14} />}
            onClick={() =>
              showToast({ title: 'Download started', description: `${invoice.invoiceId}.pdf`, variant: 'success' })
            }
          />
        ),
      }}
    >
      <CustomerDetailSection title="Billing Information">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Company Name
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {billing.companyName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Billing Contact
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {billing.billingContact}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {billing.billingEmail}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              GST Number
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {billing.gstNumber}
            </Typography>
          </Grid>
        </Grid>
      </CustomerDetailSection>

      <CustomerDetailSection title="Linked Billing Items">
        <InvoiceLinkedApplicationsTable
          invoice={invoice}
          onNavigateApplication={handleNavigateApplication}
        />
      </CustomerDetailSection>

      <CustomerDetailSection title="Financial Summary">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Invoice Amount
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {formatInr(invoice.totals.finalAmount)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Paid Amount
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {formatInr(paid)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Outstanding Amount
            </Typography>
            <Typography variant="h6" fontWeight={700} color={outstanding > 0 ? 'error.main' : 'text.primary'}>
              {formatInr(outstanding)}
            </Typography>
          </Grid>
        </Grid>
      </CustomerDetailSection>

      <CustomerDetailSection title="Documents" divider={false}>
        <InvoiceDocumentsSection invoice={invoice} />
      </CustomerDetailSection>
    </CustomerDetailWorkspace>
  )
}
