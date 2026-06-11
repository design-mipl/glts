import { useParams, useSearchParams } from 'react-router-dom'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { CountryFormStepperPage } from './CountryFormStepperPage'

export function EditCountryPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const [searchParams] = useSearchParams()
  const initialStep = Number(searchParams.get('step') ?? '0')
  const country = countryId ? countryMasterAdminService.getById(countryId) : undefined

  return (
    <CountryFormStepperPage
      mode="edit"
      countryId={countryId}
      initialStep={initialStep}
      breadcrumbs={[
        { label: 'Country Master', href: '/admin/masters/country' },
        { label: country?.name ?? 'Edit country' },
      ]}
      cancelHref={countryId ? `/admin/masters/country/${countryId}` : '/admin/masters/country'}
    />
  )
}
