import type { DashboardCommercialHeroData } from '../types'

/** Shared commercial finance hero mock — Super Admin Overview + Finance tabs + Accounts. */
export const COMMERCIAL_HERO_MOCK: DashboardCommercialHeroData = {
  revenueHero: {
    today: {
      label: 'Today',
      value: '₹8.6L',
      delta: 4.2,
      deltaLabel: 'vs yesterday',
      targetLabel: '108% of daily target',
    },
    mtd: {
      label: 'MTD',
      value: '₹2.18Cr',
      delta: 7.1,
      deltaLabel: 'vs prior month',
      targetLabel: '91% of MTD target',
    },
    ytd: {
      label: 'YTD',
      value: '₹14.6Cr',
      delta: 11.4,
      deltaLabel: 'vs prior year',
      targetLabel: '87% of annual target',
    },
  },
  collectionsHero: {
    today: {
      label: 'Today',
      value: '₹6.2L',
      delta: 3.8,
      deltaLabel: 'vs yesterday',
      targetLabel: '104% of daily target',
    },
    mtd: {
      label: 'MTD',
      value: '₹1.86Cr',
      delta: 2.4,
      deltaLabel: 'MTD recovery',
      targetLabel: '88% of MTD target',
    },
    ytd: {
      label: 'YTD',
      value: '₹12.1Cr',
      delta: 9.2,
      deltaLabel: 'vs prior year',
      targetLabel: '84% of annual target',
    },
  },
  netRevenue: {
    value: '₹48.2L',
    marginPercent: '22.4%',
    delta: 3.2,
    deltaLabel: 'vs prior period',
    serviceFees: '₹32.0L',
    inwardOutward: '₹16.2L',
  },
  outstanding: {
    amount: '₹3.42Cr',
    overdueInvoiceCount: 124,
    delta: -1.8,
    deltaLabel: 'vs last week',
  },
  invoicedCountHero: {
    today: {
      label: 'Today',
      value: 28,
      delta: 2,
      deltaLabel: 'vs yesterday',
    },
    mtd: {
      label: 'MTD',
      value: 842,
      delta: 5.4,
      deltaLabel: 'vs prior month',
    },
    ytd: {
      label: 'YTD',
      value: 4120,
      delta: 8.2,
      deltaLabel: 'vs prior year',
    },
  },
}
