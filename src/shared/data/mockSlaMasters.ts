import type { SlaHoursPlan, SlaMaster } from '@/shared/types/slaMaster'

function appPlan(
  e2eHours: number,
  verification: number,
  submission: number,
  payment: number,
  vfs: number,
): SlaHoursPlan {
  return {
    e2eHours,
    stages: {
      draft: 0,
      verification_pending: verification,
      online_submission_pending: submission,
      pending_payment: payment,
      vfs_submission_pending: vfs,
      collection_pending: 0,
      collected: 0,
      dispatched: 0,
    },
  }
}

/** Seed Application Management SLAs aligned to listing tabs. */
export const SEED_SLA_MASTERS: SlaMaster[] = [
  {
    id: 'sla-app-marine',
    domain: 'application_management',
    segment: 'marine',
    name: 'Application management · Marine applications',
    status: 'active',
    single: appPlan(48, 12, 8, 8, 20),
    bulkBands: {
      '0_10': appPlan(72, 18, 12, 12, 30),
      '11_20': appPlan(96, 24, 16, 16, 40),
      '21_plus': appPlan(120, 30, 20, 20, 50),
    },
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-03-20T11:30:00.000Z',
  },
  {
    id: 'sla-app-corporate',
    domain: 'application_management',
    segment: 'corporate',
    name: 'Application management · Corporate applications',
    status: 'active',
    single: appPlan(40, 10, 8, 6, 16),
    bulkBands: {
      '0_10': appPlan(64, 16, 12, 10, 26),
      '11_20': appPlan(88, 22, 16, 14, 36),
      '21_plus': appPlan(112, 28, 20, 18, 46),
    },
    createdBy: 'Priya Sharma',
    updatedBy: 'Priya Sharma',
    createdAt: '2026-01-18T10:00:00.000Z',
    updatedAt: '2026-04-02T14:00:00.000Z',
  },
  {
    id: 'sla-app-b2b',
    domain: 'application_management',
    segment: 'b2b',
    name: 'Application management · B2B agents applications',
    status: 'active',
    single: appPlan(36, 10, 6, 6, 14),
    bulkBands: {
      '0_10': appPlan(60, 15, 10, 10, 25),
      '11_20': appPlan(84, 21, 14, 14, 35),
      '21_plus': appPlan(108, 27, 18, 18, 45),
    },
    createdBy: 'Rajan Mehta',
    updatedBy: 'Rajan Mehta',
    createdAt: '2026-02-01T08:30:00.000Z',
    updatedAt: '2026-03-28T09:45:00.000Z',
  },
]
