import { Box, Stack, Typography } from '@mui/material'
import { FormField, Input, Select } from '@/design-system/UIComponents'

function SubtleStat({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block', lineHeight: 1.3 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" fontWeight={600} sx={{ fontSize: 13, lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Box>
  )
}

interface InvoiceCompositionKpiRowProps {
  totalApplications: number
  singleCount: number
  bulkCount: number
  totalApplicants: number
}

export function InvoiceCompositionKpiRow({
  totalApplications,
  singleCount,
  bulkCount,
  totalApplicants,
}: InvoiceCompositionKpiRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        gap: { xs: 1.5, sm: 2 },
        width: '100%',
      }}
    >
      <SubtleStat label="Selected applications" value={totalApplications} />
      <SubtleStat label="Single" value={singleCount} />
      <SubtleStat label="Bulk" value={bulkCount} />
      <SubtleStat label="Total applicants" value={totalApplicants} />
    </Box>
  )
}

interface InvoiceCompositionContextStripProps {
  companyName: string
  billingEntity: string
  billingEntityOptions: Array<{ value: string; label: string }>
  onBillingEntityChange: (value: string) => void
  billingTypeLabel: string
  documentDate: string
  onDocumentDateChange: (value: string) => void
  /** Label for the document date field. */
  documentDateLabel?: string
}

export function InvoiceCompositionContextStrip({
  companyName,
  billingEntity,
  billingEntityOptions,
  onBillingEntityChange,
  billingTypeLabel,
  documentDate,
  onDocumentDateChange,
  documentDateLabel = 'Invoice date',
}: InvoiceCompositionContextStripProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1.5, sm: 2.5 }}
      alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      justifyContent="space-between"
      sx={{
        pt: 1.5,
        mt: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2.5 }}
        alignItems={{ sm: 'flex-start' }}
        sx={{ minWidth: 0 }}
      >
        <SubtleStat label="Company" value={companyName || '—'} />
        <SubtleStat label="Billing type" value={billingTypeLabel} />
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          minWidth: 0,
          width: { xs: '100%', sm: 'auto' },
          flexShrink: 0,
          ml: { sm: 'auto' },
        }}
      >
        <Box sx={{ minWidth: 0, width: { xs: '100%', sm: 160 } }}>
          <FormField label={documentDateLabel} required htmlFor="composition-document-date">
            <Input
              id="composition-document-date"
              type="date"
              value={documentDate}
              onChange={v => onDocumentDateChange(String(v))}
              size="sm"
              fullWidth
            />
          </FormField>
        </Box>
        <Box sx={{ minWidth: 0, width: { xs: '100%', sm: 280 } }}>
          <FormField label="Billing entity" required>
            <Select
              value={billingEntity}
              onChange={v => onBillingEntityChange(String(v))}
              options={billingEntityOptions}
              placeholder="Select billing entity"
              size="sm"
              fullWidth
              disabled={billingEntityOptions.length === 0}
            />
          </FormField>
        </Box>
      </Stack>
    </Stack>
  )
}
