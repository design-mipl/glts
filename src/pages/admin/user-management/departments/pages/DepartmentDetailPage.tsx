import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { departmentService } from '@/shared/services/departmentService'
import {
  DepartmentDetailSummary,
  DepartmentInformationSection,
} from '../components/DepartmentDetailSummary'
import { DepartmentFormDrawer } from '../components/DepartmentFormDrawer'
import { DepartmentMembersTable } from '../components/DepartmentMembersTable'

export function DepartmentDetailPage() {
  const { departmentId } = useParams<{ departmentId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const department = useMemo(() => {
    void refreshKey
    return departmentId ? departmentService.getById(departmentId) : undefined
  }, [departmentId, refreshKey])

  const reload = useCallback(() => setRefreshKey((k) => k + 1), [])

  const handleConfirmStatus = () => {
    if (!department) return
    setActionLoading(true)
    const nextStatus = department.status === 'active' ? 'inactive' : 'active'
    departmentService.setStatus(department.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Department activated' : 'Department deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    reload()
  }

  if (!departmentId || !department) {
    return (
      <EmptyState
        variant="no-data"
        title="Department not found"
        action={{
          label: 'Back to departments',
          onClick: () => navigate('/admin/user-management/departments'),
        }}
      />
    )
  }

  const currentDepartment = department

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'User management', href: '/admin/user-management/departments' },
          { label: 'Department', href: '/admin/user-management/departments' },
          { label: currentDepartment.name },
        ]}
        summary={
          <DepartmentDetailSummary
            department={currentDepartment}
            onEdit={() => setFormOpen(true)}
            onToggleStatus={() => setStatusOpen(true)}
          />
        }
      >
        <Stack spacing={2}>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Department overview
              </Typography>
              <DepartmentInformationSection department={currentDepartment} />
            </Stack>
          </BaseCard>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Members
              </Typography>
              <Box>
                <DepartmentMembersTable departmentId={currentDepartment.id} />
              </Box>
            </Stack>
          </BaseCard>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated by {currentDepartment.updatedBy}. Changes are tracked in department
                membership and status history.
              </Typography>
            </Stack>
          </BaseCard>
        </Stack>
      </AdminDetailShell>

      <DepartmentFormDrawer
        open={formOpen}
        record={currentDepartment}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={
          currentDepartment.status === 'active' ? 'Deactivate department?' : 'Activate department?'
        }
        description={`Set "${currentDepartment.name}" to ${currentDepartment.status === 'active' ? 'inactive' : 'active'}?`}
        confirmLabel={currentDepartment.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </>
  )
}
