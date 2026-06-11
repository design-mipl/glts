import { useParams } from 'react-router-dom'
import { CountryConfigWorkspace } from '../components/workspace/CountryConfigWorkspace'

export function CountryConfigWorkspacePage() {
  const { countryId } = useParams<{ countryId: string }>()

  if (!countryId) return null

  return <CountryConfigWorkspace countryId={countryId} mode="view" />
}
