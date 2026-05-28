import { Box, Grid, Stack } from '@mui/material'
import { FileText, Users, AlertTriangle } from 'lucide-react'
import {
  ActionCard,
  ListCard,
  MetricCard,
  StatCard,
} from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { getTemplateRecipeById } from '../config/templateRegistry'
import { TemplateShowcaseBanner } from '../components/TemplateShowcaseBanner'

export function DashboardTemplatePage() {
  const recipe = getTemplateRecipeById('dashboard')!

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminPageHeader
        title="Dashboard module (template)"
        description="Operational overview with KPI cards, metrics, recent activity, and quick actions."
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Open cases" value={48} delta={12.4} icon={<FileText size={18} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Assigned today" value={16} delta={-3.2} icon={<Users size={18} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="SLA breaches" value={3} delta={1.1} icon={<AlertTriangle size={18} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Throughput"
            metrics={[
              { label: 'Processed', value: '124' },
              { label: 'Pending', value: '32' },
            ]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ListCard
            title="Recent activity"
            items={[
              { id: '1', primary: 'REF-2401 assigned to Riya Sharma', secondary: '2 min ago' },
              { id: '2', primary: 'REF-2403 SLA breached', secondary: '18 min ago' },
              { id: '3', primary: 'REF-2402 moved to Pending', secondary: '1 hr ago' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2}>
            <ActionCard
              title="Open queue"
              description="Route to the operations work queue."
              icon={<FileText size={18} />}
              onClick={() => {}}
            />
            <ActionCard
              title="Create record"
              description="Start a new module record from the listing template."
              icon={<Users size={18} />}
              onClick={() => {}}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
