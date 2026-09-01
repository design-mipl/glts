import { useToast } from '@/design-system/UIComponents'
import { loadSession, saveSession } from '@/shared/auth/session'
import { useProfileAccount } from '@/pages/customer/features/profile/hooks/useProfileAccount'
import type { RetailCapturedImage } from '@/pages/website/pages/RetailApplyFlowPage/types'

export function retailInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Shared identity read for the account rail and the profile section. The session wins over
 * the stored account record — a customer who just signed in with a phone number should see
 * that number, not a stale seeded one.
 */
export function useRetailAccountIdentity() {
  const { showToast } = useToast()
  const { workspace, updatePersonalAccount } = useProfileAccount()
  const session = loadSession()
  const account = workspace.personal.account

  const saveProfile = (patch: Partial<typeof account>) => {
    updatePersonalAccount(patch)
    const current = loadSession()
    if (current?.portal === 'retail') {
      saveSession({
        ...current,
        contactName: patch.name ?? current.contactName,
        email: patch.email ?? current.email,
        phone: patch.phone ?? current.phone,
      })
    }
    showToast({ title: 'Profile updated', variant: 'success' })
  }

  const savePhoto = (image: RetailCapturedImage) => {
    updatePersonalAccount({ profilePhotoUrl: image.dataUrl })
    showToast({ title: 'Photo updated', variant: 'success' })
  }

  return {
    account,
    displayName: session?.contactName || account.name,
    displayEmail: session?.email || account.email,
    displayPhone: session?.phone || account.phone,
    photoUrl: account.profilePhotoUrl,
    saveProfile,
    savePhoto,
  }
}
