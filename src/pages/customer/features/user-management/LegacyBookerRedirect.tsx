import { Navigate, useParams } from 'react-router-dom'

export function LegacyBookerRedirect() {
  const { bookerId } = useParams()
  return <Navigate to={`../users/bookers/${bookerId ?? ''}`} replace relative="path" />
}
