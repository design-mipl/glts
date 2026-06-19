import { Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { BaseCard } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { quotationSourceTypeLabel, workflowTypeLabel } from '../../config/quotationStatusConfig'

export function OverviewTab({ quotation }: { quotation: QuotationRecord }) {
  return (
    <Stack spacing={2}>
      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Customer Information
        </Typography>
        <Stack spacing={0.75}>
          <Typography variant="body2">Company: {quotation.customer.companyName}</Typography>
          <Typography variant="body2">Contact: {quotation.customer.contactPersonName}</Typography>
          <Typography variant="body2">Phone: {quotation.customer.contactNumber || '—'}</Typography>
          <Typography variant="body2">Email: {quotation.customer.emailAddress || '—'}</Typography>
          <Typography variant="body2">Address: {quotation.customer.companyAddress || '—'}</Typography>
        </Stack>
      </BaseCard>

      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Quotation Information
        </Typography>
        <Stack spacing={0.75}>
          <Typography variant="body2">Quotation No.: {quotation.quotationNo}</Typography>
          <Typography variant="body2">Type: {quotationSourceTypeLabel[quotation.sourceType]}</Typography>
          <Typography variant="body2">Workflow: {workflowTypeLabel[quotation.workflowType]}</Typography>
          <Typography variant="body2">Quotation date: {quotation.quotationDate}</Typography>
          <Typography variant="body2">Valid till: {quotation.validTill}</Typography>
          <Typography variant="body2">GST: {quotation.gstPercentage}%</Typography>
          {quotation.enquiryId ? (
            <Typography variant="body2">
              Linked enquiry:{' '}
              <Link to={`/admin/customer-accounts/enquiries/${quotation.enquiryId}`}>{quotation.enquiryId}</Link>
            </Typography>
          ) : null}
          {quotation.notes ? <Typography variant="body2">Notes: {quotation.notes}</Typography> : null}
        </Stack>
      </BaseCard>
    </Stack>
  )
}
