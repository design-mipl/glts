import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { KeyRound, Mail, UserCheck, UserX } from 'lucide-react'
import { Badge, RowActions, type RowAction } from '@/design-system/UIComponents'
import { AgreementOnboardingDocumentCards } from '@/pages/admin/customer-accounts/agreements/components/AgreementOnboardingDocumentCards'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { teamService } from '@/shared/services/teamService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { splitAgreementDocuments } from '@/shared/utils/agreementDocumentUtils'
import type { CorporateAccount, CorporateAdminUser } from '@/shared/types/corporateAccount'
import type { BookerUser } from '@/shared/types/bookerUser'
import {
  billingTypeColor,
  billingTypeLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../../../agreements/config/agreementStatusConfig'

function resolveAssignedTeamName(account: CorporateAccount) {
  return account.assignedTeamId ? teamService.getById(account.assignedTeamId)?.name ?? '—' : '—'
}

function resolveTeamLeaderTeamName(account: CorporateAccount) {
  return account.teamLeaderTeamId ? teamService.getById(account.teamLeaderTeamId)?.name ?? '—' : '—'
}

function resolveAssignedUsers(account: CorporateAccount) {
  return (account.assignedUserIds ?? [])
    .map((id) => adminPortalUserService.getById(id))
    .filter((user): user is NonNullable<typeof user> => Boolean(user))
}

function resolveTeamLeaders(account: CorporateAccount) {
  return (account.teamLeaderUserIds ?? [])
    .map((id) => adminPortalUserService.getById(id))
    .filter((user): user is NonNullable<typeof user> => Boolean(user))
}

export function OverviewTab({ account }: { account: CorporateAccount }) {
  const counts = corporateAccountService.getCounts(account)
  const assignedTeamName = resolveAssignedTeamName(account)
  const assignedUsers = resolveAssignedUsers(account)
  const teamLeaderTeamName = resolveTeamLeaderTeamName(account)
  const teamLeaders = resolveTeamLeaders(account)

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Super admin</Typography>
        <Typography variant="body2" fontWeight={600}>{account.superAdmin?.fullName ?? '—'}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Total admins</Typography>
        <Typography variant="body2">{counts.totalAdmins}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Entities / Vessels / Bookers</Typography>
        <Typography variant="body2">{counts.totalEntities} / {counts.totalVessels} / {counts.totalBookers}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Team leader team</Typography>
        <Typography variant="body2" fontWeight={600}>{teamLeaderTeamName}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Team leaders</Typography>
        <Typography variant="body2">
          {teamLeaders.length > 0
            ? `${teamLeaders.length} · ${teamLeaders.map((user) => user.fullName).join(', ')}`
            : '—'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Divider />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Assigned team</Typography>
        <Typography variant="body2" fontWeight={600}>{assignedTeamName}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Assigned users</Typography>
        <Typography variant="body2">
          {assignedUsers.length > 0
            ? `${assignedUsers.length} · ${assignedUsers.map((user) => user.fullName).join(', ')}`
            : '—'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="caption" color="text.secondary">Workflow</Typography>
        <Typography variant="body2" fontWeight={600}>
          {workflowTypeLabel[account.workflowType as keyof typeof workflowTypeLabel] ?? account.workflowType}
        </Typography>
      </Grid>
    </Grid>
  )
}

export function AssignedUsersTab({ account }: { account: CorporateAccount }) {
  const assignedTeamName = resolveAssignedTeamName(account)
  const assignedUsers = resolveAssignedUsers(account)
  const teamLeaderTeamName = resolveTeamLeaderTeamName(account)
  const teamLeaders = resolveTeamLeaders(account)

  return (
    <Stack spacing={2.5} divider={<Divider />}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
          Team leader
        </Typography>
        <Typography variant="caption" color="text.secondary">Team</Typography>
        <Typography variant="body2" fontWeight={600}>{teamLeaderTeamName}</Typography>
        {teamLeaders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No team leaders assigned from User Management.
          </Typography>
        ) : (
          <Stack spacing={1} sx={{ mt: 1 }}>
            {teamLeaders.map((user) => (
              <Stack
                key={user.id}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.25, py: 0.9 }}
              >
                <Typography variant="body2" fontWeight={600}>{user.fullName}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
          Team
        </Typography>
        <Typography variant="caption" color="text.secondary">Team</Typography>
        <Typography variant="body2" fontWeight={600}>{assignedTeamName}</Typography>
        {assignedUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No internal users assigned from User Management.
          </Typography>
        ) : (
          <Stack spacing={1} sx={{ mt: 1 }}>
            {assignedUsers.map((user) => (
              <Stack
                key={user.id}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.25, py: 0.9 }}
              >
                <Typography variant="body2" fontWeight={600}>{user.fullName}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

export function AdminsTab({
  account,
  onSendLogin,
  onChangePassword,
  onSetAccessStatus,
}: {
  account: CorporateAccount
  onSendLogin: (adminId: string) => void
  onChangePassword: (admin: CorporateAdminUser) => void
  onSetAccessStatus: (adminId: string, accessStatus: 'active' | 'inactive') => void
}) {
  const admins = [account.superAdmin, ...account.admins].filter(Boolean) as CorporateAdminUser[]

  const buildActions = (admin: CorporateAdminUser): RowAction[] => {
    const isActive = (admin.accessStatus ?? 'active') === 'active'
    const actions: RowAction[] = [
      {
        label: 'Send login email',
        icon: <Mail size={14} />,
        onClick: () => onSendLogin(admin.id),
        disabled: !isActive,
      },
      {
        label: 'Change password',
        icon: <KeyRound size={14} />,
        onClick: () => onChangePassword(admin),
      },
    ]

    if (isActive) {
      actions.push({
        label: 'Deactivate user',
        icon: <UserX size={14} />,
        variant: 'destructive',
        divider: true,
        onClick: () => onSetAccessStatus(admin.id, 'inactive'),
      })
    } else {
      actions.push({
        label: 'Activate user',
        icon: <UserCheck size={14} />,
        divider: true,
        onClick: () => onSetAccessStatus(admin.id, 'active'),
      })
    }

    return actions
  }

  return (
    <Stack spacing={1.5}>
      {admins.map((admin) => {
        const isActive = (admin.accessStatus ?? 'active') === 'active'
        return (
          <Stack
            key={admin.id}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={1}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              px: 1.25,
              py: 1,
            }}
          >
            <Stack spacing={0.35} sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} useFlexGap flexWrap="wrap">
                <Typography variant="body2" fontWeight={600}>
                  {admin.fullName}
                </Typography>
                <Badge
                  label={isActive ? 'Active' : 'Inactive'}
                  color={isActive ? 'success' : 'neutral'}
                  size="sm"
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {admin.role.replace('_', ' ')} · {admin.emailAddress}
              </Typography>
            </Stack>
            <RowActions row={admin} actions={buildActions(admin)} />
          </Stack>
        )
      })}
    </Stack>
  )
}

export function EntitiesTab({ account }: { account: CorporateAccount }) {
  const entities = account.entityIds.map((id) => entityMasterService.getById(id)).filter(Boolean)
  return (
    <Stack spacing={1}>
      {entities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No entities linked.</Typography>
      ) : (
        entities.map((e) => (
          <Typography key={e!.id} variant="body2">{e!.entityName} · {e!.contactPersonName} · {e!.status}</Typography>
        ))
      )}
    </Stack>
  )
}

export function VesselsTab({ account }: { account: CorporateAccount }) {
  const vessels = account.vesselIds.map((id) => vesselMasterService.getById(id)).filter(Boolean)
  return (
    <Stack spacing={1}>
      {vessels.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No vessels linked.</Typography>
      ) : (
        vessels.map((v) => (
          <Typography key={v!.id} variant="body2">{v!.vesselName} · {v!.vesselType} · {v!.status}</Typography>
        ))
      )}
    </Stack>
  )
}

export function BookersTab({
  account,
  onSendLogin,
  onChangePassword,
  onSetStatus,
}: {
  account: CorporateAccount
  onSendLogin: (bookerId: string) => void
  onChangePassword: (booker: BookerUser) => void
  onSetStatus: (bookerId: string, status: 'active' | 'inactive') => void
}) {
  const bookers = (account.bookerIds ?? [])
    .map((id) => bookerManagementService.getById(id))
    .filter((booker): booker is BookerUser => Boolean(booker))

  const buildActions = (booker: BookerUser): RowAction[] => {
    const isActive = booker.status === 'active'
    const actions: RowAction[] = [
      {
        label: 'Send login email',
        icon: <Mail size={14} />,
        onClick: () => onSendLogin(booker.id),
        disabled: !isActive,
      },
      {
        label: 'Change password',
        icon: <KeyRound size={14} />,
        onClick: () => onChangePassword(booker),
      },
    ]

    if (isActive) {
      actions.push({
        label: 'Deactivate user',
        icon: <UserX size={14} />,
        variant: 'destructive',
        divider: true,
        onClick: () => onSetStatus(booker.id, 'inactive'),
      })
    } else {
      actions.push({
        label: 'Activate user',
        icon: <UserCheck size={14} />,
        divider: true,
        onClick: () => onSetStatus(booker.id, 'active'),
      })
    }

    return actions
  }

  return (
    <Stack spacing={1.5}>
      {bookers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No bookers linked.</Typography>
      ) : (
        bookers.map((booker) => {
          const extras = (booker.additionalEmails ?? []).length
          const emailSummary = extras > 0 ? `${booker.email} (+${extras} more)` : booker.email
          const isActive = booker.status === 'active'

          return (
            <Stack
              key={booker.id}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={1}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.5,
                px: 1.25,
                py: 1,
              }}
            >
              <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} useFlexGap flexWrap="wrap">
                  <Typography variant="body2" fontWeight={600}>
                    {booker.fullName}
                  </Typography>
                  <Badge
                    label={isActive ? 'Active' : 'Inactive'}
                    color={isActive ? 'success' : 'neutral'}
                    size="sm"
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {emailSummary} · {booker.mobile || 'No mobile'}
                </Typography>
              </Stack>
              <RowActions row={booker} actions={buildActions(booker)} />
            </Stack>
          )
        })
      )}
    </Stack>
  )
}

