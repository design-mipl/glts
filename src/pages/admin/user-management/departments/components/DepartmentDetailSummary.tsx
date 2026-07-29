import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Pencil, Power, PowerOff } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { departmentService } from '@/shared/services/departmentService'
import type { DepartmentMaster } from '@/shared/types/departmentMaster'

interface DepartmentDetailSummaryProps {
  department: DepartmentMaster
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

export function DepartmentDetailSummary({
  department,
  onEdit,
  onToggleStatus,
}: DepartmentDetailSummaryProps) {
  const memberCount = useMemo(() => departmentService.countUsers(department.id), [department.id])
  const isActive = department.status === 'active'

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {department.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {memberCount} member{memberCount === 1 ? '' : 's'} · Updated{' '}
                {formatMasterDate(department.updatedAt)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Button
                label="Edit department"
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
            label={masterStatusLabel[department.status]}
            color={masterStatusColor[department.status]}
          />
        </Stack>
      </Box>
    </BaseCard>
  )
}

export function DepartmentInformationSection({ department }: { department: DepartmentMaster }) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Department name" value={department.name} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ReadOnlyField label="Status" value={masterStatusLabel[department.status]} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ReadOnlyField label="Description" value={department.description || '—'} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField
          label="Created by"
          value={`${department.createdBy} · ${formatMasterDate(department.createdAt)}`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ReadOnlyField
          label="Updated by"
          value={`${department.updatedBy} · ${formatMasterDate(department.updatedAt)}`}
        />
      </Grid>
    </Grid>
  )
}
