import type { ReactNode } from 'react'
import { Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { Order } from '@/shared/types/order'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getOrderServiceLabel, getOrderVendorLabel } from '../../utils/orderMasterOptions'

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || '—'}
      </Typography>
    </Grid>
  )
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <BaseCard sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </BaseCard>
  )
}

function SummaryKpiCard({ label, value }: { label: string; value: string }) {
  return (
    <BaseCard sx={{ p: 2, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </BaseCard>
  )
}

export function OverviewTab({ order }: { order: Order }) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Line items" value={String(order.lineItems.length)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Subtotal" value={formatInr(order.totals.subtotal)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Tax amount" value={formatInr(order.totals.taxAmount)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Grand total" value={formatInr(order.totals.grandTotal)} />
        </Grid>
      </Grid>

      <InfoCard title="Customer information">
        <ReadOnlyField label="Company / Customer" value={order.customer.companyOrCustomerName} />
        <ReadOnlyField label="Customer type" value={order.customer.customerType} />
        <ReadOnlyField label="Contact person" value={order.customer.contactPersonName} />
        <ReadOnlyField label="Mobile number" value={order.customer.contactNumber} />
        <ReadOnlyField label="Alternate number" value={order.customer.alternateContactNumber ?? ''} />
        <ReadOnlyField label="Email address" value={order.customer.emailAddress} />
        <ReadOnlyField label="Company website" value={order.customer.companyWebsite ?? ''} />
        <ReadOnlyField label="Company address" value={order.customer.companyAddress ?? ''} />
      </InfoCard>

      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
          Service line items
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Vendor rate</TableCell>
              <TableCell align="right">Client rate</TableCell>
              <TableCell align="right">Margin</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.lineItems.map((line) => (
              <TableRow key={line.id}>
                <TableCell>{getOrderServiceLabel(line.serviceMasterId)}</TableCell>
                <TableCell>{getOrderVendorLabel(line.vendorId)}</TableCell>
                <TableCell align="right">{line.quantity}</TableCell>
                <TableCell align="right">{formatInr(line.vendorRate)}</TableCell>
                <TableCell align="right">{formatInr(line.clientRate)}</TableCell>
                <TableCell align="right">{formatInr(line.margin)}</TableCell>
                <TableCell>{line.remarks || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </BaseCard>

      <InfoCard title="Additional information">
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary">
            Notes
          </Typography>
          <Typography variant="body2">{order.notes || '—'}</Typography>
        </Grid>
      </InfoCard>
    </Stack>
  )
}
