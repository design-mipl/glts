import type { SxProps, Theme } from '@mui/material/styles'
import type { Dispatch, SetStateAction } from 'react'
import {
  FileUpload,
  FormField,
  Input,
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
  enquiryInquirySourceOptions,
} from '../config/enquiryFormConfig'
import { getEnquiryActor } from '../utils/enquiryActor'
import { EnquiryVisaRequirementSection } from './EnquiryVisaRequirementSection'

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

/** Side-by-side Notes + Attachments columns share the same control height in the section grid. */
const additionalInfoColumnSx: SxProps<Theme> = {
  height: '100%',
}

const additionalInfoTextareaSx: SxProps<Theme> = {
  flex: 1,
  '& .MuiFormControl-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .MuiInputBase-root': {
    flex: 1,
    alignItems: 'flex-start',
  },
  '& textarea': {
    height: '100% !important',
    boxSizing: 'border-box',
  },
}

const additionalInfoFileUploadSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  '& > .MuiBox-root:first-of-type': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
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

  const notesField = (
    <FormField label="Notes / Internal Remarks" sx={additionalInfoColumnSx}>
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
        sx={additionalInfoTextareaSx}
      />
    </FormField>
  )

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
            label="Mobile Number"
            required
            error={Boolean(errors.contactNumber)}
            helperText={errors.contactNumber}
          >
            <Input
              value={formData.customer.contactNumber}
              onChange={(value) => patch('customer', { contactNumber: value })}
              placeholder="Enter mobile number"
              fullWidth
            />
          </FormField>
          <FormField label="Landline Number">
            <Input
              value={formData.customer.alternateContactNumber ?? ''}
              onChange={(value) => patch('customer', { alternateContactNumber: value })}
              placeholder="Enter landline number"
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
            label="Enquiry Source"
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
      title: 'Country Visa Requirement Details',
      columns: 1 as const,
      children: (
        <AdminFullPageFormFieldSpan>
          <EnquiryVisaRequirementSection
            formData={formData}
            setFormData={setFormData}
            countriesError={errors.countries}
            visaRequirementsError={errors.visaRequirements}
          />
        </AdminFullPageFormFieldSpan>
      ),
    },
    {
      id: 'additional',
      title: 'Additional Information',
      importance: 'secondary' as const,
      span: 2,
      columns: 2 as const,
      children: (
        <>
          {showFileUpload ? notesField : <AdminFullPageFormFieldSpan>{notesField}</AdminFullPageFormFieldSpan>}
          {showFileUpload ? (
            <FormField label="Attachments" sx={additionalInfoColumnSx}>
              <FileUpload
                multiple
                dropzoneTitle="Drag and drop files here, or browse"
                dropzoneCaption="Passport samples, requirement documents, or supporting files"
                browseLabel="Browse files"
                sx={additionalInfoFileUploadSx}
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
        </>
      ),
    },
  ]

  return sections
}
