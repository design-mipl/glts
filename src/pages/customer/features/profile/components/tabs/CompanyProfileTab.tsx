import { Box, Grid, Typography } from '@mui/material'
import { CustomerInfoGrid, CustomerReadonlyField } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ProfileCopyField } from '../ProfileCopyField'
import { ProfilePricingSection } from '../ProfilePricingSection'
import type { CompanyProfileData } from '../../types/accountWorkspace'
import type { CommercialVisaPricingRule, QuotationServiceLine } from '@/shared/types/quotation'

export interface CompanyProfileTabProps {
  data: CompanyProfileData
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
}

function SectionLabel({ children }: { children: string }) {
  const colors = usePublicBrandColors()
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: colors.textMuted,
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  )
}

export function CompanyProfileTab({
  data,
  commercialVisaPricing,
  miscellaneousServices,
}: CompanyProfileTabProps) {
  const { billing } = data
  const hasPricing = commercialVisaPricing.length > 0 || miscellaneousServices.length > 0

  return (
    <CustomerDetailSection title="Company information">
      <CustomerInfoGrid
        columns={2}
        items={[
          { label: 'Billing entity name', value: billing.billingEntityName },
          { label: 'Billing email', value: billing.billingEmail },
          { label: 'Billing contact number', value: billing.billingPhone },
        ]}
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProfileCopyField label="GST number" value={billing.gstNumber} verified={billing.gstVerified} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProfileCopyField label="PAN number" value={billing.panNumber} verified={billing.panVerified} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomerReadonlyField label="Billing address" value={billing.billingAddress} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <SectionLabel>Pricing matrix</SectionLabel>
        {hasPricing ? (
          <ProfilePricingSection
            commercialVisaPricing={commercialVisaPricing}
            miscellaneousServices={miscellaneousServices}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No pricing is configured on your agreement yet.
          </Typography>
        )}
      </Box>
    </CustomerDetailSection>
  )
}
