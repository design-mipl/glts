import { useNavigate } from 'react-router-dom'
import { CountryMasterList } from '../components/listing/CountryMasterList'

export function CountryListingPage() {
  const navigate = useNavigate()

  return (
    <CountryMasterList
      onNavigateConfigure={(countryId) =>
        navigate(`/admin/masters/country/${countryId}?node=overview`)
      }
      onNavigateEdit={(countryId) =>
        navigate(`/admin/masters/country/${countryId}/edit?node=overview`)
      }
    />
  )
}
