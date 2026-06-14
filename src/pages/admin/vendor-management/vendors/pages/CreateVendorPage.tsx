import { VendorFormPage } from './VendorFormPage'

export function CreateVendorPage() {
  return (
    <VendorFormPage
      mode="create"
      cancelHref="/admin/vendor-management/vendors"
      breadcrumbs={[
        { label: 'Vendor Management', href: '/admin/vendor-management/vendors' },
        { label: 'Vendors', href: '/admin/vendor-management/vendors' },
        { label: 'Add vendor' },
      ]}
    />
  )
}
