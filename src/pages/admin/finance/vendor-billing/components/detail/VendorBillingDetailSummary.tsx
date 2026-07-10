import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { Vendor } from '@/shared/types/vendor'
import type { VendorBillingSummaryRow } from '@/shared/types/vendorBilling'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { vendorCategoryLabel } from '@/pages/admin/vendor-management/vendors/config/vendorCategoryConfig'
import { vendorStatusColor, vendorStatusLabel } from '@/pages/admin/vendor-management/vendors/config/vendorStatusConfig'
import { paymentTermsLabel } from '@/pages/admin/vendor-management/vendors/config/paymentTermsConfig'

interface VendorBillingDetailSummaryProps {
  vendor: Vendor
  summary?: VendorBillingSummaryRow
}

export function VendorBillingDetailSummary({ vendor, summary }: VendorBillingDetailSummaryProps) {
  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {vendor.vendorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vendor.vendorId} · {vendorCategoryLabel[vendor.vendorCategory]} · {paymentTermsLabel[vendor.commercial.paymentTerms]}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Badge label={vendorStatusLabel[vendor.status]} color={vendorStatusColor[vendor.status]} />
              <Badge label={`${summary?.awaitingInvoiceCount ?? 0} awaiting invoice`} color="warning" />
              <Badge label={`${summary?.billsCount ?? 0} open bills`} color="info" />
            </Stack>
          </Stack>

          <Divider />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Outstanding
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {formatInr(summary?.outstandingAmount ?? 0)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Last invoice date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {summary?.lastInvoiceDate ? new Date(summary.lastInvoiceDate).toLocaleDateString() : '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Last payment date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {summary?.lastPaymentDate ? new Date(summary.lastPaymentDate).toLocaleDateString() : '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Primary contact
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {vendor.contactPerson || '—'}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </BaseCard>
  )
}

function BoxBadge({ status }: { status: Vendor['status'] }) {
  return <Badge label={vendorStatusLabel[status]} color={vendorStatusColor[status]} size="sm" />
}
