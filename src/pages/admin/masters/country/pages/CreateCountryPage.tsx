import { CountryFormStepperPage } from './CountryFormStepperPage'

export function CreateCountryPage() {
  return (
    <CountryFormStepperPage
      mode="create"
      breadcrumbs={[
        { label: 'Country Master', href: '/admin/masters/country' },
        { label: 'Add country' },
      ]}
      cancelHref="/admin/masters/country"
    />
  )
}
