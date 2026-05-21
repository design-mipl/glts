import { Box, Typography } from '@mui/material'
import { Tag } from '@/design-system/components'
import BaseCard from '@/design-system/UIComponents/Cards/BaseCard'
import type { Invoice } from '../types'
import { INVOICE_STATUS_VARIANT } from '../types'

export interface BillingGridViewProps {
  invoices: Invoice[]
  formatAmount: (amount: number) => string
  onSelect: (invoice: Invoice) => void
}

export default function BillingGridView({
  invoices,
  formatAmount,
  onSelect,
}: BillingGridViewProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {invoices.map((invoice) => (
        <BaseCard
          key={invoice.id}
          hoverable
          onClick={() => onSelect(invoice)}
          sx={{ cursor: 'pointer', p: 2.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {invoice.invoiceNo}
            </Typography>
            <Tag label={invoice.status} variant={INVOICE_STATUS_VARIANT[invoice.status]} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {invoice.client}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {formatAmount(invoice.netReceivable)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Due {invoice.dueDate}
          </Typography>
        </BaseCard>
      ))}
    </Box>
  )
}
