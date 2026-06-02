import { Collapse, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { InvoiceLineItem, InvoiceTaxConfig } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface InvoicePreviewPanelProps {
  invoiceId?: string
  companyName: string
  billingEntity: string
  vesselName?: string
  lineItems: InvoiceLineItem[]
  taxConfig: InvoiceTaxConfig
  subtotal: number
  gstTotal: number
  tdsAmount: number
  finalAmount: number
  paymentTerms: string
  dueDate: string
}

export function InvoicePreviewPanel(props: InvoicePreviewPanelProps) {
  const [open, setOpen] = useState(true)
  const {
    invoiceId,
    companyName,
    billingEntity,
    vesselName,
    lineItems,
    subtotal,
    gstTotal,
    tdsAmount,
    finalAmount,
    paymentTerms,
    dueDate,
  } = props

  return (
    <BaseCard sx={{ p: 2, mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight={700}>
          Invoice preview
        </Typography>
        <Button label={open ? 'Hide' : 'Show'} variant="text" size="sm" onClick={() => setOpen(v => !v)} />
      </Stack>
      <Collapse in={open}>
        <Stack spacing={1.5}>
          {invoiceId ? (
            <Typography variant="caption" color="text.secondary">
              {invoiceId}
            </Typography>
          ) : null}
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight={600}>
              {companyName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Billing entity: {billingEntity}
            </Typography>
            {vesselName ? (
              <Typography variant="caption" color="text.secondary">
                Vessel: {vesselName}
              </Typography>
            ) : null}
          </Stack>
          <Stack spacing={0.75}>
            {lineItems.slice(0, 5).map(li => (
              <Stack key={li.id} direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary" sx={{ maxWidth: '60%' }}>
                  {li.serviceType || li.description || 'Line item'}
                </Typography>
                <Typography variant="caption">{formatInr(li.amount)}</Typography>
              </Stack>
            ))}
            {lineItems.length > 5 ? (
              <Typography variant="caption" color="text.secondary">
                +{lineItems.length - 5} more line items
              </Typography>
            ) : null}
          </Stack>
          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption">Subtotal</Typography>
              <Typography variant="caption">{formatInr(subtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption">GST</Typography>
              <Typography variant="caption">{formatInr(gstTotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption">TDS</Typography>
              <Typography variant="caption">{formatInr(-tdsAmount)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatInr(finalAmount)}
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {paymentTerms} · Due {dueDate || '—'}
          </Typography>
        </Stack>
      </Collapse>
    </BaseCard>
  )
}
