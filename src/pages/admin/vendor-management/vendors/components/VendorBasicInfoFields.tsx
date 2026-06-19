import { Grid } from '@mui/material'
import { FormField, Input, Select, Toggle } from '@/design-system/UIComponents'
import type { VendorFormData } from '@/shared/types/vendor'
import { VENDOR_CATEGORY_OPTIONS } from '../config/vendorCategoryConfig'
import { VENDOR_STATUS_OPTIONS, VENDOR_TYPE_OPTIONS } from '../config/vendorStatusConfig'

interface VendorBasicInfoFieldsProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function VendorBasicInfoFields({ data, onChange }: VendorBasicInfoFieldsProps) {
  const patch = (partial: Partial<VendorFormData>) => onChange({ ...data, ...partial })

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Vendor name" required>
          <Input value={data.vendorName} onChange={(v) => patch({ vendorName: v })} placeholder="Enter vendor name" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Vendor category" required>
          <Select
            value={data.vendorCategory}
            onChange={(v) => patch({ vendorCategory: v as VendorFormData['vendorCategory'] })}
            options={VENDOR_CATEGORY_OPTIONS}
            placeholder="Select category"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Vendor type" required>
          <Select
            value={data.vendorType}
            onChange={(v) => patch({ vendorType: v as VendorFormData['vendorType'] })}
            options={VENDOR_TYPE_OPTIONS}
            placeholder="Select type"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Contact person" required>
          <Input value={data.contactPerson} onChange={(v) => patch({ contactPerson: v })} placeholder="Contact person name" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Mobile number" required>
          <Input value={data.mobileNumber} onChange={(v) => patch({ mobileNumber: v })} placeholder="+91 …" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Email address" required>
          <Input value={data.emailAddress} onChange={(v) => patch({ emailAddress: v })} placeholder="email@company.com" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormField label="Address">
          <Input value={data.address} onChange={(v) => patch({ address: v })} placeholder="Street address" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormField label="City">
          <Input value={data.city} onChange={(v) => patch({ city: v })} placeholder="City" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormField label="State">
          <Input value={data.state} onChange={(v) => patch({ state: v })} placeholder="State" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormField label="Country">
          <Input value={data.country} onChange={(v) => patch({ country: v })} placeholder="Country" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="PAN number">
          <Input value={data.panNumber} onChange={(v) => patch({ panNumber: v })} placeholder="AAAAA9999A" fullWidth />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="GST applicable">
          <Toggle
            checked={data.gstApplicable}
            onChange={(checked) => patch({ gstApplicable: checked, gstNumber: checked ? data.gstNumber : '' })}
            label={data.gstApplicable ? 'Yes' : 'No'}
          />
        </FormField>
      </Grid>
      {data.gstApplicable ? (
        <Grid size={{ xs: 12, md: 6 }}>
          <FormField label="GST number" required>
            <Input value={data.gstNumber} onChange={(v) => patch({ gstNumber: v })} placeholder="27AAAAA9999A1Z5" fullWidth />
          </FormField>
        </Grid>
      ) : null}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField label="Status">
          <Select
            value={data.status}
            onChange={(v) => patch({ status: v as VendorFormData['status'] })}
            options={VENDOR_STATUS_OPTIONS}
            placeholder="Status"
            fullWidth
          />
        </FormField>
      </Grid>
    </Grid>
  )
}
