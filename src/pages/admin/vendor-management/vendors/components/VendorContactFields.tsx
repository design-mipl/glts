import { FormField, Input } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'

interface VendorContactFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorContactFields({ data, onChange }: VendorContactFieldsProps) {
  const patch = (partial: Partial<VendorFormData>) => onChange({ ...data, ...partial })

  return (
    <>
      <FormField label="Contact person" required>
        <Input
          size="sm"
          value={data.contactPerson}
          onChange={v => patch({ contactPerson: v })}
          placeholder="Contact person name"
          fullWidth
        />
      </FormField>
      <FormField label="Mobile number" required>
        <Input
          size="sm"
          value={data.mobileNumber}
          onChange={v => patch({ mobileNumber: v })}
          placeholder="+91 …"
          fullWidth
        />
      </FormField>
      <FormField label="Email address" required>
        <Input
          size="sm"
          value={data.emailAddress}
          onChange={v => patch({ emailAddress: v })}
          placeholder="email@company.com"
          fullWidth
        />
      </FormField>
      <FormField label="Address">
        <Input
          size="sm"
          value={data.address}
          onChange={v => patch({ address: v })}
          placeholder="Street address"
          fullWidth
        />
      </FormField>
      <FormField label="City">
        <Input size="sm" value={data.city} onChange={v => patch({ city: v })} placeholder="City" fullWidth />
      </FormField>
      <FormField label="State">
        <Input size="sm" value={data.state} onChange={v => patch({ state: v })} placeholder="State" fullWidth />
      </FormField>
      <FormField label="Country (vendor location)">
        <Input
          size="sm"
          value={data.country}
          onChange={v => patch({ country: v })}
          placeholder="Country"
          fullWidth
        />
      </FormField>
    </>
  )
}
