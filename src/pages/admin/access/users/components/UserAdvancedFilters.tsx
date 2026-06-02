import { Box } from '@mui/material'
import { FormField, Select } from '@/design-system/UIComponents'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUserListFilters } from '@/shared/types/adminPortalUser'

interface UserAdvancedFiltersProps {
  filters: AdminPortalUserListFilters
  onChange: (next: AdminPortalUserListFilters) => void
}

export function UserAdvancedFilters({ filters, onChange }: UserAdvancedFiltersProps) {
  const teamOptions = [
    { value: 'all', label: 'All teams' },
    ...teamService.listActiveOptions(),
  ]

  const designationOptions = [
    { value: 'all', label: 'All designations' },
    ...adminPortalUserService.listDesignations().map((d) => ({ value: d, label: d })),
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 200px))',
        },
        gap: 1.5,
      }}
    >
      <FormField label="Team">
        <Select
          value={filters.teamId ?? 'all'}
          onChange={(v) =>
            onChange({ ...filters, teamId: String(v) as AdminPortalUserListFilters['teamId'] })
          }
          options={teamOptions}
          fullWidth
        />
      </FormField>
      <FormField label="Designation">
        <Select
          value={filters.designation ?? 'all'}
          onChange={(v) =>
            onChange({
              ...filters,
              designation: String(v) as AdminPortalUserListFilters['designation'],
            })
          }
          options={designationOptions}
          fullWidth
        />
      </FormField>
    </Box>
  )
}
