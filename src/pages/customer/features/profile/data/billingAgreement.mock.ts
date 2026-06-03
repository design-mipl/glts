import type { BillingAgreementData } from '../types/accountWorkspace'
import { deriveCountryVisaCoverageFromPricing } from '../utils/deriveAgreementOperations'

const pricingGroups: BillingAgreementData['pricingGroups'] = [
  {
    id: 'pg-kenya',
    title: 'Kenya',
    rows: [
      {
        id: 'pr-1',
        country: 'Kenya',
        visaType: 'Tourist',
        serviceType: 'e-Visa processing',
        baseFee: 'INR 4,200',
        additionalCharges: 'Courier INR 350',
        pricingModel: 'credit',
      },
      {
        id: 'pr-2',
        country: 'Kenya',
        visaType: 'Business',
        serviceType: 'Sticker visa',
        baseFee: 'INR 6,800',
        pricingModel: 'mixed',
      },
    ],
  },
  {
    id: 'pg-uae',
    title: 'UAE',
    rows: [
      {
        id: 'pr-3',
        country: 'UAE',
        visaType: 'Business',
        serviceType: 'Express processing',
        baseFee: 'INR 8,500',
        additionalCharges: 'VFS fee at cost',
        pricingModel: 'advance',
      },
      {
        id: 'pr-4',
        country: 'UAE',
        visaType: 'Tourist',
        serviceType: 'Standard processing',
        baseFee: 'INR 5,400',
        pricingModel: 'credit',
      },
    ],
  },
  {
    id: 'pg-schengen',
    title: 'Schengen',
    rows: [
      {
        id: 'pr-5',
        country: 'Schengen',
        visaType: 'Business',
        serviceType: 'Appointment + submission',
        baseFee: 'INR 12,500',
        additionalCharges: 'Add-on insurance INR 900',
        pricingModel: 'credit',
      },
      {
        id: 'pr-6',
        country: 'Schengen',
        visaType: 'Crew / Marine',
        serviceType: 'Crew manifest handling',
        baseFee: 'INR 9,200',
        pricingModel: 'mixed',
      },
    ],
  },
  {
    id: 'pg-japan',
    title: 'Japan',
    rows: [
      {
        id: 'pr-9',
        country: 'Japan',
        visaType: 'Business',
        serviceType: 'Corporate processing',
        baseFee: 'INR 11,200',
        pricingModel: 'credit',
      },
      {
        id: 'pr-10',
        country: 'Japan',
        visaType: 'Transit',
        serviceType: 'Transit facilitation',
        baseFee: 'INR 3,800',
        pricingModel: 'advance',
      },
    ],
  },
]

export const mockBillingAgreementData: BillingAgreementData = {
  agreement: {
    status: 'active',
    agreementType: 'Agreemented',
    billingType: 'mixed',
    workflowType: 'Corporate',
    startDate: '01 Apr 2023',
    endDate: '31 Mar 2026',
  },
  billingEntity: {
    billingEntityName: 'GLTS Corporate Travel Pvt. Ltd.',
    gstNumber: '27AABCU9603R1ZM',
    panNumber: 'AABCU9603R',
    billingEmail: 'billing@glts.com',
    billingPhone: '+91 22 4000 1200',
    billingAddress: 'Level 12, One BKC, Bandra Kurla Complex, Mumbai 400051',
    gstVerified: true,
    panVerified: true,
  },
  billingSummary: {
    creditPeriodDays: '45',
    creditLimit: 'INR 25,00,000',
    gracePeriodDays: '7',
    advancePercentage: '50%',
  },
  billingConfig: {
    billingType: 'mixed',
    mixed: {
      advanceBalance: 'INR 12,50,000',
      creditLimit: 'INR 25,00,000',
      outstanding: 'INR 4,82,150',
      remainingCredit: 'INR 20,17,850',
    },
  },
  pricingGroups,
  supportedOperations: {
    countryCoverage: deriveCountryVisaCoverageFromPricing(pricingGroups),
  },
  documents: [
    { id: 'doc-agreement', label: 'Agreement Copy', fileName: 'agreement-copy.pdf', status: 'available' },
    { id: 'doc-gst', label: 'GST Certificate', fileName: 'gst-certificate.pdf', status: 'available' },
    {
      id: 'doc-registration',
      label: 'Company Registration',
      fileName: 'company-registration.pdf',
      status: 'available',
    },
    {
      id: 'doc-annexure',
      label: 'Commercial Annexure',
      fileName: 'commercial-annexure.pdf',
      status: 'available',
    },
  ],
  financeContactPersons: [
    {
      id: 'fc-company',
      sourceType: 'company',
      sourceLabel: 'GLTS Corporate Travel Pvt. Ltd.',
      contactPerson: 'Priya Sharma',
      email: 'priya.sharma@glts.com',
      phone: '+91 22 4000 1100',
    },
    {
      id: 'fc-entity-ent-glts-hq',
      sourceType: 'entity',
      sourceId: 'ent-glts-hq',
      sourceLabel: 'Entity · GLTS Corporate Travel Pvt. Ltd.',
      contactPerson: 'Priya Sharma',
      email: 'billing@glts.com',
      phone: '+91 22 4000 1200',
    },
    {
      id: 'fc-entity-ent-glts-finance',
      sourceType: 'entity',
      sourceId: 'ent-glts-finance',
      sourceLabel: 'Entity · GLTS Finance & Accounts',
      contactPerson: 'James Chen',
      email: 'finance@glts.com',
      phone: '+91 22 4000 1199',
    },
  ],
  financeContacts: {
    accountsSpocName: 'Priya Sharma',
    accountsContactNumber: '+91 22 4000 1200',
    invoiceSubmissionEmail: 'invoices@glts.com',
    paymentFollowUpContact: 'finance@glts.com',
  },
  advanceAdjustmentPreview: {
    invoiceTotal: '₹1,00,000',
    advanceUsed: '₹50,000',
    remainingPayable: '₹50,000',
  },
  tax: {
    gstApplicable: true,
    tdsApplicable: true,
    gstPercentage: '18%',
    tdsPercentage: '2%',
  },
}
