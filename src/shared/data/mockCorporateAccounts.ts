import type { CorporateAccount } from '@/shared/types/corporateAccount'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const SEED_CORPORATE_ACCOUNTS: CorporateAccount[] = [
  {
    id: 'CA-001',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    agreementId: 'AGR-001',
    workflowType: 'marine',
    accountType: 'marine',
    branch: 'Mumbai',
    portalStatus: 'active',
    workflowConfig: {
      marineWorkflowEnabled: true,
      bulkUploadEnabled: true,
      retailWorkflowEnabled: false,
      corporateWorkflowEnabled: false,
    },
    superAdmin: {
      id: 'adm-sa-1',
      fullName: 'Rohit Menon',
      phoneNumber: '+91 9988776655',
      emailAddress: 'rohit@apexmarine.com',
      role: 'super_admin',
      credentialsSentAt: daysAgo(30),
    },
    admins: [
      {
        id: 'adm-1',
        fullName: 'Karan Singh',
        phoneNumber: '+91 9988776644',
        emailAddress: 'karan@apexmarine.com',
        role: 'admin',
        credentialsSentAt: daysAgo(28),
      },
    ],
    entityIds: [],
    vesselIds: [],
    portalActivation: {
      portalStatus: 'active',
      loginAccess: true,
      applicationCreationAccess: true,
      bulkUploadAccess: true,
      invoiceVisibility: true,
      trackingVisibility: true,
    },
    createdAt: daysAgo(32),
    updatedAt: daysAgo(5),
    activatedAt: daysAgo(30),
    activities: [],
  },
]

const STORAGE_KEY = 'glts:corporate-accounts'

let memoryStore: CorporateAccount[] | null = null

function loadStore(): CorporateAccount[] {
  if (memoryStore) return memoryStore
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      memoryStore = JSON.parse(raw) as CorporateAccount[]
      return memoryStore
    }
  } catch {
    /* ignore */
  }
  memoryStore = [...SEED_CORPORATE_ACCOUNTS]
  return memoryStore
}

export function getMockCorporateAccounts(): CorporateAccount[] {
  return loadStore()
}

export function setMockCorporateAccountsStore(rows: CorporateAccount[]) {
  memoryStore = rows
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  } catch {
    /* ignore */
  }
}

export function resetMockCorporateAccountsCache() {
  memoryStore = null
}
