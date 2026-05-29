import { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Ship, UserRound, FileText, Activity } from 'lucide-react'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import { normalizeVesselId } from '@/pages/customer/data/portalIds'
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
import { vesselStatusLabel, vesselTypeLabel } from '../config/vesselTypeConfig'
import { formatVesselDate } from '../utils/vesselListingUtils'
import { VesselFormDrawer } from '../components/VesselFormDrawer'
import { useVesselDetailState } from '../hooks/useVesselDetailState'

export function VesselDetailPage() {
  const colors = usePublicBrandColors()
  const { vesselId } = useParams()
  const navigate = useNavigate()
  const { base, canAccessMasters } = useCustomerPortalBase()
  const { showToast } = useToast()
  const resolvedId = normalizeVesselId(vesselId) ?? vesselId
  const { vessel, reload } = useVesselDetailState(resolvedId)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  if (!canAccessMasters) {
    return (
      <CustomerEmptyState
        title="Access restricted"
        description="Only Super Admins and Admins can view vessel details."
        actionLabel="Back to dashboard"
        onAction={() => navigate(`${base}/dashboard`)}
      />
    )
  }

  if (!vessel) {
    return (
      <CustomerEmptyState
        title="Vessel not found"
        description="The selected vessel record could not be found."
        actionLabel="Back to vessels"
        onAction={() => navigate(`${base}/masters/vessels`)}
      />
    )
  }

  return (
    <Box>
      <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(`${base}/masters/vessels`)} sx={{ mb: 2 }}>
        Back to vessels
      </Button>

      <CustomerPageHeader
        eyebrow="Vessel master"
        title={vessel.vesselName}
        subtitle={`IMO ${vessel.imoNumber} · ${vessel.flagCountry}`}
        badge={vesselStatusLabel[vessel.status]}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Edit vessel</Button>
            <Button variant="outlined" onClick={() => setStatusOpen(true)}>
              {vessel.status === 'active' ? 'Inactivate' : 'Activate'}
            </Button>
            <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)}>Delete / archive</Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Basic vessel details" icon={Ship}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Vessel name', value: vessel.vesselName },
                  { label: 'IMO number', value: vessel.imoNumber },
                  { label: 'Vessel type', value: vesselTypeLabel[vessel.vesselType] },
                  { label: 'Flag country', value: vessel.flagCountry },
                  { label: 'Port of registry', value: vessel.portOfRegistry || '--' },
                  {
                    label: 'Status',
                    value: (
                      <CustomerStatusChip
                        label={vesselStatusLabel[vessel.status]}
                        tone={getCustomerStatusTone(vesselStatusLabel[vessel.status])}
                      />
                    ),
                  },
                  { label: 'Last updated', value: formatVesselDate(vessel.updatedAt) },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Contact details" icon={UserRound}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Contact person', value: vessel.contactPersonName || '--' },
                  { label: 'Email', value: vessel.contactPersonEmail || '--' },
                  { label: 'Mobile', value: vessel.contactPersonMobile || '--' },
                ]}
              />
            </CustomerCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <CustomerCard title="Notes" icon={FileText}>
              <Typography sx={{ fontSize: 13, color: vessel.notes ? colors.textSecondary : colors.textMuted }}>
                {vessel.notes || 'No notes added.'}
              </Typography>
            </CustomerCard>

            <CustomerCard title="Activity log" icon={Activity}>
              {vessel.activities.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No activity recorded yet.</Typography>
              ) : (
                <CustomerTimeline
                  items={vessel.activities.map(act => ({
                    id: act.id,
                    title: act.action,
                    description: act.detail,
                    status: 'completed' as const,
                    timestamp: formatVesselDate(act.timestamp),
                  }))}
                />
              )}
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>

      <VesselFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={vessel}
        onSaved={() => {
          reload()
          showToast({ title: 'Vessel updated', variant: 'success' })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={vessel.status === 'active' ? 'Inactivate vessel?' : 'Activate vessel?'}
        description={`${vessel.vesselName} will be marked as ${vessel.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={vessel.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={() => {
          setActionLoading(true)
          const next = vessel.status === 'active' ? 'inactive' : 'active'
          vesselMasterService.setStatus(vessel.id, next)
          showToast({ title: `Vessel ${next === 'active' ? 'activated' : 'inactivated'}`, variant: 'success' })
          reload()
          setStatusOpen(false)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete / archive vessel?"
        description={`${vessel.vesselName} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          setActionLoading(true)
          const result = vesselMasterService.remove(vessel.id)
          if (result.ok) {
            showToast({ title: 'Vessel archived', variant: 'success' })
            navigate(`${base}/masters/vessels`)
          } else {
            showToast({ title: 'Cannot delete', description: 'Vessel is linked to active applications.', variant: 'warning' })
          }
          setDeleteOpen(false)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />
    </Box>
  )
}
