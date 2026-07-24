import type { EmbassyVfsFeeRateCard } from '@/shared/types/embassyVfsFeeMaster'

const AUDIT = {
  createdAt: '2026-01-10T08:00:00.000Z',
  updatedAt: '2026-06-01T10:30:00.000Z',
  createdBy: 'Rajan Mehta',
  updatedBy: 'Priya Sharma',
}

function service(
  id: string,
  serviceName: string,
  amount: number,
  enabled = true,
): EmbassyVfsFeeRateCard['services'][number] {
  return { id, serviceName, amount, enabled }
}

/** France · Sticker Type C — demo card aligned with marine submission UX. */
const FRANCE_STICKER_TYPE_C: EmbassyVfsFeeRateCard = {
  id: 'evfs-fr-sticker-c',
  country: 'France',
  visaType: 'Sticker · Type C',
  status: 'active',
  notes: 'VFS France short-stay sticker visa service catalogue.',
  ...AUDIT,
  services: [
    service('evfs-fr-01', 'Premium Lounge', 1800),
    service('evfs-fr-02', 'SMS', 100),
    service('evfs-fr-03', 'Courier Assurance', 300),
    service('evfs-fr-04', 'Document Uploading', 500),
    service('evfs-fr-05', 'Priority', 2500),
    service('evfs-fr-06', 'Super Priority', 4000),
    service('evfs-fr-07', 'Biometrics', 850),
    service('evfs-fr-08', 'One-Way Courier', 450),
    service('evfs-fr-09', 'Two-Way Courier', 800),
  ],
}

/** Generic fallback when no country/visa card is configured yet. */
export const DEFAULT_EMBASSY_VFS_FEE_RATE_CARD: EmbassyVfsFeeRateCard = {
  id: 'evfs-default',
  country: 'All countries',
  visaType: 'All visa types',
  status: 'active',
  notes: 'Fallback catalogue until Embassy / VFS Fee Master is configured for this route.',
  ...AUDIT,
  services: [
    service('evfs-def-01', 'VFS fees', 1200),
    service('evfs-def-02', 'Visa fees', 8500),
    service('evfs-def-03', 'Courier Service', 650),
    service('evfs-def-04', 'Courier Assurance', 350),
    service('evfs-def-05', 'SMS', 150),
    service('evfs-def-06', 'Premium Lounge', 2200),
    service('evfs-def-07', 'Document uploading', 450),
    service('evfs-def-08', 'Priority', 1800),
    service('evfs-def-09', 'Super Priority', 3200),
    service('evfs-def-10', 'Biometrics', 2500),
    service('evfs-def-11', 'One way', 900),
    service('evfs-def-12', 'Two Way', 1400),
  ],
}

export const SEED_EMBASSY_VFS_FEE_RATE_CARDS: EmbassyVfsFeeRateCard[] = [
  FRANCE_STICKER_TYPE_C,
  DEFAULT_EMBASSY_VFS_FEE_RATE_CARD,
]
