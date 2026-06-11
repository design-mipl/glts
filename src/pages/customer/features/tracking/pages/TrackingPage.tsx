import { Box, Grid, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, FileText, Truck } from 'lucide-react'
import { Button, Input } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { GLTS_APPLICATION_IDS } from '../../../data/portalIds'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import {
  CustomerActionPanel,
  CustomerCard,
  CustomerInfoGrid,
  CustomerPageHeader,
  CustomerStatusChip,
  CustomerTimeline,
  getCustomerStatusTone,
  type CustomerTimelineItem,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'

export function TrackingPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const [query, setQuery] = useState<string>(GLTS_APPLICATION_IDS.schengen)
  const tracking = customerPortalService.getTracking(query)
  const app = tracking.application
  const timeline = useMemo<CustomerTimelineItem[]>(
    () =>
      tracking.timeline.map((stage) => ({
        id: stage.id,
        title: stage.title,
        status: stage.status,
        timestamp: stage.date,
      })),
    [tracking.timeline],
  )

  return (
    <Box>
      <CustomerPageHeader
        eyebrow="Tracking"
        title="Track application progress"
        subtitle="Search an application ID and follow the customer-visible visa journey."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <CustomerCard title="Application lookup" subtitle="Use the GLTS application reference" icon={Search}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mb: 2 }}>
              <Input value={query} onChange={setQuery} fullWidth placeholder="GLTS-APP-2026-847" />
              <Button variant="contained" startIcon={<Search size={16} />} onClick={() => setQuery(query.trim())}>
                Track
              </Button>
            </Stack>
            <CustomerActionPanel
              title={`${app.countryFlag ?? ''} ${app.country} � ${app.visaType}`}
              description={`${app.id} � Travel ${app.travelDate} � Updated ${app.updatedAt}`}
              progress={app.progress}
              action={<CustomerStatusChip label={app.statusLabel} tone={getCustomerStatusTone(app.statusLabel)} />}
            />
          </CustomerCard>

          <CustomerCard title="Timeline" subtitle="Milestones shown to customers" icon={MapPin} sx={{ mt: 2 }}>
            <CustomerTimeline items={timeline} />
          </CustomerCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2}>
            <CustomerCard title="Journey details" icon={FileText}>
              <CustomerInfoGrid
                columns={1}
                items={[
                  { label: 'Application ID', value: app.id },
                  { label: 'Country', value: `${app.countryFlag ?? ''} ${app.country}` },
                  { label: 'Current status', value: <CustomerStatusChip label={app.statusLabel} tone={getCustomerStatusTone(app.statusLabel)} /> },
                  { label: 'Estimated completion', value: app.eta ?? 'To be confirmed' },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Passport movement" subtitle="Courier details appear when GLTS dispatches passports" icon={Truck} tone="info">
              <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2 }}>
                Passport dispatch is not started yet. We will show courier, AWB, and delivery updates here when available.
              </Typography>
              <Button variant="outlined" fullWidth onClick={() => navigate(`${base}/applications/${app.id}`)}>
                Open application detail
              </Button>
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}