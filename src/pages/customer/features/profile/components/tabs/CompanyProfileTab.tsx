import { Grid } from '@mui/material'
import { CustomerInfoGrid, CustomerReadonlyField } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { ProfileCopyField } from '../ProfileCopyField'
import { ProfileChipPanel } from '../ProfileChipPanel'
import type { CompanyProfileData } from '../../types/accountWorkspace'

export interface CompanyProfileTabProps {
  data: CompanyProfileData
}

export function CompanyProfileTab({ data }: CompanyProfileTabProps) {
  const { billing, operations } = data

  return (
    <>
      <CustomerDetailSection title="Billing information">
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
      </CustomerDetailSection>

      <CustomerDetailSection title="Supported operations" divider={false}>
        <ProfileChipPanel countries={operations.countries} visaTypes={operations.visaTypes} />
      </CustomerDetailSection>
    </>
  )
}
