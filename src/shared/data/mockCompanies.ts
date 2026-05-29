import type { CompanyMaster } from '@/shared/types/companyMaster'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const SEED_COMPANIES: CompanyMaster[] = [
  {
    id: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    companyType: 'private_limited',
    industryType: 'Marine & Shipping',
    contactPersonName: 'Rohit Menon',
    contactNumber: '+91 9988776655',
    emailAddress: 'rohit@apexmarine.com',
    companyAddress: 'Mumbai Port Road, Mumbai, Maharashtra',
    billingEntityName: 'Apex Marine Logistics Pvt Ltd',
    billingAddress: 'Mumbai Port Road, Mumbai, Maharashtra',
    gstNumber: '27AABCA1234A1Z5',
    panNumber: 'AABCA1234A',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(5),
    activities: [],
  },
  {
    id: 'CMP-1002',
    companyName: 'Oceanic Crew Services',
    companyType: 'private_limited',
    industryType: 'Marine & Shipping',
    contactPersonName: 'Priya Nair',
    contactNumber: '+91 9876543210',
    emailAddress: 'priya@oceaniccrew.com',
    companyAddress: 'Kochi, Kerala',
    billingEntityName: 'Oceanic Crew Services Pvt Ltd',
    billingAddress: 'Kochi, Kerala',
    gstNumber: '32AABCO5678B2Z6',
    panNumber: 'AABCO5678B',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(10),
    activities: [],
  },
  {
    id: 'CMP-1003',
    companyName: 'Global Corporate Travel Ltd',
    companyType: 'public_limited',
    industryType: 'Corporate Travel',
    contactPersonName: 'Anil Kapoor',
    contactNumber: '+91 9123456789',
    emailAddress: 'anil@globalcorp.com',
    companyAddress: 'Bengaluru, Karnataka',
    billingEntityName: 'Global Corporate Travel Ltd',
    billingAddress: 'Bengaluru, Karnataka',
    gstNumber: '29AABCG9012C3Z7',
    panNumber: 'AABCG9012C',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(3),
    activities: [],
  },
]

const STORAGE_KEY = 'glts:companies'

let memoryStore: CompanyMaster[] | null = null

function loadStore(): CompanyMaster[] {
  if (memoryStore) return memoryStore
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      memoryStore = JSON.parse(raw) as CompanyMaster[]
      return memoryStore
    }
  } catch {
    /* ignore */
  }
  memoryStore = [...SEED_COMPANIES]
  return memoryStore
}

export function getMockCompanies(): CompanyMaster[] {
  return loadStore()
}

export function setMockCompaniesStore(rows: CompanyMaster[]) {
  memoryStore = rows
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  } catch {
    /* ignore */
  }
}

export function resetMockCompaniesCache() {
  memoryStore = null
}
