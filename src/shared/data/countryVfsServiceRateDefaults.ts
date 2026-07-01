import type { CountryVfsServiceRate } from '@/shared/types/countryMaster'

const DEFAULT_VFS_SERVICE_RATE_ROWS = [
  { id: 'vfs-seed-vfs-fees', serviceName: 'VFS Fees', amount: 2750 },
  { id: 'vfs-seed-visa-fees-standard', serviceName: 'Visa Fees', amount: 9900 },
  { id: 'vfs-seed-courier-service', serviceName: 'Courier Service', amount: 485 },
  { id: 'vfs-seed-courier-assurance', serviceName: 'Courier Assurance', amount: 775 },
  { id: 'vfs-seed-sms', serviceName: 'SMS', amount: 283 },
  { id: 'vfs-seed-premium-lounge-standard', serviceName: 'Premium Lounge', amount: 4765 },
  { id: 'vfs-seed-visa-fees-premium', serviceName: 'Visa Fees', amount: 18900 },
  { id: 'vfs-seed-document-uploading', serviceName: 'Document Uploading', amount: 2400 },
  { id: 'vfs-seed-priority', serviceName: 'Priority', amount: 65000 },
  { id: 'vfs-seed-premium-lounge-alt', serviceName: 'Premium Lounge', amount: 5900 },
  { id: 'vfs-seed-super-priority', serviceName: 'Super Priority', amount: 115000 },
] as const

export function getDefaultVfsServiceRates(): CountryVfsServiceRate[] {
  return DEFAULT_VFS_SERVICE_RATE_ROWS.map((row, index) => ({
    id: row.id,
    serviceName: row.serviceName,
    amount: row.amount,
    gstIncluded: false,
    sortOrder: index,
  }))
}

export function cloneDefaultVfsServiceRates(): CountryVfsServiceRate[] {
  return structuredClone(getDefaultVfsServiceRates())
}
