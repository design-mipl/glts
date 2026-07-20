import { buildPassengerId } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import { GLTS_BATCH_IDS } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { FundAllocationOverlay } from '@/shared/types/fundAllocation'
import { FUND_TRANSFER_DEFAULT_SOURCE } from '@/shared/types/fundAllocation'

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

const BULK_OVER_ALLOCATION_SERVICES = [
  {
    id: 'vfs-seed-bulk-1',
    embassyFeeServiceId: 'vfs-booking',
    serviceName: 'VFS Booking Service',
    amount: 1850,
    gstIncluded: true,
  },
  {
    id: 'vfs-seed-bulk-2',
    embassyFeeServiceId: 'visa-fee',
    serviceName: 'Visa Fee',
    amount: 6150,
    gstIncluded: false,
  },
] as const

const BULK_OVER_ALLOCATION_FUND_TRANSFER = {
  fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
  transferType: 'bank_transfer' as const,
  transferDate: '2026-02-19',
  receivedBy: 'Karan Mehta',
  destinationBankAccount: 'icici-delhi-1005',
  assignedCardId: '',
  paymentReference: 'BULK-041-40000',
  paymentRemark: 'Bulk allocation — ₹40,000 total across 4 passengers (team bank float).',
}

const ALLOC_BATCH_SCHENGEN_BULK_40000 = 'alloc-batch-schengen-041-40000'
const ALLOC_BATCH_778_SINGLE = 'alloc-batch-778-single'
const ALLOC_BATCH_847_SINGLE = 'alloc-batch-847-single'
const ALLOC_BATCH_041_BRENDAN = 'alloc-batch-041-brendan'
const ALLOC_BATCH_MAR_1025_BULK = 'alloc-batch-mar-1025-bulk'
const ALLOC_BATCH_731_SINGLE = 'alloc-batch-731-single'
const ALLOC_BATCH_726_SINGLE = 'alloc-batch-726-single'

const MAR_1025_BULK_SERVICES = [
  {
    id: 'vfs-seed-mar-bulk-1',
    embassyFeeServiceId: 'vfs-booking',
    serviceName: 'VFS Booking Service',
    amount: 2200,
    gstIncluded: true,
  },
  {
    id: 'vfs-seed-mar-bulk-2',
    embassyFeeServiceId: 'visa-fee',
    serviceName: 'Visa Fee',
    amount: 3800,
    gstIncluded: false,
  },
] as const

const MAR_1025_BULK_FUND_TRANSFER = {
  fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
  transferType: 'card' as const,
  transferDate: '2026-02-16',
  receivedBy: 'Anita Desai',
  destinationBankAccount: '',
  assignedCardId: 'card-anna-icici-0022',
  paymentReference: 'MAR-1025-21000',
  paymentRemark: 'Marine crew China batch — ₹21,000 total across 3 passengers.',
}

function marineBulkAllocatedPassenger(
  serviceIdPrefix: string,
  passengerLabel: string,
): FundAllocationOverlay {
  return overlay({
    allocationStatus: 'allocated',
    allocationBatchId: ALLOC_BATCH_MAR_1025_BULK,
    fundRequested: true,
    requestedAt: '2026-02-16T08:30:00.000Z',
    totalAmount: 6000,
    allocatedAmount: 7000,
    selectedServices: MAR_1025_BULK_SERVICES.map((line, index) => ({
      ...line,
      id: `${serviceIdPrefix}-${index + 1}`,
    })),
    cardId: 'card-anna-icici-0022',
    fundTransfer: { ...MAR_1025_BULK_FUND_TRANSFER },
    allocatedAt: '2026-02-16T10:00:00.000Z',
    allocationNotes: `China M Type crew — ${passengerLabel} · bulk ₹21,000 allocation (₹6,000 requested, ₹7,000 allocated).`,
    lastUpdated: '2026-02-16T10:00:00.000Z',
  })
}