export function BillingTab({ account }: { account: CorporateAccount }) {
  const agreement = commercialAgreementService.getById(account.agreementId)
  if (!agreement) return <Typography variant="body2" color="text.secondary">Agreement not found.</Typography>
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Badge label={workflowTypeLabel[agreement.workflowType]} color={workflowTypeColor[agreement.workflowType]} size="sm" />
        <Badge label={billingTypeLabel[agreement.billingType]} color={billingTypeColor[agreement.billingType]} size="sm" />
      </Stack>
      {agreement.pricingMatrix.map((row) => (
        <Typography key={row.id} variant="body2" color="text.secondary">{row.country} · {row.visaType} · ₹{row.serviceFee.toLocaleString('en-IN')}</Typography>
      ))}
    </Stack>
  )
}

export function DocumentsTab({ account }: { account: CorporateAccount }) {
  const agreement = commercialAgreementService.getById(account.agreementId)
  if (!agreement) {
    return <Typography variant="body2" color="text.secondary">Agreement not found.</Typography>
  }

  const formData = commercialAgreementService.agreementToFormData(agreement)
  const { onboardingDocuments, agreementDocument } = splitAgreementDocuments(formData.documents)
  const noop = () => {}

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="body2" fontWeight={600}>
          Onboarding documents
        </Typography>
        <AgreementOnboardingDocumentCards
          documents={onboardingDocuments}
          data={formData}
          onChange={noop}
          readOnly
        />
      </Stack>
      {agreementDocument ? (
        <>
          <Divider />
          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={600}>
              Agreement document
            </Typography>
            <AgreementOnboardingDocumentCards
              documents={[agreementDocument]}
              data={formData}
              onChange={noop}
              readOnly
            />
          </Stack>
        </>
      ) : null}
    </Stack>
  )
}

export function ActivityTab({ account }: { account: CorporateAccount }) {
  return (
    <Stack spacing={1}>
      {account.activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
      ) : (
        account.activities.map((act) => (
          <Typography key={act.id} variant="body2" color="text.secondary">{act.action} · {act.detail} · {new Date(act.timestamp).toLocaleString()}</Typography>
        ))
      )}
    </Stack>
  )
}
