import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, FileText, ListChecks, Send, Share2 } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'

interface QuotationKpiRowProps {
  quotations: QuotationRecord[]
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string
  value: number
  icon: LucideIcon
  iconColor: string
}) {
  return (
    <BaseCard sx={{ height: '100%', px: 2, py: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Stack spacing={0.75}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.45, lineHeight: 1.2 }}
          >
            {label}
          </Typography>
          <Typography variant="h5" component="p" fontWeight={700} sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            bgcolor: `${iconColor}14`,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <Icon size={18} />
        </Stack>
      </Stack>
    </BaseCard>
  )
}

export function QuotationKpiRow({ quotations }: QuotationKpiRowProps) {
  const theme = useTheme()
  const total = quotations.length
  const draft = quotations.filter((q) => getCurrentVersion(q)?.status === 'draft').length
  const submitted = quotations.filter((q) => getCurrentVersion(q)?.status === 'submitted').length
  const approved = quotations.filter((q) => getCurrentVersion(q)?.status === 'approved').length
  const shared = quotations.filter((q) => q.sharedStatus === 'shared').length

  return (
    <Grid container spacing={1.5} sx={{ mb: 0.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Total quotations" value={total} icon={ListChecks} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Draft" value={draft} icon={FileText} iconColor={theme.palette.text.secondary} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Pending approval" value={submitted} icon={Send} iconColor={theme.palette.info.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Approved" value={approved} icon={CheckCircle2} iconColor={theme.palette.success.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
        <KpiCard label="Shared" value={shared} icon={Share2} iconColor={theme.palette.warning.main} />
      </Grid>
    </Grid>
  )
}
