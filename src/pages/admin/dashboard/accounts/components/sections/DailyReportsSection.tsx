import { Box, Grid, Stack, Typography } from '@mui/material'
import { Download, Eye } from 'lucide-react'
import { BaseCard, Button, useToast } from '@/design-system/UIComponents'
import type { DailyReportCard } from '../../data/accountsDashboardMock'

function DailyReportCardItem({ report }: { report: DailyReportCard }) {
  const { showToast } = useToast()

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
        <Typography variant="body2" fontWeight={600}>
          {report.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last generated: {report.lastGenerated}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1 }}>
          <Button
            label="View"
            variant="outlined"
            size="sm"
            startIcon={<Eye size={14} />}
            onClick={() =>
              showToast({
                title: 'Opening report',
                description: `${report.name} preview.`,
                variant: 'info',
              })
            }
          />
          <Button
            label="Download"
            size="sm"
            startIcon={<Download size={14} />}
            onClick={() =>
              showToast({
                title: 'Download started',
                description: `${report.name} export queued.`,
                variant: 'success',
              })
            }
          />
        </Stack>
      </Box>
    </BaseCard>
  )
}

export interface DailyReportsSectionProps {
  reports: DailyReportCard[]
}

export function DailyReportsSection({ reports }: DailyReportsSectionProps) {
  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Daily reports
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Operational and financial reports generated today
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {reports.map((report) => (
          <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <DailyReportCardItem report={report} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
