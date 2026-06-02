import { Box, Grid, Typography } from '@mui/material'
import { masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  )
}

export function UserBasicInfoSection({ user }: { user: AdminPortalUser }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Full name" value={user.fullName} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Email" value={user.email} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Phone" value={user.phone || '—'} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Employee ID" value={user.employeeId || '—'} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Designation" value={user.designation} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Status" value={masterStatusLabel[user.status]} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField
          label="Created by"
          value={`${user.createdBy} · ${formatMasterDate(user.createdAt)}`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField
          label="Updated by"
          value={`${user.updatedBy} · ${formatMasterDate(user.updatedAt)}`}
        />
      </Grid>
    </Grid>
  )
}

export function UserTeamInfoSection({ user }: { user: AdminPortalUser }) {
  const team = teamService.getById(user.teamId)
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField label="Team" value={team?.name ?? '—'} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField label="Team description" value={team?.description || '—'} />
      </Grid>
    </Grid>
  )
}
