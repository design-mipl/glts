import type { ReactNode } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { Vendor } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { paymentTermsLabel, settlementTypeLabel } from '../../config/paymentTermsConfig'
import { vendorCategoryLabel } from '../../config/vendorCategoryConfig'
import { vendorTypeLabel } from '../../config/vendorStatusConfig'

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

export function VendorOverviewTab({ vendor }: { vendor: Vendor }) {
  const activeServices = vendor.serviceMappings.filter((m) => m.status === 'active').length

  return (
    <Stack spacing={3}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Active services" value={String(activeServices)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Total payable" value={formatInr(vendor.finance.totalPayable)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Total paid" value={formatInr(vendor.finance.totalPaid)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryKpiCard label="Outstanding amount" value={formatInr(vendor.outstandingAmount)} />
        </Grid>
      </Grid>

      <InfoCard title="Vendor information">
        <ReadOnlyField label="Vendor ID" value={vendor.vendorId} />
        <ReadOnlyField label="Vendor name" value={vendor.vendorName} />
        <ReadOnlyField label="Category" value={vendorCategoryLabel[vendor.vendorCategory]} />
        <ReadOnlyField label="Type" value={vendorTypeLabel[vendor.vendorType]} />
        <ReadOnlyField label="Country" value={vendor.serviceCountry} />
        <ReadOnlyField label="Visa type" value={vendor.visaType} />
        <ReadOnlyField label="GST applicable" value={vendor.gstApplicable ? 'Yes' : 'No'} />
        <ReadOnlyField label="GST number" value={vendor.gstNumber} />
        <ReadOnlyField label="PAN number" value={vendor.panNumber} />
        <ReadOnlyField label="Status" value={vendor.status === 'active' ? 'Active' : 'Inactive'} />
      </InfoCard>

      <InfoCard title="Contact information">
        <ReadOnlyField label="Contact person" value={vendor.contactPerson} />
        <ReadOnlyField label="Mobile number" value={vendor.mobileNumber} />
        <ReadOnlyField label="Email address" value={vendor.emailAddress} />
        <ReadOnlyField label="Address" value={vendor.address} />
        <ReadOnlyField label="City" value={vendor.city} />
        <ReadOnlyField label="State" value={vendor.state} />
        <ReadOnlyField label="Country (location)" value={vendor.country} />
      </InfoCard>

      <InfoCard title="Commercial information">
        <ReadOnlyField label="Payment terms" value={paymentTermsLabel[vendor.commercial.paymentTerms]} />
        <ReadOnlyField label="Settlement type" value={settlementTypeLabel[vendor.commercial.settlementType]} />
        <ReadOnlyField label="Credit allowed" value={vendor.commercial.creditAllowed ? 'Yes' : 'No'} />
        <ReadOnlyField
          label="Credit limit"
          value={vendor.commercial.creditLimit != null ? formatInr(vendor.commercial.creditLimit) : '—'}
        />
        <ReadOnlyField label="Advance required" value={vendor.commercial.advanceRequired ? 'Yes' : 'No'} />
        <ReadOnlyField
          label="Advance amount"
          value={vendor.commercial.advanceAmount != null ? formatInr(vendor.commercial.advanceAmount) : '—'}
        />
        <ReadOnlyField label="TDS applicable" value={vendor.commercial.tdsApplicable ? 'Yes' : 'No'} />
        <ReadOnlyField
          label="TDS percentage"
          value={vendor.commercial.tdsPercentage != null ? `${vendor.commercial.tdsPercentage}%` : '—'}
        />
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary">
            Notes
          </Typography>
          <Typography variant="body2">{vendor.commercial.notes || '—'}</Typography>
        </Grid>
      </InfoCard>

      <InfoCard title="Bank information">
        <ReadOnlyField label="Account holder" value={vendor.bank.accountHolderName} />
        <ReadOnlyField label="Bank name" value={vendor.bank.bankName} />
        <ReadOnlyField label="Account number" value={vendor.bank.accountNumber} />
        <ReadOnlyField label="IFSC code" value={vendor.bank.ifscCode} />
        <ReadOnlyField label="Branch name" value={vendor.bank.branchName} />
      </InfoCard>
    </Stack>
  )
}
