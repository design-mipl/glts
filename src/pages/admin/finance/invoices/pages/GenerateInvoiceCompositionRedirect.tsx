import { Navigate, useLocation, useSearchParams } from 'react-router-dom'

const GENERATE_PATH = '/admin/finance/invoices/generate'

/** Preserves legacy `/generate/composition` URLs after stepper consolidation. */
export function GenerateInvoiceCompositionRedirect() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const next = new URLSearchParams(searchParams)
  next.set('step', '1')
  const query = next.toString()
  return (
    <Navigate
      to={query ? `${GENERATE_PATH}?${query}` : `${GENERATE_PATH}?step=1`}
      replace
      state={location.state}
    />
  )
}
