import { useParams } from 'react-router-dom'
import { VendorFormPage } from './VendorFormPage'

export function EditVendorPage() {
  const { vendorId } = useParams<{ vendorId: string }>()

  return (
    <VendorFormPage
      mode="edit"
      vendorId={vendorId}
      cancelHref={`/admin/masters/vendors/${vendorId}`}
      breadcrumbs={[
        { label: 'Vendor Master', href: '/admin/masters/vendors' },
        { label: 'Edit vendor' },
      ]}
    />
  )
}
