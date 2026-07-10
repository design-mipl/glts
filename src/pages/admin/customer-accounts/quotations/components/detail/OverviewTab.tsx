import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BaseCard } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { quotationSourceTypeLabel, workflowTypeLabel } from '../../config/quotationStatusConfig'

interface InfoGridItem {
  label: string
  value: ReactNode
}

function InfoGrid({ items }: { items: InfoGridItem[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 1.25,
      }}
    >
      {items.map((item) => (
        <Box key={item.label} sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
            {item.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={typeof item.value === 'string' ? item.value : undefined}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export function OverviewTab({ quotation }: { quotation: QuotationRecord }) {
  const customerItems: InfoGridItem[] = [
    { label: 'Company', value: quotation.customer.companyName || '—' },
    { label: 'Contact', value: quotation.customer.contactPersonName || '—' },
    { label: 'Phone', value: quotation.customer.contactNumber || '—' },
    { label: 'Email', value: quotation.customer.emailAddress || '—' },
    { label: 'Address', value: quotation.customer.companyAddress || '—' },
  ]

  const quotationItems: InfoGridItem[] = [
    { label: 'Quotation No.', value: quotation.quotationNo },
    { label: 'Type', value: quotationSourceTypeLabel[quotation.sourceType] },
    { label: 'Workflow', value: workflowTypeLabel[quotation.workflowType] },
    { label: 'Quotation date', value: quotation.quotationDate },
    { label: 'Valid till', value: quotation.validTill },
    { label: 'GST', value: `${quotation.gstPercentage}%` },
    {
      label: 'Linked enquiry',
      value: quotation.enquiryId ? (
        <Link to={`/admin/customer-accounts/enquiries/${quotation.enquiryId}`}>{quotation.enquiryId}</Link>
      ) : (
        '—'
      ),
    },
    { label: 'Notes', value: quotation.notes || '—' },
  ]

  return (
    <Stack spacing={2}>
      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Customer Information
        </Typography>
        <InfoGrid items={customerItems} />
      </BaseCard>

      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Quotation Information
        </Typography>
        <InfoGrid items={quotationItems} />
      </BaseCard>
    </Stack>
  )
}
