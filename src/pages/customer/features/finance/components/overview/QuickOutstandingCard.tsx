import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { getInvoiceOutstandingAmount } from '../../utils/financeInvoiceUtils'

interface QuickOutstandingCardProps {
  invoices: Invoice[]
}

export function QuickOutstandingCard({ invoices }: QuickOutstandingCardProps) {
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()

  return (
    <BaseCard sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Quick Access — Outstanding Invoices
        </Typography>
        <Button
          label="View outstanding"
          variant="text"
          size="sm"
          onClick={() => navigate(`${base}/finance/outstanding`)}
        />
      </Stack>
      {invoices.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No outstanding invoices. Your account is up to date.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {invoices.map(inv => (
            <Stack
              key={inv.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                py: 1,
                px: 1.25,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => navigate(`${base}/finance/invoices/${inv.id}`)}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {inv.invoiceId}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Due {inv.dueDate}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700} color="error.main">
                {formatInr(getInvoiceOutstandingAmount(inv))}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </BaseCard>
  )
}