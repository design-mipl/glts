import { useCallback, useEffect, useState } from 'react'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { VesselMaster } from '@/shared/types/vesselMaster'

export function useVesselDetailState(vesselId: string | undefined) {
  const [loading, setLoading] = useState(true)
  const [vessel, setVessel] = useState<VesselMaster | undefined>()

  const reload = useCallback(() => {
    if (!vesselId) {
      setVessel(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    setVessel(vesselMasterService.getById(vesselId))
    setLoading(false)
  }, [vesselId])

  useEffect(() => {
    reload()
  }, [reload])

  return { loading, vessel, reload }
}
