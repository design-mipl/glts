import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, FileStack, Globe2, PencilLine } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { CountryMasterKpiCounts } from '@/shared/types/countryMaster'

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

export function CountryKpiRow({ counts }: { counts: CountryMasterKpiCounts }) {
  const theme = useTheme()
  const items = [
    { label: 'Total countries', value: counts.total, icon: Globe2, color: theme.palette.primary.main },
    { label: 'Active', value: counts.active, icon: CheckCircle2, color: theme.palette.success.main },
    { label: 'Draft', value: counts.draft, icon: PencilLine, color: theme.palette.warning.main },
    { label: 'Inactive', value: counts.inactive, icon: FileStack, color: theme.palette.text.secondary },
  ]

  return (
    <Grid container spacing={1.5}>
      {items.map((item) => (
        <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard label={item.label} value={item.value} icon={item.icon} iconColor={item.color} />
        </Grid>
      ))}
    </Grid>
  )
}
