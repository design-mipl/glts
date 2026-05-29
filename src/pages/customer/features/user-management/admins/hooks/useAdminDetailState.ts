import { useCallback, useEffect, useState } from 'react'
import { adminManagementService } from '@/shared/services/adminManagementService'
import type { AdminUser } from '@/shared/types/adminUser'

export function useAdminDetailState(adminId?: string) {
  const [admin, setAdmin] = useState<AdminUser | undefined>(() =>
    adminId ? adminManagementService.getById(adminId) : undefined,
  )

  const reload = useCallback(() => {
    if (!adminId) {
      setAdmin(undefined)
      return
    }
    setAdmin(adminManagementService.getById(adminId))
  }, [adminId])

  useEffect(() => {
    reload()
  }, [reload])

  return { admin, reload }
}
