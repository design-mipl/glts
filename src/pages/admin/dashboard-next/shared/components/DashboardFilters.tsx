import { Grid } from '@mui/material'
import { FormField, Select } from '@/design-system/UIComponents'
import type { DashboardFilterConfig } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'

export interface DashboardFiltersProps {
  filters: DashboardFilterConfig[]
  permission?: boolean
}

export function DashboardFilters({ filters, permission }: DashboardFiltersProps) {
  if (!isDashboardPermissionGranted(permission) || filters.length === 0) {
    return null
  }

  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="flex-end">
      {filters.map((filter) => (
        <Grid key={filter.id} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <FormField label={filter.label} sx={{ minWidth: 0 }}>
            <Select
              fullWidth
              size="sm"
              value={filter.value}
              options={filter.options}
              onChange={(value) => filter.onChange(String(value))}
            />
          </FormField>
        </Grid>
      ))}
    </Grid>
  )
}
