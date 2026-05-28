import { useEffect, useState } from 'react'
import { enquiryService } from '@/shared/services/enquiryService'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export function useEnquiryDetailState(enquiryId: string | undefined) {
  const [loading, setLoading] = useState(true)
  const [enquiry, setEnquiry] = useState<EnquiryRecord | undefined>()

  const reload = async () => {
    if (!enquiryId) return
    setLoading(true)
    const next = await enquiryService.getById(enquiryId)
    setEnquiry(next)
    setLoading(false)
  }

  useEffect(() => {
    void reload()
  }, [enquiryId])

  return { loading, enquiry, reload }
}
