import { Grid, Typography } from '@mui/material'
import { FormField, Input } from '@/design-system/UIComponents'
import type { SimpleFeeField } from '../../types/invoiceFeeComposition.types'

interface SimpleFeeFieldsProps {
  title: string
  value: SimpleFeeField
  onChange: (next: SimpleFeeField) => void
}

export function SimpleFeeFields({ title, value, onChange }: SimpleFeeFieldsProps) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {title}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormField label="Amount">
          <Input
            type="number"
            value={value.amount ? String(value.amount) : ''}
            onChange={v => onChange({ ...value, amount: Number(v) || 0 })}
            placeholder="0"
            size="sm"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <FormField label="Notes (optional)">
          <Input
            value={value.notes}
            onChange={v => onChange({ ...value, notes: v })}
            placeholder="Add notes"
            size="sm"
            fullWidth
          />
        </FormField>
      </Grid>
    </Grid>
  )
}
