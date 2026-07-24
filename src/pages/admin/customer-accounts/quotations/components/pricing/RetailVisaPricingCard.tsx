import { Stack, Typography } from '@mui/material'
import type { RetailVisaPricingItem } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { retailVisaCardTotal } from '@/shared/utils/quotationPricingUtils'
import { PricingCard } from './PricingCard'

interface RetailVisaPricingCardProps {
  item: RetailVisaPricingItem
  onEdit?: () => void
  onDelete?: () => void
  readOnly?: boolean
}

function ServiceRows({
  title,
  rows,
}: {
  title: string
  rows: { name: string; amount: number }[]
}) {
  if (rows.length === 0) return null
  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
        {title}
      </Typography>
      {rows.map((row) => (
        <Stack key={`${title}-${row.name}`} direction="row" justifyContent="space-between" spacing={2}>
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {row.name}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
            {formatInr(row.amount)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export function RetailVisaPricingCard({ item, onEdit, onDelete, readOnly }: RetailVisaPricingCardProps) {
  const total = retailVisaCardTotal(item)
  return (
    <PricingCard
      title={item.country || 'Country'}
      subtitle={[item.visaType, item.jurisdictionName].filter(Boolean).join(' · ')}
      onEdit={onEdit}
      onDelete={onDelete}
      readOnly={readOnly}
      footer={
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            Total
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14 }}>
            {formatInr(total)}
          </Typography>
        </Stack>
      }
    >
      <Stack spacing={1.75}>
        <ServiceRows
          title="GLTS processing fees"
          rows={item.gltsServices.map((s) => ({ name: s.serviceName, amount: s.amount }))}
        />
        <ServiceRows
          title="VFS Services"
          rows={item.vfsServices.map((s) => ({ name: s.serviceName, amount: s.amount }))}
        />
      </Stack>
    </PricingCard>
  )
}
