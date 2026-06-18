import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Download } from 'lucide-react'
import { Button, useToast } from '@/design-system/UIComponents'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { FinanceKpiRow } from '../components/overview/FinanceKpiRow'
import { RecentInvoicesCard } from '../components/overview/RecentInvoicesCard'
import { RecentPaymentsCard } from '../components/overview/RecentPaymentsCard'
import { QuickOutstandingCard } from '../components/overview/QuickOutstandingCard'

export function FinanceOverviewPage() {
  const { isSuperAdmin } = useCustomerPortalBase()
  const { showToast } = useToast()
  const overview = useMemo(() => customerFinanceService.getFinanceOverview(), [])

  const handleExport = () => {
    if (!customerFinanceService.canExportFinanceData()) {
      showToast({ title: 'Export not available', description: 'Only Super Admin can export financial data.', variant: 'warning' })
      return
    }
    const csv = customerFinanceService.exportFinanceData()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'glts-finance-export.csv'
    a.click()
    URL.revokeObjectURL(url)
    showToast({ title: 'Export complete', description: 'Financial data downloaded.', variant: 'success' })
  }

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Finance Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Company-level billing and payment summary synced from GLTS Accounts.
          </Typography>
        </Box>
        {isSuperAdmin && (
          <Button
            label="Export financial data"
            variant="outlined"
            startIcon={<Download size={14} />}
            onClick={handleExport}
          />
        )}
      </Stack>

      <FinanceKpiRow metrics={overview.metrics} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentInvoicesCard invoices={overview.recentInvoices} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentPaymentsCard payments={overview.recentPayments} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <QuickOutstandingCard invoices={overview.quickOutstanding} />
        </Grid>
      </Grid>
    </Stack>
  )
}