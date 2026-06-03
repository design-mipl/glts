import { Box, Stack, Typography } from '@mui/material'
import { Info, Receipt } from 'lucide-react'
import {
  CustomerCard,
  CustomerInfoGrid,
  CustomerStatusChip,
  type CustomerTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type {
  ApplicationBillingTermsAdvance,
  ApplicationBillingTermsCredit,
  ApplicationBillingTermsMixed,
  ApplicationBillingTermsTone,
  ApplicationBillingTermsViewModel,
} from '@/shared/utils/mapApplicationBillingTermsSummary'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

function toCustomerTone(tone: ApplicationBillingTermsTone): CustomerTone {
  return tone
}

function ServiceChipList({ title, services }: { title: string; services: string[] }) {
  const colors = usePublicBrandColors()
  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, mb: 0.75 }}>{title}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.75}>
        {services.map(service => (
          <CustomerStatusChip key={service} label={service} tone="neutral" />
        ))}
      </Stack>
    </Box>
  )
}

function NoticeText({ text, tone }: { text: string; tone: CustomerTone }) {
  const colors = usePublicBrandColors()
  const isWarning = tone === 'warning'
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      sx={{
        mt: 1.5,
        p: 1.25,
        borderRadius: '10px',
        bgcolor: isWarning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.08)',
        border: `1px solid ${isWarning ? 'rgba(245, 158, 11, 0.22)' : 'rgba(59, 130, 246, 0.2)'}`,
      }}
    >
      <Info size={16} style={{ flexShrink: 0, marginTop: 2, color: isWarning ? '#B45309' : '#2563EB' }} />
      <Typography sx={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5 }}>{text}</Typography>
    </Stack>
  )
}

function CreditContent({ model }: { model: ApplicationBillingTermsCredit }) {
  return (
    <>
      <CustomerInfoGrid columns={2} items={model.fields} />
      <NoticeText text={model.helperText} tone="info" />
    </>
  )
}

function AdvanceContent({ model }: { model: ApplicationBillingTermsAdvance }) {
  return (
    <>
      <CustomerInfoGrid columns={1} items={model.fields} />
      <NoticeText text={model.infoText} tone="warning" />
      <Box sx={{ mt: 1.5 }}>
        <ServiceChipList title="Applicable services" services={model.applicableServices} />
      </Box>
    </>
  )
}

function MixedContent({ model }: { model: ApplicationBillingTermsMixed }) {
  return (
    <>
      <CustomerInfoGrid columns={2} items={model.fields} />
      <Stack spacing={1.5} sx={{ mt: 1.5 }}>
        <ServiceChipList title="Advance applicable services" services={model.advanceApplicableServices} />
        <ServiceChipList title="Credit applicable services" services={model.creditApplicableServices} />
      </Stack>
    </>
  )
}

export interface ApplicationBillingTermsSummaryCardProps {
  model: ApplicationBillingTermsViewModel
}

export function ApplicationBillingTermsSummaryCard({ model }: ApplicationBillingTermsSummaryCardProps) {
  const tone = toCustomerTone(model.tone)

  return (
    <CustomerCard
      title="Billing terms"
      subtitle="Configured under your commercial agreement"
      icon={Receipt}
      tone={tone}
      action={<CustomerStatusChip label={model.billingTypeLabel} tone={tone} />}
    >
      {model.billingType === 'credit' && <CreditContent model={model} />}
      {model.billingType === 'advance' && <AdvanceContent model={model} />}
      {model.billingType === 'mixed' && <MixedContent model={model} />}
    </CustomerCard>
  )
}
