import type { ServiceType } from '@/shared/types/serviceMaster'

export const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'glts', label: 'GLTS' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'vfs', label: 'VFS' },
]

export const serviceTypeLabel: Record<ServiceType, string> = {
  glts: 'GLTS',
  vendor: 'Vendor',
  vfs: 'VFS',
}
