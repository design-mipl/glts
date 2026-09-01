import { Grid, Stack, Typography } from '@mui/material'
import { ORDER_ENQUIRY_SERVICE_LABEL } from '@/shared/services/orderEnquiryService'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'
import { orderEnquirySourceLabel, orderEnquiryStatusLabel } from '../../config/orderEnquiryStatusConfig'
import { formatOrderEnquiryDate } from '../../utils/orderEnquiryListingUtils'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function OverviewTab({ enquiry }: { enquiry: OrderEnquiry }) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DetailField label="Enquiry number" value={enquiry.enquiryNumber} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DetailField label="Enquiry date" value={formatOrderEnquiryDate(enquiry.enquiryDate)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DetailField label="Status" value={orderEnquiryStatusLabel[enquiry.status]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DetailField label="Source" value={orderEnquirySourceLabel[enquiry.source]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DetailField label="Service" value={ORDER_ENQUIRY_SERVICE_LABEL[enquiry.service]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DetailField label="Converted order" value={enquiry.convertedOrderId ?? '—'} />
        </Grid>
      </Grid>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Customer details
        </Typography>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailField label="Company / customer" value={enquiry.customer.companyOrCustomerName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailField label="Contact person" value={enquiry.customer.contactPersonName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailField label="Mobile" value={enquiry.customer.contactNumber} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailField label="Email" value={enquiry.customer.emailAddress} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DetailField label="Address" value={enquiry.customer.companyAddress} />
          </Grid>
        </Grid>
      </Stack>

      {enquiry.notes ? (
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {enquiry.notes}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  )
}
