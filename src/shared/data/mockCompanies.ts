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
    countryId: 'India',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400001',
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
    countryId: 'India',
    country: 'India',
    state: 'Kerala',
    city: 'Kochi',
    pincode: '682001',
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
    countryId: 'India',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    pincode: '560001',
    billingEntityName: 'Global Corporate Travel Ltd',
    billingAddress: 'Bengaluru, Karnataka',
    gstNumber: '29AABCG9012C3Z7',
    panNumber: 'AABCG9012C',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(3),
    activities: [],
  },
  {
    id: 'CMP-1010',
    companyName: 'Nexus Global Mobility',
    companyType: 'private_limited',
    industryType: 'Corporate Travel',
    contactPersonName: 'Harsh Shah',
    contactNumber: '+91 9825019876',
    emailAddress: 'harsh@nexusglobal.com',
    companyAddress: 'SG Highway, Ahmedabad, Gujarat',
    countryId: 'India',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    pincode: '380015',
    billingEntityName: 'Nexus Global Mobility Pvt Ltd',
    billingAddress: 'SG Highway, Ahmedabad, Gujarat',
    gstNumber: '24AABCN1234A1Z1',
    panNumber: 'AABCN1234A',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(4),
    activities: [],
  },
  {
    id: 'CMP-1011',
    companyName: 'Horizon Visa Consultants',
    companyType: 'partnership',
    industryType: 'Visa & Immigration',
    contactPersonName: 'Subhash Banerjee',
    contactNumber: '+91 9830014567',
    emailAddress: 'subhash@horizonvisa.com',
    companyAddress: 'Park Street, Kolkata, West Bengal',
    countryId: 'India',
    country: 'India',
    state: 'West Bengal',
    city: 'Kolkata',
    pincode: '700016',
    billingEntityName: 'Horizon Visa Consultants',
    billingAddress: 'Park Street, Kolkata, West Bengal',
    gstNumber: '19AABCH5678B1Z3',
    panNumber: 'AABCH5678B',
    createdAt: daysAgo(35),
    updatedAt: daysAgo(2),
    activities: [],
  },
  {
    id: 'CMP-1012',
    companyName: 'Coastal Crew Solutions',
    companyType: 'private_limited',
    industryType: 'Marine & Shipping',
    contactPersonName: 'Ramesh Naidu',
    contactNumber: '+91 9701234567',
    emailAddress: 'ramesh@coastalcrew.com',
    companyAddress: 'Port Area, Visakhapatnam, Andhra Pradesh',
    countryId: 'India',
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    pincode: '530001',
    billingEntityName: 'Coastal Crew Solutions Pvt Ltd',
    billingAddress: 'Port Area, Visakhapatnam, Andhra Pradesh',
    gstNumber: '37AABCC9012C1Z5',
    panNumber: 'AABCC9012C',
    createdAt: daysAgo(140),
    updatedAt: daysAgo(15),
    activities: [],
  },
]

const STORAGE_KEY = 'glts:companies'
/** Bump when `SEED_COMPANIES` changes so dev browsers reload mock data. */
const SEED_VERSION = 2

let memoryStore: CompanyMaster[] | null = null

function loadStore(): CompanyMaster[] {
  if (memoryStore) return memoryStore
  try {
    const versionKey = `${STORAGE_KEY}:version`
    const cachedVersion = localStorage.getItem(versionKey)
    if (cachedVersion !== String(SEED_VERSION)) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(versionKey, String(SEED_VERSION))
    } else {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        memoryStore = JSON.parse(raw) as CompanyMaster[]
        return memoryStore
      }
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
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(`${STORAGE_KEY}:version`)
  } catch {
    /* ignore */
  }
}
