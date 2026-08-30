import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, ClipboardList, FileStack } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { RequirementMasterKpiCounts } from '@/shared/types/requirementMaster'

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

export function RequirementKpiRow({ counts }: { counts: RequirementMasterKpiCounts }) {
  const theme = useTheme()
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard label="Total packs" value={counts.total} icon={ClipboardList} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard label="Active" value={counts.active} icon={CheckCircle2} iconColor={theme.palette.success.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <KpiCard
          label="Inactive"
          value={counts.inactive}
          icon={FileStack}
          iconColor={theme.palette.text.secondary}
        />
      </Grid>
    </Grid>
  )
}
