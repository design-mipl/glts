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
    <>
      <FormField label="Account holder">
        <Input
          size="sm"
          value={data.bank.accountHolderName}
          onChange={v => patchBank({ accountHolderName: v })}
          placeholder="Account holder name"
          fullWidth
        />
      </FormField>
      <FormField label="Bank name">
        <Input
          size="sm"
          value={data.bank.bankName}
          onChange={v => patchBank({ bankName: v })}
          placeholder="Bank name"
          fullWidth
        />
      </FormField>
      <FormField label="Account number">
        <Input
          size="sm"
          value={data.bank.accountNumber}
          onChange={v => patchBank({ accountNumber: v })}
          placeholder="Account number"
          fullWidth
        />
      </FormField>
      <FormField label="IFSC">
        <Input
          size="sm"
          value={data.bank.ifscCode}
          onChange={v => patchBank({ ifscCode: v })}
          placeholder="IFSC / SWIFT"
          fullWidth
        />
      </FormField>
      <FormField label="Branch">
        <Input
          size="sm"
          value={data.bank.branchName}
          onChange={v => patchBank({ branchName: v })}
          placeholder="Branch name"
          fullWidth
        />
      </FormField>
    </>
  )
}