function bulkOverAllocatedCrewPassenger(
  serviceIdPrefix: string,
  passengerLabel: string,
): FundAllocationOverlay {
  return overlay({
    allocationStatus: 'allocated',
    allocationBatchId: ALLOC_BATCH_SCHENGEN_BULK_40000,
    fundRequested: true,
    requestedAt: '2026-02-19T13:00:00.000Z',
    totalAmount: 8000,
    allocatedAmount: 10000,
    selectedServices: BULK_OVER_ALLOCATION_SERVICES.map((line, index) => ({
      ...line,
      id: `${serviceIdPrefix}-${index + 1}`,
    })),
    cardId: '',
    fundTransfer: { ...BULK_OVER_ALLOCATION_FUND_TRANSFER },
    allocatedAt: '2026-02-19T14:00:00.000Z',
    allocationNotes: `Schengen crew batch — ${passengerLabel} · bulk ₹40,000 allocation (₹8,000 requested, ₹10,000 allocated).`,
    lastUpdated: '2026-02-19T14:00:00.000Z',
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

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-002')]: bulkOverAllocatedCrewPassenger(
    'vfs-seed-041-2',
    'Sarah Miles',
  ),

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-003')]: bulkOverAllocatedCrewPassenger(
    'vfs-seed-041-3',
    'Hiroshi Tanaka',
  ),

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-004')]: bulkOverAllocatedCrewPassenger(
    'vfs-seed-041-4',
    'Priya Sharma',
  ),

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-005')]: bulkOverAllocatedCrewPassenger(
    'vfs-seed-041-5',
    'Mike Chen',
  ),

  // —— Allocated (completed fund allocation) ——

  [buildPassengerId('GLTS-APP-2026-778', 'GLTS-APP-2026-778-APL-001')]: overlay({
    allocationStatus: 'allocated',
    allocationBatchId: ALLOC_BATCH_778_SINGLE,
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
    allocationBatchId: ALLOC_BATCH_847_SINGLE,
    fundRequested: true,
    requestedAt: '2026-02-12T10:00:00.000Z',
    totalAmount: 8000,
    allocatedAmount: 10000,
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
        amount: 5800,
        gstIncluded: false,
      },
    ],
    cardId: 'card-keith-icici-1005',
    fundTransfer: {
      fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
      transferType: 'card',
      transferDate: '2026-02-12',
      receivedBy: 'Sneha Patel',
      destinationBankAccount: '',
      assignedCardId: 'card-keith-icici-1005',
      paymentReference: 'SGL-847-10000',
      paymentRemark: 'Approximate allocation — ₹8,000 requested, ₹10,000 allocated for VFS buffer.',
    },
    allocatedAt: '2026-02-12T11:00:00.000Z',
    allocationNotes: 'France sticker visa — approximate allocation (₹8,000 requested, ₹10,000 allocated).',
    lastUpdated: '2026-02-12T11:00:00.000Z',
  }),

  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-001')]: overlay({
    allocationStatus: 'allocated',
    allocationBatchId: ALLOC_BATCH_041_BRENDAN,
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

  [buildPassengerId('GLTS-MAR-1025', 'GLTS-APL-M1025-01')]: marineBulkAllocatedPassenger(
    'vfs-seed-mar-1',
    'Rajesh Kumar',
  ),

  [buildPassengerId('GLTS-MAR-1025', 'GLTS-APL-M1025-02')]: marineBulkAllocatedPassenger(
    'vfs-seed-mar-2',
    'Vikram Singh',
  ),

  [buildPassengerId('GLTS-MAR-1025', 'GLTS-APL-M1025-03')]: marineBulkAllocatedPassenger(
    'vfs-seed-mar-3',
    'Anil Mehta',
  ),

  [buildPassengerId('GLTS-APP-2026-731', 'GLTS-APP-2026-731-APL-001')]: overlay({
    allocationStatus: 'allocated',
    allocationBatchId: ALLOC_BATCH_731_SINGLE,
    fundRequested: true,
    requestedAt: '2026-02-15T07:00:00.000Z',
    totalAmount: 4500,
    allocatedAmount: 4500,
    selectedServices: [
      {
        id: 'vfs-seed-731-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 2200,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-731-2',
        embassyFeeServiceId: 'visa-fee',
        serviceName: 'Visa Fee',
        amount: 2300,
        gstIncluded: false,
      },
    ],
    cardId: 'card-anna-icici-0022',
    fundTransfer: {
      fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
      transferType: 'card',
      transferDate: '2026-02-15',
      receivedBy: 'Anita Desai',
      destinationBankAccount: '',
      assignedCardId: 'card-anna-icici-0022',
      paymentReference: 'SGL-731-4500',
      paymentRemark: 'Singapore crew multi-entry — exact allocation.',
    },
    allocatedAt: '2026-02-15T09:30:00.000Z',
    allocationNotes: 'Singapore crew multi-entry — VFS and visa fees allocated for Kenji Sato.',
    lastUpdated: '2026-02-15T09:30:00.000Z',
  }),

  [buildPassengerId('GLTS-APP-2026-726', 'GLTS-APP-2026-726-APL-001')]: overlay({
    allocationStatus: 'allocated',
    allocationBatchId: ALLOC_BATCH_726_SINGLE,
    fundRequested: true,
    requestedAt: '2026-02-13T11:30:00.000Z',
    totalAmount: 3200,
    allocatedAmount: 3500,
    selectedServices: [
      {
        id: 'vfs-seed-726-1',
        embassyFeeServiceId: 'vfs-booking',
        serviceName: 'VFS Booking Service',
        amount: 2200,
        gstIncluded: true,
      },
      {
        id: 'vfs-seed-726-2',
        embassyFeeServiceId: 'courier',
        serviceName: 'Courier Service',
        amount: 1000,
        gstIncluded: true,
      },
    ],
    cardId: 'card-keith-icici-1005',
    fundTransfer: {
      fundSource: FUND_TRANSFER_DEFAULT_SOURCE,
      transferType: 'bank_transfer',
      transferDate: '2026-02-13',
      receivedBy: 'Karan Mehta',
      destinationBankAccount: 'icici-delhi-1005',
      assignedCardId: '',
      paymentReference: 'UK-726-3500',
      paymentRemark: 'UK crew visa — approximate allocation with courier buffer.',
    },
    allocatedAt: '2026-02-13T13:00:00.000Z',
    allocationNotes: 'UK crew standard visa — approximate allocation (₹3,200 requested, ₹3,500 allocated).',
    lastUpdated: '2026-02-13T13:00:00.000Z',
  }),
}
