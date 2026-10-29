import { Grid, Stack, Typography, useTheme } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { Globe, Inbox, ShoppingCart, Workflow } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'

interface OrderEnquiryKpiRowProps {
  enquiries: OrderEnquiry[]
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

export function OrderEnquiryKpiRow({ enquiries }: OrderEnquiryKpiRowProps) {
  const theme = useTheme()
  const total = enquiries.length
  const website = enquiries.filter((item) => item.source === 'website').length
  const inReview = enquiries.filter((item) => item.status === 'in_review' || item.status === 'qualified').length
  const converted = enquiries.filter((item) => item.status === 'converted').length

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Total enquiries" value={total} icon={Inbox} iconColor={theme.palette.primary.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="From website" value={website} icon={Globe} iconColor={theme.palette.info.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="In review" value={inReview} icon={Workflow} iconColor={theme.palette.warning.main} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label="Converted" value={converted} icon={ShoppingCart} iconColor={theme.palette.success.main} />
      </Grid>
    </Grid>
  )
}
