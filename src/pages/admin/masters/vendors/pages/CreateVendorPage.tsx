import { VendorFormPage } from './VendorFormPage'

export function CreateVendorPage() {
  return (
    <VendorFormPage
      mode="create"
      cancelHref="/admin/masters/vendors"
      breadcrumbs={[
        { label: 'Vendor Master', href: '/admin/masters/vendors' },
        { label: 'Add vendor' },
      ]}
    />
  )
}
