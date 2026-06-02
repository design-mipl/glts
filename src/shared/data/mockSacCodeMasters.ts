import type { SacCodeMaster } from '@/shared/types/sacCodeMaster'

const AUDIT = {
  createdBy: 'Rajan Mehta',
  updatedBy: 'Rajan Mehta',
  createdAt: '2025-11-10T08:00:00.000Z',
  updatedAt: '2026-02-01T10:00:00.000Z',
}

export const SEED_SAC_CODE_MASTERS: SacCodeMaster[] = [
  {
    id: 'sac-998559',
    sacCode: '998559',
    sacTitle: 'Visa processing services',
    description: 'Visa application and processing support',
    category: 'Visa Services',
    defaultGstRateId: 'gst-18',
    defaultTdsSectionId: 'tds-194j',
    applicableFor: ['marine', 'corporate', 'retail'],
    status: 'active',
    ...AUDIT,
  },
  {
    id: 'sac-998514',
    sacCode: '998514',
    sacTitle: 'Documentation and attestation',
    description: 'Document preparation and embassy submission',
    category: 'Documentation',
    defaultGstRateId: 'gst-18',
    defaultTdsSectionId: null,
    applicableFor: ['corporate', 'retail', 'b2b'],
    status: 'active',
    createdBy: AUDIT.createdBy,
    updatedBy: AUDIT.updatedBy,
    createdAt: '2025-11-12T08:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'sac-998599',
    sacCode: '998599',
    sacTitle: 'Travel consultation',
    description: 'Advisory and consultation services',
    category: 'Consultation',
    defaultGstRateId: 'gst-12',
    defaultTdsSectionId: 'tds-194j',
    applicableFor: ['marine', 'b2b'],
    status: 'active',
    createdBy: AUDIT.createdBy,
    updatedBy: AUDIT.updatedBy,
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z',
  },
]
