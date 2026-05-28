import { Box, Divider, Stack, TextField, Typography } from '@mui/material'
import { LogOut, ShieldCheck } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Badge, BaseCard, Button, ConfirmDialog, Modal, Tabs, useToast } from '@/design-system/UIComponents'
import { useAdminSession } from '@/pages/admin/hooks/useAdminSession'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { useAdminProfileWorkspace } from '../hooks/useAdminProfileWorkspace'
import type { AdminProfileTabId } from '../types/adminProfileWorkspace'

const PROFILE_TABS = [
  { value: 'account', label: 'Account information' },
  { value: 'security', label: 'Security & access' },
  { value: 'sessions', label: 'Session management' },
] as const

const VALID_TABS = new Set<AdminProfileTabId>(['account', 'security', 'sessions'])

function parseTab(raw: string | null): AdminProfileTabId {
  if (raw && VALID_TABS.has(raw as AdminProfileTabId)) return raw as AdminProfileTabId
  return 'account'
}

export function AdminProfileWorkspace() {
  const { showToast } = useToast()
  const { signOut } = useAdminSession()
  const { workspace, updateAccount, setSessions } = useAdminProfileWorkspace()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editAccountOpen, setEditAccountOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [logoutOthersOpen, setLogoutOthersOpen] = useState(false)
  const [formName, setFormName] = useState(workspace.account.displayName)

  const tab = parseTab(searchParams.get('tab'))

  const setTab = useCallback(
    (next: string) => {
      setSearchParams({ tab: parseTab(next) }, { replace: true })
    },
    [setSearchParams],
  )

  const headerActions = useMemo(() => {
    if (tab === 'account') {
      return (
        <Button variant="outlined" onClick={() => setEditAccountOpen(true)}>
          Edit profile
        </Button>
      )
    }
    if (tab === 'security') {
      return (
        <Button variant="outlined" startIcon={<ShieldCheck size={16} />} onClick={() => setPasswordModalOpen(true)}>
          Change password
        </Button>
      )
    }
    return (
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogOut size={16} />}
        disabled={workspace.sessions.filter(s => !s.isCurrent).length === 0}
        onClick={() => setLogoutOthersOpen(true)}
      >
        End other sessions
      </Button>
    )
  }, [tab, workspace.sessions])

  const handleSaveName = useCallback(() => {
    updateAccount({ displayName: formName.trim() || workspace.account.displayName })
    setEditAccountOpen(false)
    showToast({ title: 'Profile updated', description: 'Display name has been updated.', variant: 'success' })
  }, [formName, showToast, updateAccount, workspace.account.displayName])

  const handleLogoutOthers = useCallback(() => {
    setSessions(workspace.sessions.filter(s => s.isCurrent))
    setLogoutOthersOpen(false)
    showToast({ title: 'Other sessions ended', description: 'You remain signed in on this device.', variant: 'success' })
  }, [setSessions, showToast, workspace.sessions])

  return (
    <Box>
      <AdminPageHeader
        eyebrow="Account"
        title={workspace.account.displayName}
        description={`${workspace.account.team} · ${workspace.account.role}`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Your profile' }]}
        meta={<Badge label="Operations portal" color="info" />}
        actions={headerActions}
      />

      <BaseCard sx={{ p: 0 }}>
        <Box sx={{ px: 2, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={setTab} variant="underline" size="sm" items={[...PROFILE_TABS]} />
        </Box>

        <Box sx={{ p: 2.5 }}>
          {tab === 'account' && (
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Account information
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="caption" color="text.secondary">
                  Display name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {workspace.account.displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{workspace.account.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">{workspace.account.role}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Portal
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {workspace.account.portal}
                </Typography>
              </Stack>
            </Stack>
          )}

          {tab === 'security' && (
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Security & access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep your credentials updated and use strong passwords to protect internal operations data.
              </Typography>
              <Divider />
              <Stack spacing={1.5}>
                <Typography variant="caption" color="text.secondary">
                  Recovery email
                </Typography>
                <Typography variant="body1">{workspace.security.recoveryEmail}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Password last updated
                </Typography>
                <Typography variant="body1">{workspace.security.passwordLastUpdated}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Two-factor authentication
                </Typography>
                <Typography variant="body1">{workspace.security.twoFactorEnabled ? 'Enabled' : 'Not enabled'}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => setPasswordModalOpen(true)}>
                  Update password
                </Button>
              </Stack>
            </Stack>
          )}

          {tab === 'sessions' && (
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Session management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review active sign-ins and terminate old sessions to keep your account safe.
              </Typography>
              <Stack spacing={1.25}>
                {workspace.sessions.map(item => (
                  <Box
                    key={item.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 1.5,
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item.device}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.location} · {item.lastActive}
                        </Typography>
                      </Box>
                      {item.isCurrent ? <Badge label="Current session" color="success" /> : <Badge label="Active" color="warning" />}
                    </Stack>
                  </Box>
                ))}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" color="error" onClick={() => setLogoutOthersOpen(true)}>
                  Log out other sessions
                </Button>
                <Button variant="outlined" color="error" startIcon={<LogOut size={16} />} onClick={signOut}>
                  Log out current session
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </BaseCard>

      <Modal
        open={editAccountOpen}
        onClose={() => setEditAccountOpen(false)}
        title="Edit profile"
        size="sm"
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
            <Button variant="outlined" color="secondary" onClick={() => setEditAccountOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveName}>
              Save changes
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <TextField size="small" label="Display name" value={formName} onChange={e => setFormName(e.target.value)} />
          <TextField size="small" label="Email" value={workspace.account.email} disabled />
        </Stack>
      </Modal>

      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change password"
        subtitle="Use a strong password and avoid reusing old credentials."
        size="sm"
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
            <Button variant="outlined" color="secondary" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPasswordModalOpen(false)
                showToast({ title: 'Password update requested', variant: 'info' })
              }}
            >
              Update password
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <TextField size="small" type="password" label="Current password" />
          <TextField size="small" type="password" label="New password" />
          <TextField size="small" type="password" label="Confirm new password" />
        </Stack>
      </Modal>

      <ConfirmDialog
        open={logoutOthersOpen}
        onClose={() => setLogoutOthersOpen(false)}
        onConfirm={handleLogoutOthers}
        title="Log out other sessions?"
        description="This will sign out all devices except your current session."
        confirmLabel="Log out others"
        variant="destructive"
      />
    </Box>
  )
}
