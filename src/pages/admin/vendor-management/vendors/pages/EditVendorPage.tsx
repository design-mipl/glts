import { useParams } from 'react-router-dom'
import { VendorFormPage } from './VendorFormPage'

export function EditVendorPage() {
  const { vendorId } = useParams<{ vendorId: string }>()

  return (
    <VendorFormPage
      mode="edit"
      vendorId={vendorId}
      cancelHref={`/admin/vendor-management/vendors/${vendorId}`}
      breadcrumbs={[
        { label: 'Vendor Management', href: '/admin/vendor-management/vendors' },
        { label: 'Vendors', href: '/admin/vendor-management/vendors' },
        { label: 'Edit vendor' },
      ]}
    />
  )
}
