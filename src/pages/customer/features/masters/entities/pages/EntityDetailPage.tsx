import { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, UserRound, FileText, Activity } from 'lucide-react'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { normalizeEntityId } from '@/pages/customer/data/portalIds'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  CustomerCard,
  CustomerEmptyState,
  CustomerInfoGrid,
  CustomerPageHeader,
  CustomerStatusChip,
  CustomerTimeline,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { entityStatusLabel } from '../config/entityStatusConfig'
import { formatEntityDate } from '../utils/entityListingUtils'
import { EntityFormDrawer } from '../components/EntityFormDrawer'
import { useEntityDetailState } from '../hooks/useEntityDetailState'

export function EntityDetailPage() {
  const colors = usePublicBrandColors()
  const { entityId } = useParams()
  const navigate = useNavigate()
  const { base, canAccessMasters } = useCustomerPortalBase()
  const { showToast } = useToast()
  const resolvedId = normalizeEntityId(entityId) ?? entityId
  const { entity, reload } = useEntityDetailState(resolvedId)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  if (!canAccessMasters) {
    return (
      <CustomerEmptyState
        title="Access restricted"
        description="Only Super Admins and Admins can view entity details."
        actionLabel="Back to dashboard"
        onAction={() => navigate(`${base}/dashboard`)}
      />
    )
  }

  if (!entity) {
    return (
      <CustomerEmptyState
        title="Entity not found"
        description="The selected entity record could not be found."
        actionLabel="Back to entities"
        onAction={() => navigate(`${base}/masters/entities`)}
      />
    )
  }

  const handleStatusToggle = () => {
    setActionLoading(true)
    const next = entity.status === 'active' ? 'inactive' : 'active'
    entityMasterService.setStatus(entity.id, next)
    showToast({ title: `Entity ${next === 'active' ? 'activated' : 'inactivated'}`, variant: 'success' })
    reload()
    setStatusOpen(false)
    setActionLoading(false)
  }

  const handleDelete = () => {
    setActionLoading(true)
    const result = entityMasterService.remove(entity.id)
    if (result.ok) {
      showToast({ title: 'Entity archived', variant: 'success' })
      navigate(`${base}/masters/entities`)
    } else {
      showToast({ title: 'Cannot delete', description: 'Entity is linked to active applications.', variant: 'warning' })
    }
    setDeleteOpen(false)
    setActionLoading(false)
  }

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(`${base}/masters/entities`)}
        sx={{ mb: 2 }}
      >
        Back to entities
      </Button>

      <CustomerPageHeader
        eyebrow="Entity master"
        title={entity.entityName}
        subtitle={`${entity.city ? `${entity.city}, ` : ''}${entity.country}`}
        badge={entityStatusLabel[entity.status]}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
              Edit entity
            </Button>
            <Button variant="outlined" onClick={() => setStatusOpen(true)}>
              {entity.status === 'active' ? 'Inactivate' : 'Activate'}
            </Button>
            <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)}>
              Delete / archive
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Basic details" icon={Building2}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Entity name', value: entity.entityName },
                  { label: 'Country', value: entity.country },
                  { label: 'City', value: entity.city || '--' },
                  { label: 'Location', value: entity.location || '--' },
                  {
                    label: 'Status',
                    value: (
                      <CustomerStatusChip
                        label={entityStatusLabel[entity.status]}
                        tone={getCustomerStatusTone(entityStatusLabel[entity.status])}
                      />
                    ),
                  },
                  { label: 'Last updated', value: formatEntityDate(entity.updatedAt) },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Contact details" icon={UserRound}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Contact person', value: entity.contactPersonName },
                  { label: 'Email', value: entity.contactPersonEmail || '--' },
                  { label: 'Mobile', value: entity.contactPersonMobile || '--' },
                ]}
              />
            </CustomerCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Notes" icon={FileText}>
              <Typography sx={{ fontSize: 13, color: entity.notes ? colors.textSecondary : colors.textMuted }}>
                {entity.notes || 'No notes added.'}
              </Typography>
            </CustomerCard>

            <CustomerCard title="Activity log" icon={Activity}>
              {entity.activities.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No activity recorded yet.</Typography>
              ) : (
                <CustomerTimeline
                  items={entity.activities.map(act => ({
                    id: act.id,
                    title: act.action,
                    description: act.detail,
                    status: 'completed' as const,
                    timestamp: formatEntityDate(act.timestamp),
                  }))}
                />
              )}
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>

      <EntityFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={entity}
        onSaved={() => {
          reload()
          showToast({ title: 'Entity updated', variant: 'success' })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={entity.status === 'active' ? 'Inactivate entity?' : 'Activate entity?'}
        description={`${entity.entityName} will be marked as ${entity.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={entity.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={handleStatusToggle}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete / archive entity?"
        description={`${entity.entityName} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </Box>
  )
}
