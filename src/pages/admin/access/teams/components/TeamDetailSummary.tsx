import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Pencil, Power, PowerOff } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { teamService } from '@/shared/services/teamService'
import type { TeamMaster } from '@/shared/types/teamMaster'

interface TeamDetailSummaryProps {
  team: TeamMaster
  onEdit: () => void
  onToggleStatus: () => void
}

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

export function TeamDetailSummary({ team, onEdit, onToggleStatus }: TeamDetailSummaryProps) {
  const memberCount = useMemo(() => teamService.countUsers(team.id), [team.id])
  const isActive = team.status === 'active'

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {team.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {memberCount} member{memberCount === 1 ? '' : 's'} · Updated {formatMasterDate(team.updatedAt)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Button
                label="Edit team"
                variant="neutral"
                startIcon={<Pencil size={14} />}
                onClick={onEdit}
              />
              <Button
                label={isActive ? 'Deactivate' : 'Activate'}
                variant="outlined"
                color={isActive ? 'error' : 'primary'}
                startIcon={isActive ? <PowerOff size={14} /> : <Power size={14} />}
                onClick={onToggleStatus}
              />
            </Stack>
          </Stack>
          <Badge
            label={masterStatusLabel[team.status]}
            color={masterStatusColor[team.status]}
          />
        </Stack>
      </Box>
    </BaseCard>
  )
}

export function TeamInformationSection({ team }: { team: TeamMaster }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Team name" value={team.name} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Status" value={masterStatusLabel[team.status]} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField label="Description" value={team.description || '—'} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField
          label="Created by"
          value={`${team.createdBy} · ${formatMasterDate(team.createdAt)}`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField
          label="Updated by"
          value={`${team.updatedBy} · ${formatMasterDate(team.updatedAt)}`}
        />
      </Grid>
    </Grid>
  )
}
