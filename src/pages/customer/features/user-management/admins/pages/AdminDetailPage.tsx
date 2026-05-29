import { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserRound, Mail, ShieldCheck, FileText, Activity, Monitor } from 'lucide-react'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { adminManagementService } from '@/shared/services/adminManagementService'
import { normalizeAdminId } from '@/pages/customer/data/portalIds'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  CustomerCard,
  CustomerEmptyState,
  CustomerInfoGrid,
  CustomerPageHeader,
  CustomerStatusChip,
  CustomerTimeline,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  formatManagedUserDate,
  managedUserStatusLabel,
} from '../../shared/utils/managedUserFormatters'
import { AdminFormDrawer } from '../components/AdminFormDrawer'
import { useAdminDetailState } from '../hooks/useAdminDetailState'

export function AdminDetailPage() {
  const colors = usePublicBrandColors()
  const { adminId } = useParams()
  const navigate = useNavigate()
  const { base, canAccessAdminManagement } = useCustomerPortalBase()
  const { showToast } = useToast()
  const resolvedId = normalizeAdminId(adminId) ?? adminId
  const { admin, reload } = useAdminDetailState(resolvedId)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  if (!canAccessAdminManagement) {
    return (
      <CustomerEmptyState
        title="Access restricted"
        description="Only Super Admins can view admin details."
        actionLabel="Back to dashboard"
        onAction={() => navigate(`${base}/dashboard`)}
      />
    )
  }

  if (!admin) {
    return (
      <CustomerEmptyState
        title="Admin not found"
        description="The selected admin record could not be found."
        actionLabel="Back to admin listing"
        onAction={() => navigate(`${base}/users/admins`)}
      />
    )
  }

  const handleResendInvite = () => {
    adminManagementService.resendInvite(admin.id)
    reload()
    showToast({
      title: 'Invite sent',
      description: `Password reset / invite email sent to ${admin.email}.`,
      variant: 'success',
    })
  }

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(`${base}/users/admins`)}
        sx={{ mb: 2 }}
      >
        Back to admin listing
      </Button>

      <CustomerPageHeader
        eyebrow="Admin management"
        title={admin.fullName}
        subtitle={`${admin.designation || 'Admin'}${admin.location ? ` · ${admin.location}` : ''}`}
        badge={managedUserStatusLabel[admin.status]}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Edit admin</Button>
            <Button variant="outlined" onClick={() => setStatusOpen(true)}>
              {admin.status === 'active' ? 'Inactivate' : 'Activate'}
            </Button>
            <Button variant="outlined" onClick={handleResendInvite}>
              Reset password / Resend invite
            </Button>
            <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)}>
              Delete / archive
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Basic details" icon={UserRound}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Full name', value: admin.fullName },
                  { label: 'Designation', value: admin.designation || '--' },
                  { label: 'Department', value: admin.department || '--' },
                  { label: 'Location', value: admin.location || '--' },
                  {
                    label: 'Status',
                    value: (
                      <CustomerStatusChip
                        label={managedUserStatusLabel[admin.status]}
                        tone={getCustomerStatusTone(managedUserStatusLabel[admin.status])}
                      />
                    ),
                  },
                  { label: 'Last updated', value: formatManagedUserDate(admin.updatedAt) },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Contact details" icon={Mail}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Email ID', value: admin.email },
                  { label: 'Mobile number', value: admin.mobile || '--' },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Access details" icon={ShieldCheck}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Role', value: 'Admin' },
                  { label: 'Last login', value: admin.lastLogin ?? 'Not available' },
                ]}
              />
            </CustomerCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Login activity" icon={Monitor}>
              {admin.loginActivity.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No login activity recorded.</Typography>
              ) : (
                <CustomerTimeline
                  items={admin.loginActivity.map(entry => ({
                    id: entry.id,
                    title: entry.device,
                    description: `${entry.location} · ${entry.status}`,
                    status: entry.status === 'success' ? 'completed' : 'pending',
                    timestamp: formatManagedUserDate(entry.timestamp),
                  }))}
                />
              )}
            </CustomerCard>

            <CustomerCard title="Application activity" icon={FileText}>
              {admin.applicationActivity.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No application activity recorded.</Typography>
              ) : (
                <CustomerTimeline
                  items={admin.applicationActivity.map(entry => ({
                    id: entry.id,
                    title: entry.title,
                    description: `${entry.applicationId} · ${entry.action}`,
                    status: 'completed' as const,
                    timestamp: formatManagedUserDate(entry.timestamp),
                  }))}
                />
              )}
            </CustomerCard>

            <CustomerCard title="Notes / remarks" icon={FileText}>
              <Typography sx={{ fontSize: 13, color: admin.notes ? colors.textSecondary : colors.textMuted }}>
                {admin.notes || 'No notes added.'}
              </Typography>
            </CustomerCard>

            <CustomerCard title="Activity log" icon={Activity}>
              {admin.activities.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No activity recorded yet.</Typography>
              ) : (
                <CustomerTimeline
                  items={admin.activities.map(act => ({
                    id: act.id,
                    title: act.action,
                    description: act.detail,
                    status: 'completed' as const,
                    timestamp: formatManagedUserDate(act.timestamp),
                  }))}
                />
              )}
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>

      <AdminFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={admin}
        onSaved={() => {
          reload()
          showToast({ title: 'Admin updated', variant: 'success' })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={admin.status === 'active' ? 'Inactivate admin?' : 'Activate admin?'}
        description={`${admin.fullName} will be marked as ${admin.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={admin.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={() => {
          setActionLoading(true)
          const next = admin.status === 'active' ? 'inactive' : 'active'
          adminManagementService.setStatus(admin.id, next)
          showToast({ title: `Admin ${next === 'active' ? 'activated' : 'inactivated'}`, variant: 'success' })
          reload()
          setStatusOpen(false)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete / archive admin?"
        description={`${admin.fullName} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          setActionLoading(true)
          const result = adminManagementService.remove(admin.id)
          if (result.ok) {
            showToast({ title: 'Admin archived', variant: 'success' })
            navigate(`${base}/users/admins`)
          } else {
            showToast({ title: 'Cannot delete', description: 'Admin account is in use.', variant: 'warning' })
          }
          setDeleteOpen(false)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />
    </Box>
  )
}
