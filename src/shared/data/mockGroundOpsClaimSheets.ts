import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'

function bankKpis(partial: {
  allocatedAmount: number
  totalWithdrawn: number
  availableInBank: number
  inHandCash: number
  expensesIncurred: number
  bankAllocationCount: number
  settlementDate: string
  priorBankDate: string
}): FundBankSettlementSummary {
  return {
    settlementDate: partial.settlementDate,
    priorBankDate: partial.priorBankDate,
    closingBankBalancePrior: Math.max(
      0,
      partial.availableInBank + partial.totalWithdrawn - partial.allocatedAmount,
    ),
    fundsTransferred: partial.allocatedAmount,
    availableBankBalance: partial.availableInBank + partial.totalWithdrawn,
    cashWithdrawn: partial.totalWithdrawn,
    closingBankBalance: partial.availableInBank,
    openingCashBalance: Math.max(
      0,
      partial.inHandCash + partial.expensesIncurred - partial.totalWithdrawn,
    ),
    totalCashAvailable: Math.max(0, partial.inHandCash + partial.expensesIncurred),
    expensesIncurred: partial.expensesIncurred,
    closingCashBalance: partial.inHandCash,
    allocatedAmount: partial.allocatedAmount,
    totalWithdrawn: partial.totalWithdrawn,
    availableInBank: partial.availableInBank,
    inHandCash: partial.inHandCash,
    settlementAmount: partial.inHandCash,
    bankAllocationCount: partial.bankAllocationCount,
  }
}

function nonBankKpis(partial: {
  allocatedAmount: number
  expensesIncurred: number
  settlementAmount: number
}): FundBankSettlementSummary {
  return {
    settlementDate: '',
    priorBankDate: '',
    closingBankBalancePrior: 0,
    fundsTransferred: 0,
    availableBankBalance: 0,
    cashWithdrawn: 0,
    closingBankBalance: 0,
    openingCashBalance: 0,
    totalCashAvailable: 0,
    expensesIncurred: partial.expensesIncurred,
    closingCashBalance: 0,
    allocatedAmount: partial.allocatedAmount,
    totalWithdrawn: 0,
    availableInBank: 0,
    inHandCash: 0,
    settlementAmount: partial.settlementAmount,
    bankAllocationCount: 0,
  }
}

/**
 * Seed claim sheets for Ground Ops / Finance review demos.
 * Case snapshots are frozen copies (aligned with completed/dispatched ops desk records).
 */
