import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { Building2, CheckCircle2, ListChecks, Users } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { CorporateAccount } from '@/shared/types/corporateAccount'

function KpiCard({ label, value, icon: Icon, iconColor }: { label: string; value: number; icon: LucideIcon; iconColor: string }) {
  return (
    <BaseCard sx={{ height: '100%', px: 2, py: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="center" sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: `${iconColor}14`, color: iconColor }}>
          <Icon size={18} />
        </Stack>
      </Stack>
    </BaseCard>
  )
}

export function CorporateAccountKpiRow({ accounts }: { accounts: CorporateAccount[] }) {
  const theme = useTheme()
  const total = accounts.length
  const active = accounts.filter((a) => a.portalStatus === 'active').length
  const draft = accounts.filter((a) => a.portalStatus === 'draft').length
  const totalAdmins = accounts.reduce((sum, a) => sum + a.admins.length + (a.superAdmin ? 1 : 0), 0)

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><KpiCard label="Total accounts" value={total} icon={ListChecks} iconColor={theme.palette.primary.main} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><KpiCard label="Active" value={active} icon={CheckCircle2} iconColor={theme.palette.success.main} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><KpiCard label="Draft" value={draft} icon={Building2} iconColor={theme.palette.text.secondary} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><KpiCard label="Total admins" value={totalAdmins} icon={Users} iconColor={theme.palette.info.main} /></Grid>
    </Grid>
  )
}
