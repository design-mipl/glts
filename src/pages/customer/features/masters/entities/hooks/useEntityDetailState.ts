import { useCallback, useEffect, useState } from 'react'
import { entityMasterService } from '@/shared/services/entityMasterService'
import type { EntityMaster } from '@/shared/types/entityMaster'

export function useEntityDetailState(entityId: string | undefined) {
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<EntityMaster | undefined>()

  const reload = useCallback(() => {
    if (!entityId) {
      setEntity(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    const record = entityMasterService.getById(entityId)
    setEntity(record)
    setLoading(false)
  }, [entityId])

  useEffect(() => {
    reload()
  }, [reload])

  return { loading, entity, reload }
}
