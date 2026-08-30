import { ProfileAccountWorkspace } from '../components/ProfileAccountWorkspace'
import { RetailProfileWorkspace } from '../components/RetailProfileWorkspace'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'

export function ProfileDetailsPage() {
  const { isBusiness } = useCustomerPortalBase()
  if (isBusiness) return <ProfileAccountWorkspace />
  return <RetailProfileWorkspace />
}
