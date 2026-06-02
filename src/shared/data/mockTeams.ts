import type { TeamMaster } from '@/shared/types/teamMaster'

export const SEED_TEAMS: TeamMaster[] = [
  {
    id: 'team-ops',
    name: 'Operations',
    description: 'Handles visa processing, document verification, and ground operations.',
    status: 'active',
    createdBy: 'Rajan Mehta',
    updatedBy: 'Rajan Mehta',
    createdAt: '2025-11-01T09:00:00.000Z',
    updatedAt: '2026-01-10T14:30:00.000Z',
  },
  {
    id: 'team-finance',
    name: 'Finance & Billing',
    description: 'Billing, invoicing, payments, and reconciliation workflows.',
    status: 'active',
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2025-11-05T10:15:00.000Z',
    updatedAt: '2026-02-15T11:20:00.000Z',
  },
  {
    id: 'team-sales',
    name: 'Sales & Accounts',
    description: 'Enquiry handling, quotations, agreements, and corporate account management.',
    status: 'active',
    createdBy: 'Priya Sharma',
    updatedBy: 'Priya Sharma',
    createdAt: '2025-12-01T08:45:00.000Z',
    updatedAt: '2026-03-01T16:00:00.000Z',
  },
  {
    id: 'team-support',
    name: 'Customer Support',
    description: 'Support tickets and customer communication resolution.',
    status: 'inactive',
    createdBy: 'Rajan Mehta',
    updatedBy: 'Rajan Mehta',
    createdAt: '2025-10-20T12:00:00.000Z',
    updatedAt: '2026-01-28T09:30:00.000Z',
  },
]
