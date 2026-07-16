import { buildPassengerId } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import { GLTS_BATCH_IDS } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { FundAllocationOverlay } from '@/shared/types/fundAllocation'

function overlay(partial: FundAllocationOverlay): FundAllocationOverlay {
  return {
    ...partial,
    selectedServices: partial.selectedServices.map(line => ({ ...line })),
    fundTransfer: partial.fundTransfer ? { ...partial.fundTransfer } : undefined,
  }
}

function pendingRequest(
  partial: Omit<
    FundAllocationOverlay,
    'allocationStatus' | 'fundRequested' | 'allocatedAmount' | 'cardId' | 'allocatedAt'
  > &
    Partial<Pick<FundAllocationOverlay, 'allocationNotes'>>,
): FundAllocationOverlay {
  return overlay({
    allocationStatus: 'pending_allocation',
    fundRequested: true,
    allocatedAmount: 0,
    cardId: '',
    allocatedAt: '',
    ...partial,
    allocationNotes: partial.allocationNotes ?? '',
  })
}

/** Seed overlays keyed by passenger id (`applicationId:applicantId`). */
export const SEED_FUND_ALLOCATION_OVERLAYS: Record<string, FundAllocationOverlay> = {
  // —— Pending allocation (fund requested from Assignment & Priority) ——

  [buildPassengerId('GLTS-APP-2026-790', 'GLTS-APP-2026-790-APL-001')]: pendingRequest({
    requestedAt: '2026-02-18T08:30:00.000Z',
    totalAmount: 6050,
    selectedServices: [
      {
        id: 'vfs-seed-790-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 1850,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-790-2',
        embassyFeeServiceId: 'visa-fee',
        serviceName: 'Visa Fee',
        amount: 4200,
        gstIncluded: false,
      },
    ],
    allocationNotes: 'Japan eVisa — requested during assignment for Oliver Grant.',
    lastUpdated: '2026-02-18T08:30:00.000Z',
  }),

  [buildPassengerId('GLTS-APP-2026-744', 'GLTS-APP-2026-744-APL-001')]: pendingRequest({
    requestedAt: '2026-02-19T09:15:00.000Z',
    totalAmount: 2850,
    selectedServices: [
      {
        id: 'vfs-seed-744-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 2200,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-744-2',
        embassyFeeServiceId: 'courier',
        serviceName: 'Courier Service',
        amount: 650,
        gstIncluded: true,
      },
    ],
    allocationNotes: 'France crew visa — fund request pending finance release.',
    lastUpdated: '2026-02-19T09:15:00.000Z',
  }),

  [buildPassengerId('GLTS-APP-2026-802', 'GLTS-APP-2026-802-APL-001')]: pendingRequest({
    requestedAt: '2026-02-17T11:00:00.000Z',
    totalAmount: 4050,
    selectedServices: [
      {
        id: 'vfs-seed-802-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 2200,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-802-2',
        embassyFeeServiceId: 'visa-fee',
        serviceName: 'Visa Fee',
        amount: 1200,
        gstIncluded: false,
      },
      {
        id: 'vfs-seed-802-3',
        embassyFeeServiceId: 'sms',
        serviceName: 'SMS',
        amount: 150,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-802-4',
        embassyFeeServiceId: 'courier-assurance',
        serviceName: 'Courier Assurance',
        amount: 500,
        gstIncluded: true,
      },
    ],
    allocationNotes: 'Singapore business visa — B2B agent priority client.',
    lastUpdated: '2026-02-17T11:00:00.000Z',
  }),

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-002')]: pendingRequest({
    requestedAt: '2026-02-18T10:00:00.000Z',
    totalAmount: 9450,
    selectedServices: [
      {
        id: 'vfs-seed-041-2-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 1850,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-041-2-2',
        embassyFeeServiceId: 'visa-fee',
        serviceName: 'Visa Fee',
        amount: 7600,
        gstIncluded: false,
      },
    ],
    allocationNotes: 'Schengen crew batch — Sarah Miles fund request.',
    lastUpdated: '2026-02-18T10:00:00.000Z',
  }),

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-003')]: pendingRequest({
    requestedAt: '2026-02-18T10:05:00.000Z',
    totalAmount: 2350,
    selectedServices: [
      {
        id: 'vfs-seed-041-3-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 1850,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-041-3-2',
        embassyFeeServiceId: 'sms',
        serviceName: 'SMS',
        amount: 150,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-041-3-3',
        embassyFeeServiceId: 'courier-assurance',
        serviceName: 'Courier Assurance',
        amount: 350,
        gstIncluded: true,
      },
    ],
    allocationNotes: 'Schengen crew batch — Hiroshi Tanaka fund request.',
    lastUpdated: '2026-02-18T10:05:00.000Z',
  }),

  // —— Allocated (completed fund allocation) ——

  [buildPassengerId('GLTS-APP-2026-778', 'GLTS-APP-2026-778-APL-001')]: overlay({
    allocationStatus: 'allocated',
    fundRequested: true,
    requestedAt: '2026-02-12T09:00:00.000Z',
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
    fundRequested: true,
    requestedAt: '2026-02-12T10:00:00.000Z',
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

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-001')]: overlay({
    allocationStatus: 'allocated',
    fundRequested: true,
    requestedAt: '2026-02-14T13:00:00.000Z',
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
    allocationNotes: 'Schengen crew batch — approximate allocation applied for Brendan Ryan.',
    lastUpdated: '2026-02-14T14:15:00.000Z',
  }),
}
