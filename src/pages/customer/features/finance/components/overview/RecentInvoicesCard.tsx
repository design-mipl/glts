import { Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { FinanceStatusBadges } from '../shared/FinanceStatusBadges'
import { getCustomerInvoiceTypeLabel } from '../../utils/customerInvoiceTypeLabels'

interface RecentInvoicesCardProps {
  invoices: Invoice[]
}

export function RecentInvoicesCard({ invoices }: RecentInvoicesCardProps) {
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()

  return (
    <BaseCard sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Recent Invoices
        </Typography>
        <Button
          label="View all"
          variant="text"
          size="sm"
          onClick={() => navigate(`${base}/finance/invoices`)}
        />
      </Stack>
      {invoices.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No invoices shared yet.
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {invoices.map(inv => (
            <Stack
              key={inv.id}
              spacing={0.5}
              sx={{
                p: 1.25,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => navigate(`${base}/finance/invoices/${inv.id}`)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="body2" fontWeight={700}>
                  {inv.invoiceId}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatInr(inv.totals.finalAmount)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {getCustomerInvoiceTypeLabel(inv)} · Due {inv.dueDate}
              </Typography>
              <FinanceStatusBadges invoice={inv} />
            </Stack>
          ))}
        </Stack>
      )}
    </BaseCard>
  )
}
