import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { teamService } from '@/shared/services/teamService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { billingTypeLabel, workflowTypeLabel } from '../../agreements/config/agreementStatusConfig'
import { corporatePortalStatusLabel } from '../config/corporateAccountStatusConfig'

interface CorporateAccountReviewPanelProps {
  data: CorporateAccountFormData
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.35}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function CorporateAccountReviewPanel({ data }: CorporateAccountReviewPanelProps) {
  const theme = useTheme()
  const agreement = data.agreementId ? commercialAgreementService.getById(data.agreementId) : undefined
  const assignedTeamName = data.assignedTeamId ? teamService.getById(data.assignedTeamId)?.name ?? '—' : '—'
  const assignedUserNames = data.assignedUserIds
    .map((id) => adminPortalUserService.getById(id))
    .filter((user): user is NonNullable<typeof user> => Boolean(user))
  const assignedUsersValue =
    assignedUserNames.length > 0
      ? `${assignedUserNames.length} · ${assignedUserNames.map((u) => `${u.fullName} (${u.email})`).join(', ')}`
      : '—'
  const teamLeaderTeamName = data.teamLeaderTeamId ? teamService.getById(data.teamLeaderTeamId)?.name ?? '—' : '—'
  const teamLeaderNames = data.teamLeaderUserIds
    .map((id) => adminPortalUserService.getById(id))
    .filter((user): user is NonNullable<typeof user> => Boolean(user))
  const teamLeadersValue =
    teamLeaderNames.length > 0
      ? `${teamLeaderNames.length} · ${teamLeaderNames.map((u) => `${u.fullName} (${u.email})`).join(', ')}`
      : '—'
  const primaryContact = data.primaryContactUserId
    ? adminPortalUserService.getById(data.primaryContactUserId)
    : undefined
  const secondaryContact = data.secondaryContactUserId
    ? adminPortalUserService.getById(data.secondaryContactUserId)
    : undefined
  const primaryContactsValue = primaryContact
    ? `${primaryContact.fullName} (${primaryContact.email})`
    : '—'
  const secondaryContactsValue = secondaryContact
    ? `${secondaryContact.fullName} (${secondaryContact.email})`
    : '—'
  const counts = {
    totalAdmins: data.admins.length + (data.superAdmin.fullName ? 1 : 0),
    totalEntities: data.entityIds.filter((id) => entityMasterService.getById(id)).length,
    totalVessels: data.vesselIds.filter((id) => vesselMasterService.getById(id)).length,
    totalBookers: data.bookerIds.filter((id) => bookerManagementService.getById(id)).length,
  }
  const statCards = [
    { label: 'Admins', value: String(counts.totalAdmins) },
    { label: 'Entities', value: String(counts.totalEntities) },
    { label: 'Vessels', value: String(counts.totalVessels) },
    { label: 'Bookers', value: String(counts.totalBookers) },
  ]

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : alpha('#fff', 0.04),
        p: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
        Review before activation
      </Typography>
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
            gap: 1,
          }}
        >
          {statCards.map((item) => (
            <Box
              key={item.label}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.5,
                px: 1.25,
                py: 1,
                bgcolor: theme.palette.mode === 'light' ? '#fff' : alpha('#fff', 0.02),
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {item.label}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 0.25, fontWeight: 700 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.5, py: 1.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Account summary
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              columnGap: 2,
              rowGap: 1.25,
            }}
          >
            <ReviewRow label="Company" value={data.companyName} />
            <ReviewRow label="Branch" value={data.branch} />
            <ReviewRow label="Workflow" value={workflowTypeLabel[data.workflowType as keyof typeof workflowTypeLabel] ?? data.workflowType} />
            <ReviewRow label="Account type" value={data.accountType} />
            <ReviewRow label="Super admin" value={data.superAdmin.fullName} />
            <ReviewRow label="Super admin email" value={data.superAdmin.emailAddress} />
            <ReviewRow label="Portal status" value={corporatePortalStatusLabel[data.portalActivation.portalStatus]} />
            <ReviewRow label="Billing" value={agreement ? billingTypeLabel[agreement.billingType] : '—'} />
          </Box>
        </Box>

        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.5, py: 1.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Team leader
          </Typography>
          <Stack spacing={0.9}>
            <ReviewRow label="Team" value={teamLeaderTeamName} />
            <ReviewRow label="Team leaders" value={teamLeadersValue} />
          </Stack>
        </Box>

        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.5, py: 1.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Assigned users
          </Typography>
          <Stack spacing={0.9}>
            <ReviewRow label="Team" value={assignedTeamName} />
            <ReviewRow label="Users" value={assignedUsersValue} />
            <ReviewRow label="Primary contact" value={primaryContactsValue} />
            <ReviewRow label="Secondary contact" value={secondaryContactsValue} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
