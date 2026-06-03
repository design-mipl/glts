import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { CustomerInfoGrid } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { PersonalInfoDrawer } from '../PersonalInfoDrawer'
import { ChangePasswordModal } from '../ChangePasswordModal'
import type { PersonalAccount, PersonalProfileData, UserSession } from '../../types/accountWorkspace'

export interface PersonalProfileTabProps {
  data: PersonalProfileData
  onUpdateAccount: (patch: Partial<PersonalAccount>) => void
  onSetSessions: (sessions: UserSession[]) => void
  /** Increment to open edit drawer from workspace header */
  openEditRequestId?: number
}

export function PersonalProfileTab({
  data,
  onUpdateAccount,
  onSetSessions,
  openEditRequestId = 0,
}: PersonalProfileTabProps) {
  const { showToast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [logoutOthersOpen, setLogoutOthersOpen] = useState(false)
  const { account, sessions } = data

  useEffect(() => {
    if (openEditRequestId > 0) setDrawerOpen(true)
  }, [openEditRequestId])

  const handleSavePersonal = (patch: Partial<PersonalAccount>) => {
    onUpdateAccount(patch)
    showToast({ title: 'Profile updated', description: 'Your personal information was saved.', variant: 'success' })
  }

  const handleLogoutOthers = () => {
    onSetSessions(sessions.filter(s => s.isCurrent))
    showToast({ title: 'Other sessions ended', description: 'You remain signed in on this device.', variant: 'success' })
    setLogoutOthersOpen(false)
  }

  return (
    <>
      <CustomerDetailSection title="Personal information">
        <CustomerInfoGrid
          items={[
            { label: 'Name', value: account.name },
            { label: 'Designation', value: account.designation },
            { label: 'Email', value: account.email },
            { label: 'Contact number', value: account.phone },
          ]}
        />
      </CustomerDetailSection>

      <CustomerDetailSection title="Login & password" divider={false}>
        <CustomerInfoGrid
          columns={2}
          items={[
            { label: 'Username', value: account.username },
            { label: 'Last login', value: account.lastLogin },
            { label: 'Active sessions', value: String(sessions.length) },
          ]}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => setPasswordOpen(true)}>
            Change password
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            disabled={sessions.filter(s => !s.isCurrent).length === 0}
            onClick={() => setLogoutOthersOpen(true)}
          >
            Log out other sessions
          </Button>
        </Stack>
      </CustomerDetailSection>

      <PersonalInfoDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        account={account}
        onSave={handleSavePersonal}
      />
      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
      <ConfirmDialog
        open={logoutOthersOpen}
        onClose={() => setLogoutOthersOpen(false)}
        onConfirm={handleLogoutOthers}
        title="Log out other sessions?"
        description="This will sign out all devices except your current session."
        confirmLabel="Log out others"
        variant="destructive"
      />
    </>
  )
}
