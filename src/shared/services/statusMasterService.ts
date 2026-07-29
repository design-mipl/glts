import { SEED_STATUS_MASTERS } from '@/shared/data/mockStatusMasters'
import type { StatusMaster } from '@/shared/types/statusMaster'
import type { SelectOption } from '@/shared/types/taxMaster'

const statusStore: StatusMaster[] = [...SEED_STATUS_MASTERS]

export const statusMasterService = {
  list(): StatusMaster[] {
    return [...statusStore].sort((a, b) => a.name.localeCompare(b.name))
  },

  getById(id: string): StatusMaster | undefined {
    return statusStore.find((row) => row.id === id)
  },

  listActiveOptions(): SelectOption[] {
    return statusStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((row) => ({ value: row.id, label: row.name }))
  },
}
