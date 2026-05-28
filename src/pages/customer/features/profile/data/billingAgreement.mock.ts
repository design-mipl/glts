import type { BillingAgreementData } from '../types/accountWorkspace'

export const mockBillingAgreementData: BillingAgreementData = {
  agreement: {
    status: 'active',
    agreementType: 'Corporate Master Service Agreement',
    startDate: '01 Apr 2023',
    endDate: '31 Mar 2026',
    creditTerms: 'Net 30',
    slaSummary: 'Submission within 48h of complete checklist',
  },
  pricingGroups: [
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
      id: 'pg-addons',
      title: 'Add-on services',
      rows: [
        {
          id: 'pr-7',
          country: 'All',
          visaType: 'All',
          serviceType: 'Document attestation',
          baseFee: 'INR 1,200',
          pricingModel: 'advance',
        },
        {
          id: 'pr-8',
          country: 'All',
          visaType: 'All',
          serviceType: 'Priority desk review',
          baseFee: 'INR 2,500',
          pricingModel: 'advance',
        },
      ],
    },
  ],
  finance: {
    billingCycle: 'Monthly (calendar month)',
    creditLimit: 'INR 25,00,000',
    outstandingAmount: 'INR 4,82,150',
    outstandingAlert: true,
    invoiceSummary: '3 open invoices · last issued 28 Feb 2026',
    paymentSummary: 'Last payment INR 8,40,000 on 18 Feb 2026',
  },
  tax: {
    gstApplicable: true,
    tdsApplicable: true,
    gstPercentage: '18%',
    tdsPercentage: '2%',
  },
  invoiceRules: 'Consolidated monthly · per-application line items',
}
