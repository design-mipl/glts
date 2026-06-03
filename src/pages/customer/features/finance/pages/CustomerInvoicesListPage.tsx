import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Download } from 'lucide-react'
import { Badge, BaseCard, Button, EmptyState, useToast } from '@/design-system/UIComponents'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  invoiceStatusBadgeColor,
  invoiceStatusLabel,
  paymentStatusBadgeColor,
  paymentStatusLabel,
} from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'

export function CustomerInvoicesListPage() {
  const { showToast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    setInvoices(customerPortalService.listCustomerInvoices())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const sorted = useMemo(
    () => [...invoices].sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate)),
    [invoices],
  )

  if (loading) return null

  if (sorted.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No invoices yet"
        description="Submitted invoices from GLTS will appear here once finance shares them with your account."
      />
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Invoices
      </Typography>
      <Typography variant="body2" color="text.secondary">
        View submitted invoices, advance adjustments, and remaining payable amounts.
      </Typography>
      <Stack spacing={1.5}>
        {sorted.map(invoice => (
          <BaseCard key={invoice.id} sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={1.5}
            >
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="body1" fontWeight={700}>
                    {invoice.invoiceId}
                  </Typography>
                  <Badge
                    label={invoiceStatusLabel[invoice.invoiceStatus]}
                    color={invoiceStatusBadgeColor(invoice.invoiceStatus)}
                    size="sm"
                  />
                  <Badge
                    label={paymentStatusLabel[invoice.paymentStatus]}
                    color={paymentStatusBadgeColor(invoice.paymentStatus)}
                    size="sm"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Invoice amount {formatInr(invoice.totals.finalAmount)} · Advance adjusted{' '}
                  {formatInr(invoice.totals.advanceAdjusted)} · Remaining payable{' '}
                  {formatInr(invoice.totals.balancePayable)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Due {invoice.dueDate}
                </Typography>
              </Stack>
              <Box>
                <Button
                  label="Download PDF"
                  variant="outlined"
                  startIcon={<Download size={14} />}
                  onClick={() =>
                    showToast({ title: 'Download started', description: `${invoice.invoiceId}.pdf`, variant: 'success' })
                  }
                />
              </Box>
            </Stack>
          </BaseCard>
        ))}
      </Stack>
    </Stack>
  )
}
