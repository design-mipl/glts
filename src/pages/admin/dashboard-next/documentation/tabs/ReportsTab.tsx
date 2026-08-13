import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FormField, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../shared/constants'
import {
  DOC_REPORT_TYPE_OPTIONS,
  getDocReportSource,
  getDocReportTypeLabel,
  type DocReportTypeId,
} from '../data/documentationReportsConfig'
import type { DocumentationDashboardTabProps } from '../types'

/** Documentation Reports — catalog in dropdown; preview Coming soon until data is wired. */
export function ReportsTab(_props: DocumentationDashboardTabProps) {
  const colors = usePublicBrandColors()
  const [reportType, setReportType] = useState<DocReportTypeId | ''>('')

  const reportLabel = reportType ? getDocReportTypeLabel(reportType) : ''
  const reportSource = reportType ? getDocReportSource(reportType) : ''

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2 }}>
        <Box sx={{ maxWidth: { md: 420 } }}>
          <FormField label="Report type">
            <Select
              size="sm"
              fullWidth
              placeholder="Select report type"
              value={reportType}
              options={[...DOC_REPORT_TYPE_OPTIONS]}
              onChange={(value) =>
                setReportType(value === '' ? '' : (String(value) as DocReportTypeId))
              }
            />
          </FormField>
        </Box>
      </Box>

      <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
        {reportType ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
              {reportLabel}
            </Typography>
            {reportSource ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
              >
                {reportSource}
              </Typography>
            ) : null}
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ fontSize: 15, mt: 2.5, color: 'text.primary' }}
            >
              Coming soon
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
            >
              This report is listed for planning. Preview and download will follow once data is
              connected.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 14 }}>
              Select a report
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
            >
              Choose a report type above to open it.
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  )
}
