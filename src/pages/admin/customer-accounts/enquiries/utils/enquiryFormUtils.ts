import type { EnquiryFormData, EnquiryRecord } from '@/shared/types/enquiry'

export function enquiryRecordToFormData(record: EnquiryRecord): EnquiryFormData {
  return {
    customer: { ...record.customer },
    visaRequirement: { ...record.visaRequirement },
    operationalRequirements: { ...record.operationalRequirements },
    salesDetails: { ...record.salesDetails },
    notes: { ...record.notes },
    attachments: [...record.attachments],
    followups: [...record.followups],
    assignment: { ...record.assignment },
    status: record.status,
  }
}
