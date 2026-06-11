import { Box, Stack, Typography } from '@mui/material'
import { ProgressBar } from '@/design-system/UIComponents'
import type { TeamCapacity } from '@/shared/types/operationalCaseHandling'

interface TeamCapacityStripProps {
  teams: TeamCapacity[]
}

export function TeamCapacityStrip({ teams }: TeamCapacityStripProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 1,
      }}
    >
      {teams.map(team => {
        const pct = team.capacity > 0 ? Math.round((team.assigned / team.capacity) * 100) : 0
        const atCapacity = team.assigned >= team.capacity
        return (
          <Box
            key={team.team}
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="caption" fontWeight={600}>
                {team.team}
              </Typography>
              <Typography
                variant="caption"
                color={atCapacity ? 'warning.main' : 'text.secondary'}
                fontWeight={600}
              >
                {team.assigned} / {team.capacity}
              </Typography>
            </Stack>
            <ProgressBar
              value={pct}
              size="sm"
              color={atCapacity ? 'warning' : pct > 80 ? 'info' : 'primary'}
            />
          </Box>
        )
      })}
    </Box>
  )
}
