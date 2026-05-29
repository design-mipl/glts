import { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserRound, Mail, ShieldCheck, FileText, Activity, Monitor } from 'lucide-react'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { normalizeBookerId } from '@/pages/customer/data/portalIds'
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
import { BookerFormDrawer } from '../components/BookerFormDrawer'
import { useBookerDetailState } from '../hooks/useBookerDetailState'

export function BookerDetailPage() {
  const colors = usePublicBrandColors()
  const { bookerId } = useParams()
  const navigate = useNavigate()
  const { base, canAccessBookerManagement } = useCustomerPortalBase()
  const { showToast } = useToast()
  const resolvedId = normalizeBookerId(bookerId) ?? bookerId
  const { booker, reload } = useBookerDetailState(resolvedId)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  if (!canAccessBookerManagement) {
    return (
      <CustomerEmptyState
        title="Access restricted"
        description="Only Super Admins and Admins can view booker details."
        actionLabel="Back to dashboard"
        onAction={() => navigate(`${base}/dashboard`)}
      />
    )
  }

  if (!booker) {
    return (
      <CustomerEmptyState
        title="Booker not found"
        description="The selected booker record could not be found."
        actionLabel="Back to booker listing"
        onAction={() => navigate(`${base}/users/bookers`)}
      />
    )
  }

  const handleResendInvite = () => {
    bookerManagementService.resendInvite(booker.id)
    reload()
    showToast({
      title: 'Invite sent',
      description: `Password reset / invite email sent to ${booker.email}.`,
      variant: 'success',
    })
  }

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(`${base}/users/bookers`)}
        sx={{ mb: 2 }}
      >
        Back to booker listing
      </Button>

      <CustomerPageHeader
        eyebrow="Booker management"
        title={booker.fullName}
        subtitle={`${booker.designation || 'Booker'}${booker.location ? ` · ${booker.location}` : ''}`}
        badge={managedUserStatusLabel[booker.status]}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Edit booker</Button>
            <Button variant="outlined" onClick={() => setStatusOpen(true)}>
              {booker.status === 'active' ? 'Inactivate' : 'Activate'}
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
                  { label: 'Full name', value: booker.fullName },
                  { label: 'Designation', value: booker.designation || '--' },
                  { label: 'Department', value: booker.department || '--' },
                  { label: 'Location', value: booker.location || '--' },
                  { label: 'Created by', value: booker.createdBy },
                  {
                    label: 'Status',
                    value: (
                      <CustomerStatusChip
                        label={managedUserStatusLabel[booker.status]}
                        tone={getCustomerStatusTone(managedUserStatusLabel[booker.status])}
                      />
                    ),
                  },
                  { label: 'Last updated', value: formatManagedUserDate(booker.updatedAt) },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Contact details" icon={Mail}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Email ID', value: booker.email },
                  { label: 'Mobile number', value: booker.mobile || '--' },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Access details" icon={ShieldCheck}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Role', value: 'Booker' },
                  { label: 'Applications', value: `${booker.applicationCount} active` },
                  { label: 'Last login', value: booker.lastLogin ?? 'Not available' },
                ]}
              />
            </CustomerCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Login activity" icon={Monitor}>
              {booker.loginActivity.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No login activity recorded.</Typography>
              ) : (
                <CustomerTimeline
                  items={booker.loginActivity.map(entry => ({
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
              {booker.applicationActivity.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No application activity recorded.</Typography>
              ) : (
                <CustomerTimeline
                  items={booker.applicationActivity.map(entry => ({
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
              <Typography sx={{ fontSize: 13, color: booker.notes ? colors.textSecondary : colors.textMuted }}>
                {booker.notes || 'No notes added.'}
              </Typography>
            </CustomerCard>

            <CustomerCard title="Activity log" icon={Activity}>
              {booker.activities.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No activity recorded yet.</Typography>
              ) : (
                <CustomerTimeline
                  items={booker.activities.map(act => ({
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

      <BookerFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={booker}
        onSaved={() => {
          reload()
          showToast({ title: 'Booker updated', variant: 'success' })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={booker.status === 'active' ? 'Inactivate booker?' : 'Activate booker?'}
        description={`${booker.fullName} will be marked as ${booker.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={booker.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={() => {
          setActionLoading(true)
          const next = booker.status === 'active' ? 'inactive' : 'active'
          bookerManagementService.setStatus(booker.id, next)
          showToast({ title: `Booker ${next === 'active' ? 'activated' : 'inactivated'}`, variant: 'success' })
          reload()
          setStatusOpen(false)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete / archive booker?"
        description={`${booker.fullName} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          setActionLoading(true)
          const result = bookerManagementService.remove(booker.id)
          if (result.ok) {
            showToast({ title: 'Booker archived', variant: 'success' })
            navigate(`${base}/users/bookers`)
          } else {
            showToast({ title: 'Cannot delete', description: 'Booker account is in use.', variant: 'warning' })
          }
          setDeleteOpen(false)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />
    </Box>
  )
}
