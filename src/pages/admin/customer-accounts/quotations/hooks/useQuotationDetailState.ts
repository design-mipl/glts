import { useCallback, useEffect, useState } from 'react'
import { quotationService } from '@/shared/services/quotationService'
import type { QuotationRecord } from '@/shared/types/quotation'

export function useQuotationDetailState(quotationId: string | undefined) {
  const [loading, setLoading] = useState(true)
  const [quotation, setQuotation] = useState<QuotationRecord>()

  const reload = useCallback(async () => {
    if (!quotationId) {
      setQuotation(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    setQuotation(quotationService.getById(quotationId))
    setLoading(false)
  }, [quotationId])

  useEffect(() => {
    void reload()
  }, [reload])

  return { loading, quotation, reload }
}
