import { useMemo } from 'react'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'
import { listBankNameSelectOptions } from '@/shared/utils/bankMasterOptions'

interface VendorBankFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorBankFields({ data, onChange }: VendorBankFieldsProps) {
  const patchBank = (partial: Partial<VendorFormData['bank']>) =>
    onChange({ ...data, bank: { ...data.bank, ...partial } })

  const bankNameOptions = useMemo(() => {
    const fromMaster = listBankNameSelectOptions()
    const current = data.bank.bankName.trim()
    if (current && !fromMaster.some(option => option.value === current)) {
      return [{ value: current, label: current }, ...fromMaster]
    }
    return fromMaster
  }, [data.bank.bankName])

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
        <Select
          size="sm"
          value={data.bank.bankName}
          onChange={v => patchBank({ bankName: String(v) })}
          options={bankNameOptions}
          placeholder="Select bank from bank master"
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
