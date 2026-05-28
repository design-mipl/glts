import type { CompanyProfileData } from '../types/accountWorkspace'

export const mockCompanyProfileData: CompanyProfileData = {
  overview: {
    companyName: 'GLTS Corporate Travel Pvt. Ltd.',
    companyType: 'Private Limited',
    industryType: 'Logistics & Marine Services',
    companyStatus: 'Active',
    customerCategory: 'Corporate',
    onboardingDate: '14 Mar 2023',
  },
  operational: {
    gltsTeam: 'Enterprise · Mumbai',
    assignedBranch: 'Mumbai HQ',
    supportContact: {
      id: 'support-1',
      name: 'Priya Sharma',
      role: 'Customer Success Manager',
      email: 'priya.sharma@glts.com',
      phone: '+91 22 4000 1100',
    },
    escalationContact: {
      id: 'escalation-1',
      name: 'James Chen',
      role: 'Operations Lead',
      email: 'james.chen@glts.com',
      phone: '+91 22 4000 1199',
    },
  },
  billing: {
    billingEntityName: 'GLTS Corporate Travel Pvt. Ltd.',
    gstNumber: '27AABCU9603R1ZM',
    panNumber: 'AABCU9603R',
    billingEmail: 'billing@glts.com',
    billingPhone: '+91 22 4000 1200',
    billingAddress: 'Level 12, One BKC, Bandra Kurla Complex, Mumbai 400051',
    gstVerified: true,
    panVerified: true,
  },
  operations: {
    countries: ['Kenya', 'UAE', 'Schengen', 'Japan', 'Singapore', 'UK', 'Thailand', 'Australia'],
    visaTypes: ['Tourist', 'Business', 'Crew / Marine', 'Transit', 'Work'],
  },
}
