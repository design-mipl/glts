import type { Dispatch, SetStateAction } from 'react'
import { Stack } from '@mui/material'
import {
  FileUpload,
  FormField,
  Input,
  MultiSelect,
  Select,
  Textarea,
} from '@/design-system/UIComponents'
import {
  AdminFullPageFormFieldSpan,
  type AdminFullPageFormSection,
} from '@/pages/admin/components/AdminFullPageFormShell'
import type { EnquiryFormData } from '@/shared/types/enquiry'
import {
  enquiryCustomerTypeOptions,
  enquiryFormCountryOptions,
  enquiryInquirySourceOptions,
  enquiryProcessingTypeOptions,
} from '../config/enquiryFormConfig'
import { getEnquiryActor } from '../utils/enquiryActor'

export interface EnquiryFormSectionsProps {
  formData: EnquiryFormData
  setFormData: Dispatch<SetStateAction<EnquiryFormData>>
  errors: Record<string, string>
  showFileUpload?: boolean
}

function getNotesValue(formData: EnquiryFormData): string {
  return (
    formData.notes.initialDiscussionNotes ||
    formData.notes.internalNotes ||
    [formData.notes.customerExpectations, formData.notes.specialInstructions].filter(Boolean).join('\n\n') ||
    ''
  )
}

function getProcessingTypeValue(formData: EnquiryFormData): string {
  return formData.visaRequirement.processingType || formData.visaRequirement.expectedProcessingTimeline || ''
}

export function buildEnquiryFormSections({
  formData,
  setFormData,
  errors,
  showFileUpload = true,
}: EnquiryFormSectionsProps) {
  const patch = (section: keyof EnquiryFormData, next: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...next },
    }))
  }

  const sections: AdminFullPageFormSection[] = [
    {
      id: 'customer-enquiry',
      title: 'Customer & Enquiry Information',
      columns: 2 as const,
      children: (
        <>
          <AdminFullPageFormFieldSpan>
            <FormField
              label="Customer / Company Name"
              required
              error={Boolean(errors.companyOrCustomerName)}
              helperText={errors.companyOrCustomerName}
            >
              <Input
                value={formData.customer.companyOrCustomerName}
                onChange={(value) => patch('customer', { companyOrCustomerName: value })}
                placeholder="Enter company or customer name"
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField label="Customer Type">
            <Select
              value={formData.customer.customerType}
              onChange={(value) =>
                patch('customer', { customerType: String(value) as typeof formData.customer.customerType })
              }
              options={enquiryCustomerTypeOptions}
              placeholder="Select customer type"
              fullWidth
            />
          </FormField>
          <FormField
            label="Contact Person Name"
            required
            error={Boolean(errors.contactPersonName)}
            helperText={errors.contactPersonName}
          >
            <Input
              value={formData.customer.contactPersonName}
              onChange={(value) => patch('customer', { contactPersonName: value })}
              placeholder="Enter contact person name"
              fullWidth
            />
          </FormField>
          <FormField
            label="Contact Number"
            required
            error={Boolean(errors.contactNumber)}
            helperText={errors.contactNumber}
          >
            <Input
              value={formData.customer.contactNumber}
              onChange={(value) => patch('customer', { contactNumber: value })}
              placeholder="+91 98765 43210"
              fullWidth
            />
          </FormField>
          <FormField
            label="Email Address"
            required
            error={Boolean(errors.emailAddress)}
            helperText={errors.emailAddress}
          >
            <Input
              value={formData.customer.emailAddress}
              onChange={(value) => patch('customer', { emailAddress: value })}
              placeholder="name@company.com"
              fullWidth
            />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField label="Company Address">
              <Textarea
                value={formData.customer.companyAddress ?? ''}
                onChange={(value) => patch('customer', { companyAddress: value })}
                placeholder="Street, city, state, postal code"
                minRows={2}
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField
            label="Inquiry Source"
            required
            error={Boolean(errors.inquirySource)}
            helperText={errors.inquirySource}
          >
            <Select
              value={formData.salesDetails.inquirySource}
              onChange={(value) =>
                patch('salesDetails', {
                  inquirySource: String(value) as typeof formData.salesDetails.inquirySource,
                })
              }
              options={enquiryInquirySourceOptions}
              placeholder="Select how the enquiry was received"
              fullWidth
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'visa',
      title: 'Visa Requirement Details',
      columns: 2 as const,
      children: (
        <>
          <AdminFullPageFormFieldSpan>
            <FormField
              label="Country Requirement"
              required
              error={Boolean(errors.countries)}
              helperText={errors.countries}
            >
              <MultiSelect
                value={formData.visaRequirement.countries}
                onChange={(value) => patch('visaRequirement', { countries: value.map(String) })}
                options={enquiryFormCountryOptions}
                placeholder="Select destination countries"
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField label="Visa Type" required error={Boolean(errors.visaType)} helperText={errors.visaType}>
            <Input
              value={formData.visaRequirement.visaType}
              onChange={(value) => patch('visaRequirement', { visaType: value })}
              placeholder="e.g. Tourist, Business, Crew Movement"
              fullWidth
            />
          </FormField>
          <FormField label="Purpose of Visit">
            <Input
              value={formData.visaRequirement.purposeOfVisit}
              onChange={(value) => patch('visaRequirement', { purposeOfVisit: value })}
              placeholder="e.g. Conference, family visit, crew change"
              fullWidth
            />
          </FormField>
          <FormField label="Processing Type">
            <Select
              value={getProcessingTypeValue(formData)}
              onChange={(value) =>
                patch('visaRequirement', {
                  processingType: String(value) as typeof formData.visaRequirement.processingType,
                  expectedProcessingTimeline: '',
                })
              }
              options={enquiryProcessingTypeOptions}
              placeholder="Select processing type"
              clearable
              fullWidth
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'additional',
      title: 'Additional Information',
      importance: 'secondary' as const,
      span: 2,
      columns: 1,
      children: (
        <Stack spacing={2}>
          <FormField label="Notes / Internal Remarks">
            <Textarea
              value={getNotesValue(formData)}
              onChange={(value) =>
                patch('notes', {
                  initialDiscussionNotes: value,
                  internalNotes: value,
                  customerExpectations: '',
                  specialInstructions: '',
                })
              }
              placeholder="Add notes or internal remarks for this enquiry"
              minRows={4}
              fullWidth
            />
          </FormField>
          {showFileUpload ? (
            <FormField label="Attachments">
              <FileUpload
                multiple
                dropzoneTitle="Drag and drop files here, or browse"
                dropzoneCaption="Passport samples, requirement documents, or supporting files"
                browseLabel="Browse files"
                onUpload={(files) =>
                  setFormData((prev) => ({
                    ...prev,
                    attachments: files.map((file, index) => ({
                      id: `TEMP-${index}`,
                      fileName: file.name,
                      fileType: file.type || 'file',
                      fileSizeKb: Math.round(file.size / 1024),
                      uploadedAt: new Date().toISOString(),
                      uploadedBy: getEnquiryActor(),
                      version: 1,
                    })),
                  }))
                }
              />
            </FormField>
          ) : null}
        </Stack>
      ),
    },
  ]

  return sections
}
