import { Box, Typography, IconButton } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Input } from '@/design-system/components'
import type { InvoiceLineItem } from '../types'

export interface BillingLineItemsProps {
  items: InvoiceLineItem[]
  onChange: (items: InvoiceLineItem[]) => void
  readOnly?: boolean
}

function recalcTotal(item: InvoiceLineItem): InvoiceLineItem {
  return { ...item, total: item.quantity * item.unitPrice }
}

export default function BillingLineItems({ items, onChange, readOnly = false }: BillingLineItemsProps) {
  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    onChange(
      items.map((item) =>
        item.id === id ? recalcTotal({ ...item, ...patch }) : item,
      ),
    )
  }

  const addItem = () => {
    onChange([
      ...items,
      recalcTotal({
        id: `line-${Date.now()}`,
        model: '',
        product: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      }),
    ])
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  if (readOnly) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 80px 100px' },
              gap: 2,
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2">{item.model || '—'}</Typography>
            <Typography variant="body2">{item.product || '—'}</Typography>
            <Typography variant="body2" align="right">
              {item.quantity}
            </Typography>
            <Typography variant="body2" align="right">
              {item.total.toLocaleString('en-IN')}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 80px 100px 40px' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <Input
            label="Model"
            value={item.model}
            onChange={(value) => updateItem(item.id, { model: value })}
            size="sm"
          />
          <Input
            label="Product"
            value={item.product}
            onChange={(value) => updateItem(item.id, { product: value })}
            size="sm"
          />
          <Input
            label="Qty"
            type="number"
            value={String(item.quantity)}
            onChange={(value) => updateItem(item.id, { quantity: Number(value) || 0 })}
            size="sm"
          />
          <Input
            label="Unit price"
            type="number"
            value={String(item.unitPrice)}
            onChange={(value) => updateItem(item.id, { unitPrice: Number(value) || 0 })}
            size="sm"
          />
          <IconButton
            size="small"
            onClick={() => removeItem(item.id)}
            sx={{ mt: { xs: 0, sm: 3 }, color: 'error.main' }}
            aria-label="Remove line item"
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" color="secondary" size="sm" onClick={addItem} startIcon={<Plus size={16} />}>
        Add line item
      </Button>
    </Box>
  )
}
