import { Box, Grid, Stack, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserRound, ShieldCheck, FileText, Activity } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { normalizeBookerId } from '../../../data/portalIds'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import {
  CustomerActionPanel,
  CustomerCard,
  CustomerEmptyState,
  CustomerInfoGrid,
  CustomerPageHeader,
  CustomerStatusChip,
  CustomerTimeline,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'

export function BookerDetailPage() {
  const colors = usePublicBrandColors()
  const { bookerId } = useParams()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const resolvedBookerId = normalizeBookerId(bookerId) ?? bookerId
  const { booker, assignedApps, permissionLabels } = customerPortalService.getBookerDetail(resolvedBookerId)

  if (!booker) {
    return (
      <CustomerEmptyState
        title="Booker not found"
        description="The selected booker record could not be found."
        actionLabel="Back to bookers"
        onAction={() => navigate(`${base}/bookers`)}
      />
    )
  }

  return (
    <Box>
      <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(`${base}/bookers`)} sx={{ mb: 2 }}>
        Back to bookers
      </Button>

      <CustomerPageHeader
        eyebrow="Booker profile"
        title={booker.name}
        subtitle={`${booker.email} � ${booker.mobile}`}
        badge={booker.status}
        action={<Button variant="outlined">Edit access</Button>}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <CustomerCard title="Personal info" icon={UserRound}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Designation', value: booker.designation },
                  { label: 'Role', value: booker.role },
                  { label: 'Assigned applications', value: `${booker.apps} active` },
                  { label: 'Last active', value: booker.lastActive },
                  { label: 'Last login', value: booker.lastLogin ?? 'Not available' },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Access permissions" icon={ShieldCheck}>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {booker.permissions.map(permission => (
                  <CustomerStatusChip key={permission} label={permissionLabels[permission]} tone="info" />
                ))}
              </Stack>
            </CustomerCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <CustomerCard title="Assigned applications" subtitle="Applications this booker can access" icon={FileText}>
              {assignedApps.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No assigned applications.</Typography>
              ) : (
                <Stack spacing={1.25}>
                  {assignedApps.map(app => (
                    <CustomerActionPanel
                      key={app.id}
                      title={`${app.countryFlag ?? ''} ${app.country} � ${app.visaType}`}
                      description={`${app.id} � Travel ${app.travelDate}`}
                      progress={app.progress}
                      action={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CustomerStatusChip label={app.statusLabel} tone={getCustomerStatusTone(app.statusLabel)} />
                          <Button size="sm" variant="outlined" onClick={() => navigate(`${base}/applications/${app.id}`)}>
                            Open
                          </Button>
                        </Stack>
                      }
                    />
                  ))}
                </Stack>
              )}
            </CustomerCard>

            <CustomerCard title="Activity history" icon={Activity}>
              <CustomerTimeline
                items={[
                  { id: 'uploaded-docs', title: 'Uploaded documents', description: assignedApps[1]?.id ?? assignedApps[0]?.id, status: 'completed', timestamp: 'Yesterday' },
                  { id: 'created-app', title: 'Created application', description: assignedApps[0]?.id, status: 'completed', timestamp: '3 days ago' },
                  { id: 'next-action', title: 'Waiting for next customer action', status: 'pending' },
                ]}
              />
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}