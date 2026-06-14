import { Grid } from '@mui/material'
import { FormField, Input } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'

interface VendorBankFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorBankFields({ data, onChange }: VendorBankFieldsProps) {
  const patchBank = (partial: Partial<VendorFormData['bank']>) =>
    onChange({ ...data, bank: { ...data.bank, ...partial } })

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Account holder name">
          <Input
            value={data.bank.accountHolderName}
            onChange={(v) => patchBank({ accountHolderName: v })}
            placeholder="Account holder name"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Bank name">
          <Input value={data.bank.bankName} onChange={(v) => patchBank({ bankName: v })} placeholder="Bank name" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Account number">
          <Input
            value={data.bank.accountNumber}
            onChange={(v) => patchBank({ accountNumber: v })}
            placeholder="Account number"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="IFSC code">
          <Input value={data.bank.ifscCode} onChange={(v) => patchBank({ ifscCode: v })} placeholder="IFSC / SWIFT" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Branch name">
          <Input value={data.bank.branchName} onChange={(v) => patchBank({ branchName: v })} placeholder="Branch name" fullWidth />
        </FormField>
      </Grid>
    </Grid>
  )
}
