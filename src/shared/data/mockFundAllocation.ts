import { buildPassengerId } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import type { FundAllocationOverlay } from '@/shared/types/fundAllocation'

function overlay(partial: FundAllocationOverlay): FundAllocationOverlay {
  return {
    ...partial,
    selectedServices: partial.selectedServices.map(line => ({ ...line })),
  }
}

/** Seed overlays keyed by passenger id (`applicationId:applicantId`). */
export const SEED_FUND_ALLOCATION_OVERLAYS: Record<string, FundAllocationOverlay> = {
  [buildPassengerId('GLTS-APP-2026-778', 'GLTS-APP-2026-778-APL-001')]: overlay({
    allocationStatus: 'allocated',
    totalAmount: 2200,
    allocatedAmount: 2200,
    selectedServices: [
      {
        id: 'vfs-seed-778-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 2200,
        gstIncluded: true,
      },
    ],
    cardId: 'card-anna-icici-0022',
    allocatedAt: '2026-02-12T10:30:00.000Z',
    allocationNotes: 'VFS service charges allocated for UAE e-Visa submission.',
    lastUpdated: '2026-02-12T10:30:00.000Z',
  }),
  [buildPassengerId('GLTS-APP-2026-847', 'GLTS-APP-2026-847-APL-001')]: overlay({
    allocationStatus: 'allocated',
    totalAmount: 9800,
    allocatedAmount: 9800,
    selectedServices: [
      {
        id: 'vfs-seed-847-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 2200,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-847-2',
        embassyFeeServiceId: 'visa-fee',
        serviceName: 'Visa Fee',
        amount: 7600,
        gstIncluded: false,
      },
    ],
    cardId: 'card-keith-icici-1005',
    allocatedAt: '2026-02-12T11:00:00.000Z',
    allocationNotes: 'France sticker visa — fund allocation before VFS submission.',
    lastUpdated: '2026-02-12T11:00:00.000Z',
  }),
  [buildPassengerId('GLTS-BAT-2026-041', 'GLTS-APL-001')]: overlay({
    allocationStatus: 'allocated',
    totalAmount: 1850,
    allocatedAmount: 1800,
    selectedServices: [
      {
        id: 'vfs-seed-041-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 1850,
        gstIncluded: true,
      },
    ],
    cardId: 'card-keith-icici-1005',
    allocatedAt: '2026-02-14T14:15:00.000Z',
    allocationNotes: 'Schengen crew batch — approximate allocation applied.',
    lastUpdated: '2026-02-14T14:15:00.000Z',
  }),
}
