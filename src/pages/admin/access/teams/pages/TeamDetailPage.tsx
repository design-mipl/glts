import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { teamService } from '@/shared/services/teamService'
import {
  TeamDetailSummary,
  TeamInformationSection,
} from '../components/TeamDetailSummary'
import { TeamFormDrawer } from '../components/TeamFormDrawer'
import { TeamMembersTable } from '../components/TeamMembersTable'

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const team = useMemo(() => {
    void refreshKey
    return teamId ? teamService.getById(teamId) : undefined
  }, [teamId, refreshKey])

  const reload = useCallback(() => setRefreshKey((k) => k + 1), [])

  const handleConfirmStatus = () => {
    if (!team) return
    setActionLoading(true)
    const nextStatus = team.status === 'active' ? 'inactive' : 'active'
    teamService.setStatus(team.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Team activated' : 'Team deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    reload()
  }

  if (!teamId || !team) {
    return (
      <EmptyState
        variant="no-data"
        title="Team not found"
        action={{ label: 'Back to teams', onClick: () => navigate('/admin/access/teams') }}
      />
    )
  }

  const currentTeam = team

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'User management', href: '/admin/access/teams' },
          { label: 'Team', href: '/admin/access/teams' },
          { label: currentTeam.name },
        ]}
        summary={
          <TeamDetailSummary
            team={currentTeam}
            onEdit={() => setFormOpen(true)}
            onToggleStatus={() => setStatusOpen(true)}
          />
        }
      >
        <Stack spacing={2}>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Team overview
              </Typography>
              <TeamInformationSection team={currentTeam} />
            </Stack>
          </BaseCard>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Members
              </Typography>
              <Box>
                <TeamMembersTable teamId={currentTeam.id} />
              </Box>
            </Stack>
          </BaseCard>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated by {currentTeam.updatedBy}. Changes are tracked in team membership and status history.
              </Typography>
            </Stack>
          </BaseCard>
        </Stack>
      </AdminDetailShell>

      <TeamFormDrawer
        open={formOpen}
        record={currentTeam}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={currentTeam.status === 'active' ? 'Deactivate team?' : 'Activate team?'}
        description={`Set "${currentTeam.name}" to ${currentTeam.status === 'active' ? 'inactive' : 'active'}?`}
        confirmLabel={currentTeam.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </>
  )
}