export const SEED_GROUND_OPS_CLAIM_SHEETS: GroundOpsClaimSheet[] = [
  {
    id: 'gcs-seed-1',
    claimNumber: 'CS-2026-0001',
    status: 'submitted',
    generatedBy: 'Priya Sharma',
    generatedAt: '2026-06-10T08:30:00.000Z',
    team: 'Mumbai Team',
    fundTransferType: 'bank_transfer',
    kpis: bankKpis({
      allocatedAmount: 43500,
      totalWithdrawn: 20500,
      availableInBank: 23000,
      inHandCash: 8500,
      expensesIncurred: 32000,
      bankAllocationCount: 3,
      settlementDate: '2026-06-10',
      priorBankDate: '2026-06-09',
    }),
    cases: [
      {
        caseId: 'op-case-008-01',
        operationalId: 'GLTS-M-2026-0075-01',
        passengerName: 'Dinesh Rao',
        applicationId: 'GLTS-M-2026-0075',
        companyName: 'Coastal Logistics Crew',
        country: 'Italy',
        visaType: 'Schengen Seafarer',
        services: [
          { serviceName: 'Biometrics Coordination', amount: 2500, receiptFileName: 'biometrics-rao.pdf' },
          { serviceName: 'VFS Support', amount: 1800, receiptFileName: 'vfs-rao.pdf' },
          { serviceName: 'Courier', amount: 650, receiptFileName: 'courier-rao.pdf' },
          { serviceName: 'Local Travel', amount: 1200 },
          { serviceName: 'Printing', amount: 350 },
        ],
        additionalExpenses: [
          {
            serviceName: 'Extra photocopy pack',
            amount: 200,
            receiptFileName: 'extra-copy-rao.pdf',
          },
        ],
        dispatchCharge: 0,
        caseExpenseTotal: 6700,
        proofDocuments: [
          {
            id: 'gcs-seed-1-p1',
            label: 'Biometrics Coordination receipt',
            fileName: 'biometrics-rao.pdf',
            source: 'service',
            caseId: 'op-case-008-01',
          },
          {
            id: 'gcs-seed-1-p2',
            label: 'VFS Support receipt',
            fileName: 'vfs-rao.pdf',
            source: 'service',
            caseId: 'op-case-008-01',
          },
          {
            id: 'gcs-seed-1-p3',
            label: 'Extra photocopy pack receipt',
            fileName: 'extra-copy-rao.pdf',
            source: 'additional_expense',
            caseId: 'op-case-008-01',
          },
        ],
      },
      {
        caseId: 'op-case-008-02',
        operationalId: 'GLTS-M-2026-0075-02',
        passengerName: 'Kunal Shah',
        applicationId: 'GLTS-M-2026-0075',
        companyName: 'Coastal Logistics Crew',
        country: 'Italy',
        visaType: 'Schengen Seafarer',
        services: [
          { serviceName: 'Biometrics Coordination', amount: 2500 },
          { serviceName: 'VFS Support', amount: 1800 },
          { serviceName: 'Courier', amount: 650, receiptFileName: 'courier-shah.pdf' },
          { serviceName: 'Local Travel', amount: 1200 },
          { serviceName: 'Printing', amount: 350 },
        ],
        additionalExpenses: [],
        dispatchCharge: 0,
        caseExpenseTotal: 6500,
        proofDocuments: [
          {
            id: 'gcs-seed-1-p4',
            label: 'Courier receipt',
            fileName: 'courier-shah.pdf',
            source: 'service',
            caseId: 'op-case-008-02',
          },
        ],
      },
    ],
    otherExpenses: [
      {
        id: 'gcs-seed-1-o1',
        description: 'Team local conveyance (batch day)',
        amount: 900,
        proofFileName: 'conveyance-june.pdf',
      },
      {
        id: 'gcs-seed-1-o2',
        description: 'Urgent printouts — embassy pack',
        amount: 450,
      },
    ],
    caseExpensesTotal: 13200,
    otherExpensesTotal: 1350,
    grandTotal: 14550,
    proofDocuments: [
      {
        id: 'gcs-seed-1-p1',
        label: 'Biometrics Coordination receipt',
        fileName: 'biometrics-rao.pdf',
        source: 'service',
        caseId: 'op-case-008-01',
      },
      {
        id: 'gcs-seed-1-p2',
        label: 'VFS Support receipt',
        fileName: 'vfs-rao.pdf',
        source: 'service',
        caseId: 'op-case-008-01',
      },
      {
        id: 'gcs-seed-1-p3',
        label: 'Extra photocopy pack receipt',
        fileName: 'extra-copy-rao.pdf',
        source: 'additional_expense',
        caseId: 'op-case-008-01',
      },
      {
        id: 'gcs-seed-1-p4',
        label: 'Courier receipt',
        fileName: 'courier-shah.pdf',
        source: 'service',
        caseId: 'op-case-008-02',
      },
      {
        id: 'gcs-seed-1-p5',
        label: 'Team local conveyance (batch day)',
        fileName: 'conveyance-june.pdf',
        source: 'claim_other',
      },
    ],
    notes: 'Schengen crew Italy batch — Mumbai desk weekly claim.',
  },
  {
    id: 'gcs-seed-2',
    claimNumber: 'CS-2026-0002',
    status: 'under_review',
    generatedBy: 'Karan Mehta',
    generatedAt: '2026-06-18T16:10:00.000Z',
    team: 'Mumbai Team',
    fundTransferType: 'bank_transfer',
    kpis: bankKpis({
      allocatedAmount: 43500,
      totalWithdrawn: 25000,
      availableInBank: 18500,
      inHandCash: 6200,
      expensesIncurred: 38800,
      bankAllocationCount: 4,
      settlementDate: '2026-06-18',
      priorBankDate: '2026-06-17',
    }),
    cases: [
      {
        caseId: 'op-case-001-03',
        operationalId: 'GLTS-M-2026-0142-03',
        passengerName: 'Ravi Nair',
        applicationId: 'GLTS-M-2026-0142',
        companyName: 'Oceanic Crew Services',
        country: 'China',
        visaType: 'M Visa',
        services: [
          { serviceName: 'Courier', amount: 650, receiptFileName: 'courier-nair.pdf' },
          { serviceName: 'VFS Support', amount: 1800 },
          { serviceName: 'Printing', amount: 350 },
        ],
        additionalExpenses: [],
        dispatchCharge: 650,
        caseExpenseTotal: 3450,
        proofDocuments: [
          {
            id: 'gcs-seed-2-p1',
            label: 'Courier receipt',
            fileName: 'courier-nair.pdf',
            source: 'service',
            caseId: 'op-case-001-03',
          },
          {
            id: 'gcs-seed-2-p2',
            label: 'Dispatch AWB proof',
            fileName: 'awb-bd882244119.pdf',
            source: 'dispatch',
            caseId: 'op-case-001-03',
          },
        ],
      },
    ],
    otherExpenses: [
      {
        id: 'gcs-seed-2-o1',
        description: 'Blue Dart counter surcharge',
        amount: 150,
        proofFileName: 'bluedart-surcharge.pdf',
      },
    ],
    caseExpensesTotal: 3450,
    otherExpensesTotal: 150,
    grandTotal: 3600,
    proofDocuments: [
      {
        id: 'gcs-seed-2-p1',
        label: 'Courier receipt',
        fileName: 'courier-nair.pdf',
        source: 'service',
        caseId: 'op-case-001-03',
      },
      {
        id: 'gcs-seed-2-p2',
        label: 'Dispatch AWB proof',
        fileName: 'awb-bd882244119.pdf',
        source: 'dispatch',
        caseId: 'op-case-001-03',
      },
      {
        id: 'gcs-seed-2-p3',
        label: 'Blue Dart counter surcharge',
        fileName: 'bluedart-surcharge.pdf',
        source: 'claim_other',
      },
    ],
    notes: 'Courier dispatch claim for Ravi Nair passport handoff.',
  },
  {
    id: 'gcs-seed-3',
    claimNumber: 'CS-2026-0003',
    status: 'approved',
    generatedBy: 'Anita Desai',
    generatedAt: '2026-06-09T14:00:00.000Z',
    team: 'Mumbai Team',
    fundTransferType: 'card',
    kpis: nonBankKpis({
      allocatedAmount: 4500,
      expensesIncurred: 4000,
      settlementAmount: -500,
    }),
    cases: [
      {
        caseId: 'op-case-014-07',
        operationalId: 'GLTS-M-2026-0172-07',
        passengerName: 'Xin Wu',
        applicationId: 'GLTS-M-2026-0172',
        companyName: 'Sterling Crew Logistics',
        country: 'China',
        visaType: 'G Type Visa',
        services: [
          { serviceName: 'Courier', amount: 650, receiptFileName: 'courier-wu.pdf' },
          { serviceName: 'VFS Support', amount: 1800, receiptFileName: 'vfs-wu.pdf' },
          { serviceName: 'Printing', amount: 350 },
        ],
        additionalExpenses: [
          {
            serviceName: 'Translation notarisation',
            amount: 1200,
            receiptFileName: 'notary-wu.pdf',
          },
        ],
        dispatchCharge: 0,
        caseExpenseTotal: 4000,
        proofDocuments: [
          {
            id: 'gcs-seed-3-p1',
            label: 'Courier receipt',
            fileName: 'courier-wu.pdf',
            source: 'service',
            caseId: 'op-case-014-07',
          },
          {
            id: 'gcs-seed-3-p2',
            label: 'VFS Support receipt',
            fileName: 'vfs-wu.pdf',
            source: 'service',
            caseId: 'op-case-014-07',
          },
          {
            id: 'gcs-seed-3-p3',
            label: 'Translation notarisation receipt',
            fileName: 'notary-wu.pdf',
            source: 'additional_expense',
            caseId: 'op-case-014-07',
          },
        ],
      },
    ],
    otherExpenses: [],
    caseExpensesTotal: 4000,
    otherExpensesTotal: 0,
    grandTotal: 4000,
    proofDocuments: [
      {
        id: 'gcs-seed-3-p1',
        label: 'Courier receipt',
        fileName: 'courier-wu.pdf',
        source: 'service',
        caseId: 'op-case-014-07',
      },
      {
        id: 'gcs-seed-3-p2',
        label: 'VFS Support receipt',
        fileName: 'vfs-wu.pdf',
        source: 'service',
        caseId: 'op-case-014-07',
      },
      {
        id: 'gcs-seed-3-p3',
        label: 'Translation notarisation receipt',
        fileName: 'notary-wu.pdf',
        source: 'additional_expense',
        caseId: 'op-case-014-07',
      },
    ],
    notes: 'Card-funded China G Type completed case — approved by Finance.',
  },
  {
    id: 'gcs-seed-4',
    claimNumber: 'CS-2026-0004',
    status: 'rejected',
    generatedBy: 'Lakshmi Iyer',
    generatedAt: '2026-06-05T11:20:00.000Z',
    team: 'Chennai Team',
    fundTransferType: 'upi',
    kpis: nonBankKpis({
      allocatedAmount: 3000,
      expensesIncurred: 3420,
      settlementAmount: 420,
    }),
    cases: [
      {
        caseId: 'op-case-015-06',
        operationalId: 'GLTS-M-2026-0180-06',
        passengerName: 'Felix Braun',
        applicationId: 'GLTS-M-2026-0180',
        companyName: 'Hansa Marine Crewing',
        country: 'Germany',
        visaType: 'National D Visa',
        services: [
          { serviceName: 'Courier', amount: 650, receiptFileName: 'courier-braun.pdf' },
          { serviceName: 'VFS Support', amount: 1800 },
          { serviceName: 'Printing', amount: 350 },
        ],
        additionalExpenses: [
          {
            serviceName: 'Same-day courier upgrade',
            amount: 500,
            receiptFileName: 'express-braun.pdf',
          },
        ],
        dispatchCharge: 0,
        caseExpenseTotal: 3300,
        proofDocuments: [
          {
            id: 'gcs-seed-4-p1',
            label: 'Courier receipt',
            fileName: 'courier-braun.pdf',
            source: 'service',
            caseId: 'op-case-015-06',
          },
          {
            id: 'gcs-seed-4-p2',
            label: 'Same-day courier upgrade receipt',
            fileName: 'express-braun.pdf',
            source: 'additional_expense',
            caseId: 'op-case-015-06',
          },
        ],
      },
    ],
    otherExpenses: [
      {
        id: 'gcs-seed-4-o1',
        description: 'Parking Expenses',
        amount: 120,
      },
    ],
    caseExpensesTotal: 3300,
    otherExpensesTotal: 120,
    grandTotal: 3420,
    proofDocuments: [
      {
        id: 'gcs-seed-4-p1',
        label: 'Courier receipt',
        fileName: 'courier-braun.pdf',
        source: 'service',
        caseId: 'op-case-015-06',
      },
      {
        id: 'gcs-seed-4-p2',
        label: 'Same-day courier upgrade receipt',
        fileName: 'express-braun.pdf',
        source: 'additional_expense',
        caseId: 'op-case-015-06',
      },
    ],
    notes: 'UPI claim rejected — missing GST invoice for express courier upgrade.',
    reviewedAt: '2026-06-06T09:40:00.000Z',
    reviewedBy: 'Finance Desk',
    rejectionReason: 'Missing GST invoice for express courier upgrade.',
  },
  {
    id: 'gcs-seed-5',
    claimNumber: 'CS-2026-0005',
    status: 'submitted',
    generatedBy: 'Rahul Nair',
    generatedAt: '2026-06-20T09:15:00.000Z',
    team: 'Delhi Team',
    fundTransferType: 'card_cash',
    kpis: nonBankKpis({
      allocatedAmount: 8500,
      expensesIncurred: 8120,
      settlementAmount: -380,
    }),
    cases: [
      {
        caseId: 'op-case-020-01',
        operationalId: 'GLTS-M-2026-0195-01',
        passengerName: 'Omar Hassan',
        applicationId: 'GLTS-M-2026-0195',
        companyName: 'Gulf Marine Manning',
        country: 'UAE',
        visaType: 'Visit Visa',
        services: [
          { serviceName: 'VFS Support', amount: 2200, receiptFileName: 'vfs-hassan.pdf' },
          { serviceName: 'Courier', amount: 750, receiptFileName: 'courier-hassan.pdf' },
          { serviceName: 'Local Travel', amount: 900 },
          { serviceName: 'Printing', amount: 400 },
        ],
        additionalExpenses: [
          {
            serviceName: 'Photo booth charges',
            amount: 350,
            receiptFileName: 'photo-hassan.pdf',
          },
        ],
        dispatchCharge: 0,
        caseExpenseTotal: 4600,
        proofDocuments: [
          {
            id: 'gcs-seed-5-p1',
            label: 'VFS Support receipt',
            fileName: 'vfs-hassan.pdf',
            source: 'service',
            caseId: 'op-case-020-01',
          },
          {
            id: 'gcs-seed-5-p2',
            label: 'Courier receipt',
            fileName: 'courier-hassan.pdf',
            source: 'service',
            caseId: 'op-case-020-01',
          },
          {
            id: 'gcs-seed-5-p3',
            label: 'Photo booth charges receipt',
            fileName: 'photo-hassan.pdf',
            source: 'additional_expense',
            caseId: 'op-case-020-01',
          },
        ],
      },
      {
        caseId: 'op-case-020-02',
        operationalId: 'GLTS-M-2026-0195-02',
        passengerName: 'Yusuf Ali',
        applicationId: 'GLTS-M-2026-0195',
        companyName: 'Gulf Marine Manning',
        country: 'UAE',
        visaType: 'Visit Visa',
        services: [
          { serviceName: 'VFS Support', amount: 2200, receiptFileName: 'vfs-ali.pdf' },
          { serviceName: 'Courier', amount: 750 },
          { serviceName: 'Printing', amount: 370 },
        ],
        additionalExpenses: [],
        dispatchCharge: 0,
        caseExpenseTotal: 3320,
        proofDocuments: [
          {
            id: 'gcs-seed-5-p4',
            label: 'VFS Support receipt',
            fileName: 'vfs-ali.pdf',
            source: 'service',
            caseId: 'op-case-020-02',
          },
        ],
      },
    ],
    otherExpenses: [
      {
        id: 'gcs-seed-5-o1',
        description: 'Cheque clearance courier to accounts',
        amount: 200,
        proofFileName: 'cheque-courier.pdf',
      },
    ],
    caseExpensesTotal: 7920,
    otherExpensesTotal: 200,
    grandTotal: 8120,
    proofDocuments: [
      {
        id: 'gcs-seed-5-p1',
        label: 'VFS Support receipt',
        fileName: 'vfs-hassan.pdf',
        source: 'service',
        caseId: 'op-case-020-01',
      },
      {
        id: 'gcs-seed-5-p2',
        label: 'Courier receipt',
        fileName: 'courier-hassan.pdf',
        source: 'service',
        caseId: 'op-case-020-01',
      },
      {
        id: 'gcs-seed-5-p3',
        label: 'Photo booth charges receipt',
        fileName: 'photo-hassan.pdf',
        source: 'additional_expense',
        caseId: 'op-case-020-01',
      },
      {
        id: 'gcs-seed-5-p4',
        label: 'VFS Support receipt',
        fileName: 'vfs-ali.pdf',
        source: 'service',
        caseId: 'op-case-020-02',
      },
      {
        id: 'gcs-seed-5-p5',
        label: 'Cheque clearance courier to accounts',
        fileName: 'cheque-courier.pdf',
        source: 'claim_other',
      },
    ],
    notes: 'Card + cash UAE visit batch — Delhi desk weekly claim.',
  },
  {
    id: 'gcs-seed-6',
    claimNumber: 'CS-2026-0006',
    status: 'under_review',
    generatedBy: 'Sneha Kapoor',
    generatedAt: '2026-06-21T12:40:00.000Z',
    team: 'Mumbai Team',
    fundTransferType: 'dd',
    kpis: nonBankKpis({
      allocatedAmount: 12000,
      expensesIncurred: 13450,
      settlementAmount: 1450,
    }),
    cases: [
      {
        caseId: 'op-case-021-01',
        operationalId: 'GLTS-M-2026-0201-01',
        passengerName: 'Hiroshi Tanaka',
        applicationId: 'GLTS-M-2026-0201',
        companyName: 'Pacific Crew Solutions',
        country: 'Japan',
        visaType: 'Business Visa',
        services: [
          { serviceName: 'Biometrics Coordination', amount: 3200, receiptFileName: 'bio-tanaka.pdf' },
          { serviceName: 'VFS Support', amount: 2500, receiptFileName: 'vfs-tanaka.pdf' },
          { serviceName: 'Courier', amount: 900, receiptFileName: 'courier-tanaka.pdf' },
          { serviceName: 'Local Travel', amount: 1500 },
          { serviceName: 'Printing', amount: 450 },
        ],
        additionalExpenses: [
          {
            serviceName: 'Document attestation',
            amount: 1800,
            receiptFileName: 'attest-tanaka.pdf',
          },
        ],
        dispatchCharge: 900,
        caseExpenseTotal: 12850,
        proofDocuments: [
          {
            id: 'gcs-seed-6-p1',
            label: 'Biometrics Coordination receipt',
            fileName: 'bio-tanaka.pdf',
            source: 'service',
            caseId: 'op-case-021-01',
          },
          {
            id: 'gcs-seed-6-p2',
            label: 'VFS Support receipt',
            fileName: 'vfs-tanaka.pdf',
            source: 'service',
            caseId: 'op-case-021-01',
          },
          {
            id: 'gcs-seed-6-p3',
            label: 'Courier receipt',
            fileName: 'courier-tanaka.pdf',
            source: 'service',
            caseId: 'op-case-021-01',
          },
          {
            id: 'gcs-seed-6-p4',
            label: 'Document attestation receipt',
            fileName: 'attest-tanaka.pdf',
            source: 'additional_expense',
            caseId: 'op-case-021-01',
          },
          {
            id: 'gcs-seed-6-p5',
            label: 'Dispatch AWB proof',
            fileName: 'awb-jp554433221.pdf',
            source: 'dispatch',
            caseId: 'op-case-021-01',
          },
        ],
      },
    ],
    otherExpenses: [
      {
        id: 'gcs-seed-6-o1',
        description: 'DD preparation bank charges',
        amount: 600,
        proofFileName: 'dd-charges.pdf',
      },
    ],
    caseExpensesTotal: 12850,
    otherExpensesTotal: 600,
    grandTotal: 13450,
    proofDocuments: [
      {
        id: 'gcs-seed-6-p1',
        label: 'Biometrics Coordination receipt',
        fileName: 'bio-tanaka.pdf',
        source: 'service',
        caseId: 'op-case-021-01',
      },
      {
        id: 'gcs-seed-6-p2',
        label: 'VFS Support receipt',
        fileName: 'vfs-tanaka.pdf',
        source: 'service',
        caseId: 'op-case-021-01',
      },
      {
        id: 'gcs-seed-6-p3',
        label: 'Courier receipt',
        fileName: 'courier-tanaka.pdf',
        source: 'service',
        caseId: 'op-case-021-01',
      },
      {
        id: 'gcs-seed-6-p4',
        label: 'Document attestation receipt',
        fileName: 'attest-tanaka.pdf',
        source: 'additional_expense',
        caseId: 'op-case-021-01',
      },
      {
        id: 'gcs-seed-6-p5',
        label: 'Dispatch AWB proof',
        fileName: 'awb-jp554433221.pdf',
        source: 'dispatch',
        caseId: 'op-case-021-01',
      },
      {
        id: 'gcs-seed-6-p6',
        label: 'DD preparation bank charges',
        fileName: 'dd-charges.pdf',
        source: 'claim_other',
      },
    ],
    notes: 'DD float for Japan business visa — expenses exceed DD allocation.',
  },
  {
    id: 'gcs-seed-7',
    claimNumber: 'CS-2026-0007',
    status: 'submitted',
    generatedBy: 'Vikram Joshi',
    generatedAt: '2026-06-22T07:55:00.000Z',
    team: 'Chennai Team',
    fundTransferType: 'cash',
    kpis: nonBankKpis({
      allocatedAmount: 5500,
      expensesIncurred: 5280,
      settlementAmount: -220,
    }),
    cases: [
      {
        caseId: 'op-case-022-03',
        operationalId: 'GLTS-M-2026-0210-03',
        passengerName: 'Elena Rossi',
        applicationId: 'GLTS-M-2026-0210',
        companyName: 'Mediterraneo Crewing',
        country: 'Italy',
        visaType: 'Schengen Seafarer',
        services: [
          { serviceName: 'VFS Support', amount: 1800, receiptFileName: 'vfs-rossi.pdf' },
          { serviceName: 'Courier', amount: 650, receiptFileName: 'courier-rossi.pdf' },
          { serviceName: 'Local Travel', amount: 1100 },
          { serviceName: 'Printing', amount: 380 },
        ],
        additionalExpenses: [
          {
            serviceName: 'Embassy queue facilitation',
            amount: 900,
            receiptFileName: 'queue-rossi.pdf',
          },
        ],
        dispatchCharge: 0,
        caseExpenseTotal: 4830,
        proofDocuments: [
          {
            id: 'gcs-seed-7-p1',
            label: 'VFS Support receipt',
            fileName: 'vfs-rossi.pdf',
            source: 'service',
            caseId: 'op-case-022-03',
          },
          {
            id: 'gcs-seed-7-p2',
            label: 'Courier receipt',
            fileName: 'courier-rossi.pdf',
            source: 'service',
            caseId: 'op-case-022-03',
          },
          {
            id: 'gcs-seed-7-p3',
            label: 'Embassy queue facilitation receipt',
            fileName: 'queue-rossi.pdf',
            source: 'additional_expense',
            caseId: 'op-case-022-03',
          },
        ],
      },
    ],
    otherExpenses: [
      {
        id: 'gcs-seed-7-o1',
        description: 'Vendor wallet top-up (other transfer)',
        amount: 450,
        proofFileName: 'wallet-topup.pdf',
      },
    ],
    caseExpensesTotal: 4830,
    otherExpensesTotal: 450,
    grandTotal: 5280,
    proofDocuments: [
      {
        id: 'gcs-seed-7-p1',
        label: 'VFS Support receipt',
        fileName: 'vfs-rossi.pdf',
        source: 'service',
        caseId: 'op-case-022-03',
      },
      {
        id: 'gcs-seed-7-p2',
        label: 'Courier receipt',
        fileName: 'courier-rossi.pdf',
        source: 'service',
        caseId: 'op-case-022-03',
      },
      {
        id: 'gcs-seed-7-p3',
        label: 'Embassy queue facilitation receipt',
        fileName: 'queue-rossi.pdf',
        source: 'additional_expense',
        caseId: 'op-case-022-03',
      },
      {
        id: 'gcs-seed-7-p4',
        label: 'Vendor wallet top-up (other transfer)',
        fileName: 'wallet-topup.pdf',
        source: 'claim_other',
      },
    ],
    notes: 'Cash transfer — Chennai seafarer claim.',
  },
  (() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const today = `${y}-${m}-${d}`
    const generatedAt = new Date(now)
    generatedAt.setHours(8, 20, 0, 0)
    const reviewedAt = new Date(now)
    reviewedAt.setHours(10, 15, 0, 0)

    return {
      id: 'gcs-seed-today-1',
      claimNumber: 'CS-2026-TODAY-01',
      status: 'approved' as const,
      generatedBy: 'Priya Sharma',
      generatedAt: generatedAt.toISOString(),
      team: 'Mumbai Team',
      fundTransferType: 'card' as const,
      kpis: nonBankKpis({
        allocatedAmount: 9200,
        expensesIncurred: 8750,
        settlementAmount: -450,
      }),
      cases: [
        {
          caseId: 'op-case-today-01',
          operationalId: 'GLTS-M-2026-TODAY-01',
          passengerName: 'Rajesh Kumar',
          applicationId: 'GL-1025',
          companyName: 'Oceanic Manning Pvt Ltd',
          country: 'UAE',
          visaType: 'Visit Visa',
          services: [
            { serviceName: 'VFS Support', amount: 2200, receiptFileName: 'today-vfs-rajesh.pdf' },
            { serviceName: 'Courier', amount: 650, receiptFileName: 'today-courier-rajesh.pdf' },
            { serviceName: 'Local Travel', amount: 900 },
          ],
          additionalExpenses: [
            {
              serviceName: 'Photo booth charges',
              amount: 350,
              receiptFileName: 'today-photo-rajesh.pdf',
            },
          ],
          dispatchCharge: 0,
          caseExpenseTotal: 4100,
          proofDocuments: [
            {
              id: 'gcs-seed-today-1-p1',
              label: 'VFS Support receipt',
              fileName: 'today-vfs-rajesh.pdf',
              source: 'service' as const,
              caseId: 'op-case-today-01',
            },
            {
              id: 'gcs-seed-today-1-p2',
              label: 'Courier receipt',
              fileName: 'today-courier-rajesh.pdf',
              source: 'service' as const,
              caseId: 'op-case-today-01',
            },
          ],
        },
        {
          caseId: 'op-case-today-02',
          operationalId: 'GLTS-M-2026-TODAY-02',
          passengerName: 'Vikram Singh',
          applicationId: 'GL-1025',
          companyName: 'Oceanic Manning Pvt Ltd',
          country: 'UAE',
          visaType: 'Visit Visa',
          services: [
            { serviceName: 'Biometrics Coordination', amount: 2500, receiptFileName: 'today-bio-vikram.pdf' },
            { serviceName: 'Printing', amount: 400 },
            { serviceName: 'Local Travel', amount: 850 },
          ],
          additionalExpenses: [
            {
              serviceName: 'Same-day queue facilitation',
              amount: 900,
              receiptFileName: 'today-queue-vikram.pdf',
            },
          ],
          dispatchCharge: 0,
          caseExpenseTotal: 4650,
          proofDocuments: [
            {
              id: 'gcs-seed-today-1-p3',
              label: 'Biometrics Coordination receipt',
              fileName: 'today-bio-vikram.pdf',
              source: 'service' as const,
              caseId: 'op-case-today-02',
            },
          ],
        },
      ],
      otherExpenses: [],
      caseExpensesTotal: 8750,
      otherExpensesTotal: 0,
      grandTotal: 8750,
      proofDocuments: [
        {
          id: 'gcs-seed-today-1-p1',
          label: 'VFS Support receipt',
          fileName: 'today-vfs-rajesh.pdf',
          source: 'service' as const,
          caseId: 'op-case-today-01',
        },
        {
          id: 'gcs-seed-today-1-p3',
          label: 'Biometrics Coordination receipt',
          fileName: 'today-bio-vikram.pdf',
          source: 'service' as const,
          caseId: 'op-case-today-02',
        },
      ],
      notes: `Same-day Mumbai Team claim for GL-1025 crew — approved ${today}.`,
      reviewedAt: reviewedAt.toISOString(),
      reviewedBy: 'Finance Desk',
    }
  })(),
  (() => {
    const now = new Date()
    const generatedAt = new Date(now)
    generatedAt.setHours(9, 5, 0, 0)
    const reviewedAt = new Date(now)
    reviewedAt.setHours(11, 50, 0, 0)

    return {
      id: 'gcs-seed-today-2',
      claimNumber: 'CS-2026-TODAY-02',
      status: 'approved' as const,
      generatedBy: 'Sneha Patel',
      generatedAt: generatedAt.toISOString(),
      team: 'Chennai Team',
      fundTransferType: 'bank_transfer' as const,
      kpis: bankKpis({
        allocatedAmount: 15000,
        totalWithdrawn: 6200,
        availableInBank: 8800,
        inHandCash: 2100,
        expensesIncurred: 5400,
        bankAllocationCount: 2,
        settlementDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        priorBankDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.max(1, now.getDate() - 1)).padStart(2, '0')}`,
      }),
      cases: [
        {
          caseId: 'op-case-today-03',
          operationalId: 'GLTS-M-2026-TODAY-03',
          passengerName: 'Asha Nair',
          applicationId: 'GL-739',
          companyName: 'Bayline Crew Services',
          country: 'Italy',
          visaType: 'Schengen Seafarer',
          services: [
            { serviceName: 'VFS Support', amount: 1800, receiptFileName: 'today-vfs-asha.pdf' },
            { serviceName: 'Courier', amount: 700, receiptFileName: 'today-courier-asha.pdf' },
            { serviceName: 'Local Travel', amount: 1100 },
          ],
          additionalExpenses: [
            {
              serviceName: 'Notary attestation',
              amount: 1800,
              receiptFileName: 'today-notary-asha.pdf',
            },
          ],
          dispatchCharge: 0,
          caseExpenseTotal: 5400,
          proofDocuments: [
            {
              id: 'gcs-seed-today-2-p1',
              label: 'VFS Support receipt',
              fileName: 'today-vfs-asha.pdf',
              source: 'service' as const,
              caseId: 'op-case-today-03',
            },
            {
              id: 'gcs-seed-today-2-p2',
              label: 'Notary attestation receipt',
              fileName: 'today-notary-asha.pdf',
              source: 'additional_expense' as const,
              caseId: 'op-case-today-03',
            },
          ],
        },
      ],
      otherExpenses: [],
      caseExpensesTotal: 5400,
      otherExpensesTotal: 0,
      grandTotal: 5400,
      proofDocuments: [
        {
          id: 'gcs-seed-today-2-p1',
          label: 'VFS Support receipt',
          fileName: 'today-vfs-asha.pdf',
          source: 'service' as const,
          caseId: 'op-case-today-03',
        },
        {
          id: 'gcs-seed-today-2-p2',
          label: 'Notary attestation receipt',
          fileName: 'today-notary-asha.pdf',
          source: 'additional_expense' as const,
          caseId: 'op-case-today-03',
        },
      ],
      notes: 'Same-day Chennai Team bank claim — Asha Nair embassy window.',
      reviewedAt: reviewedAt.toISOString(),
      reviewedBy: 'Accounts Lead',
    }
  })(),
]
