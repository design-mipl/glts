import type {
  DashboardClientIntelligenceData,
  DashboardClientRow,
  DashboardRankItem,
} from '../types'
import { buildClientMarginItems, type ClientMarginSeed } from '../utils/clientMarginItems'

const CLIENT_ROWS: DashboardClientRow[] = [
  {
    id: 'cl-1',
    client: 'BrightCorp India',
    segment: 'Corporate',
    applications: 148,
    revenue: '₹42.6L',
    collections: '₹31.2L',
    outstanding: '₹11.4L',
    status: 'Active',
  },
  {
    id: 'cl-2',
    client: 'Nordic Marine Ltd',
    segment: 'Marine',
    applications: 96,
    revenue: '₹38.1L',
    collections: '₹24.0L',
    outstanding: '₹14.1L',
    status: 'At risk',
  },
  {
    id: 'cl-3',
    client: 'Horizon Logistics',
    segment: 'Corporate',
    applications: 72,
    revenue: '₹21.8L',
    collections: '₹18.4L',
    outstanding: '₹3.4L',
    status: 'Active',
  },
  {
    id: 'cl-4',
    client: 'Retail network',
    segment: 'Retail',
    applications: 410,
    revenue: '₹56.2L',
    collections: '₹49.1L',
    outstanding: '₹7.1L',
    status: 'Active',
  },
  {
    id: 'cl-5',
    client: 'Skyline Travels',
    segment: 'B2B',
    applications: 88,
    revenue: '₹18.4L',
    collections: '₹15.2L',
    outstanding: '₹3.2L',
    status: 'Active',
  },
]

const TOP_REVENUE_CLIENTS: DashboardRankItem[] = [
  { id: 'trc-1', primary: 'Retail network', value: '₹56.2L', progress: 100, secondary: 'Retail' },
  { id: 'trc-2', primary: 'BrightCorp India', value: '₹42.6L', progress: 76, secondary: 'Corporate' },
  { id: 'trc-3', primary: 'Nordic Marine Ltd', value: '₹38.1L', progress: 68, secondary: 'Marine' },
  { id: 'trc-4', primary: 'Horizon Logistics', value: '₹21.8L', progress: 39, secondary: 'Corporate' },
  { id: 'trc-5', primary: 'Skyline Travels', value: '₹18.4L', progress: 33, secondary: 'B2B' },
  { id: 'trc-6', primary: 'Orient Holidays', value: '₹14.2L', progress: 25, secondary: 'B2B' },
  { id: 'trc-7', primary: 'Apex Industries', value: '₹12.6L', progress: 22, secondary: 'Corporate' },
  { id: 'trc-8', primary: 'Pacific Crewing', value: '₹11.1L', progress: 20, secondary: 'Marine' },
]

const HIGH_RISK_CLIENTS: DashboardRankItem[] = [
  {
    id: 'hr-1',
    primary: 'Nordic Marine Ltd',
    value: 'Credit exceeded',
    progress: 28,
    secondary: 'Agreement limit + ₹14.1L AR · joining risk',
    tone: 'negative',
  },
  {
    id: 'hr-2',
    primary: 'BrightCorp India',
    value: 'Credit 92%',
    progress: 48,
    secondary: 'Near Agreement credit limit',
    tone: 'warning',
  },
  {
    id: 'hr-3',
    primary: 'Eastern Freight Co.',
    value: 'Dormant 84d',
    progress: 25,
    secondary: 'Re-engage',
    tone: 'warning',
  },
  {
    id: 'hr-4',
    primary: 'Skyline Travels',
    value: 'Credit watch',
    progress: 48,
    secondary: 'B2B preview',
    tone: 'warning',
  },
  {
    id: 'hr-5',
    primary: 'Partner Desk — West',
    value: 'Dormant 47d',
    progress: 44,
    secondary: 'B2B',
    tone: 'warning',
  },
]

const DORMANT_CLIENTS: DashboardRankItem[] = [
  { id: 'dc-1', primary: 'Eastern Freight Co.', value: '84 days idle', progress: 20, secondary: 'Corporate' },
  { id: 'dc-2', primary: 'Bayview Holidays', value: '61 days idle', progress: 35, secondary: 'Retail' },
  { id: 'dc-3', primary: 'Partner Desk — West', value: '47 days idle', progress: 44, secondary: 'B2B' },
  { id: 'dc-4', primary: 'Coastal Agents', value: '39 days idle', progress: 50, secondary: 'B2B' },
  { id: 'dc-5', primary: 'Metro Travel Co', value: '33 days idle', progress: 55, secondary: 'B2B' },
]

const HIGH_MARGIN_SEEDS: ClientMarginSeed[] = [
  { id: 'hm-1', client: 'Horizon Logistics', marginPercent: 24 },
  { id: 'hm-2', client: 'BrightCorp India', marginPercent: 21 },
  { id: 'hm-3', client: 'Select retail lanes', segment: 'Retail', marginPercent: 19, revenueMtdL: 28.4, applicationsMtd: 186 },
  { id: 'hm-4', client: 'Summit Tech', segment: 'Corporate', marginPercent: 18, revenueMtdL: 16.8, applicationsMtd: 64 },
  { id: 'hm-5', client: 'Voyage Hub', segment: 'B2B', marginPercent: 17, revenueMtdL: 12.6, applicationsMtd: 52 },
]

const LOW_MARGIN_SEEDS: ClientMarginSeed[] = [
  { id: 'lm-1', client: 'Nordic Marine Ltd', marginPercent: 11, detail: 'Embassy cost spike' },
  { id: 'lm-2', client: 'Retail network', marginPercent: 9, detail: 'Transit-heavy lanes' },
  { id: 'lm-3', client: 'Skyline Travels', marginPercent: 10, detail: 'Schengen + UK mix' },
  { id: 'lm-4', client: 'Gulf Ship Management', segment: 'Marine', marginPercent: 12, revenueMtdL: 14.2, applicationsMtd: 54 },
  { id: 'lm-5', client: 'Pacific Crewing', segment: 'Marine', marginPercent: 13, revenueMtdL: 4.2, applicationsMtd: 12 },
]

/** Shared client intelligence mock — Super Admin Clients + Finance tabs + Accounts. */
export const CLIENT_INTELLIGENCE_MOCK: DashboardClientIntelligenceData = {
  clientRows: structuredClone(CLIENT_ROWS),
  topRevenueClients: structuredClone(TOP_REVENUE_CLIENTS),
  highRiskClients: structuredClone(HIGH_RISK_CLIENTS),
  dormantClients: structuredClone(DORMANT_CLIENTS),
  highMarginClientIntelligence: buildClientMarginItems(CLIENT_ROWS, HIGH_MARGIN_SEEDS),
  lowMarginClientIntelligence: buildClientMarginItems(CLIENT_ROWS, LOW_MARGIN_SEEDS),
}
