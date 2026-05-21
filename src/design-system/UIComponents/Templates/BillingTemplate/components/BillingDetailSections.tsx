import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Tag } from '@/design-system/components'
import type { Invoice, InvoiceLineItem } from '../types'
import { INVOICE_STATUS_VARIANT } from '../types'
import BillingLineItems from './BillingLineItems'

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export interface DetailSectionProps {
  title: string
  children: ReactNode
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>{children}</Box>
    </Box>
  )
}

export interface DetailFieldProps {
  label: string
  value: string
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  )
}

export interface SummaryFieldProps {
  label: string
  value: string
  highlight?: boolean
}

export function SummaryField({ label, value, highlight }: SummaryFieldProps) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        py: 1,
        px: highlight ? 2 : 0,
        borderRadius: highlight ? 1 : 0,
        bgcolor: highlight ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
      }}
    >
      <Typography variant="body2" fontWeight={highlight ? 600 : 400} color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={highlight ? 700 : 500}>
        {value}
      </Typography>
    </Box>
  )
}

export interface BillingDetailSectionsProps {
  invoice: Invoice
  lineItems?: InvoiceLineItem[]
}

const MOCK_LINE_ITEMS: InvoiceLineItem[] = [
  {
    id: '1',
    model: 'Premium',
    product: 'Modular kitchen',
    quantity: 1,
    unitPrice: 35000,
    total: 35000,
  },
  {
    id: '2',
    model: 'Standard',
    product: 'Wardrobe unit',
    quantity: 2,
    unitPrice: 3150,
    total: 6300,
  },
]

export default function BillingDetailSections({
  invoice,
  lineItems = MOCK_LINE_ITEMS,
}: BillingDetailSectionsProps) {
  const subtotal = lineItems.reduce((s, li) => s + li.total, 0)

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
      }}
    >
      <DetailSection title="Invoice details">
        <DetailField label="Invoice no." value={invoice.invoiceNo} />
        <DetailField label="Date" value={invoice.invoiceDate} />
        <DetailField label="Due date" value={invoice.dueDate} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Tag label={invoice.status} variant={INVOICE_STATUS_VARIANT[invoice.status]} />
        </Box>
      </DetailSection>

      <DetailSection title="Customer details">
        <DetailField label="Customer" value={invoice.client} />
        <DetailField label="Project" value={invoice.project} />
        <DetailField label="Amount" value={formatINR(invoice.amount)} />
        <DetailField label="TDS" value={formatINR(invoice.tds)} />
      </DetailSection>

      <Box sx={{ gridColumn: '1 / -1' }}>
        <DetailSection title="Line items">
          <BillingLineItems items={lineItems} onChange={() => {}} readOnly />
        </DetailSection>
      </Box>

      <Box sx={{ gridColumn: '1 / -1' }}>
        <DetailSection title="Summary">
          <SummaryField label="Subtotal" value={formatINR(subtotal)} />
          <SummaryField label="TDS" value={`-${formatINR(invoice.tds)}`} />
          <SummaryField label="Net total" value={formatINR(invoice.netReceivable)} highlight />
        </DetailSection>
      </Box>
    </Box>
  )
}
