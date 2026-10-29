import {
  CustomerListingGrid,
  type CustomerListingGridItem,
} from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { AdminListingLoadingState } from './AdminListingLoadingState'

export type AdminListingGridItem = CustomerListingGridItem

interface AdminListingGridProps {
  items: AdminListingGridItem[]
  onItemClick?: (id: string) => void
  loading?: boolean
}

export function AdminListingGrid({ items, onItemClick, loading = false }: AdminListingGridProps) {
  if (loading) return <AdminListingLoadingState />
  return <CustomerListingGrid items={items} onItemClick={onItemClick} />
}
