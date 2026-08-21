import type { SxProps, Theme } from '@mui/material/styles'
import type { Dispatch, SetStateAction } from 'react'
import { Plus } from 'lucide-react'
import { Button, FileUpload, FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFieldSpan,
  type AdminFullPageFormSection,
} from '@/pages/admin/components/AdminFullPageFormShell'
import type { OrderAttachment, OrderCustomerType, OrderFormData } from '@/shared/types/order'
import { orderCustomerTypeOptions } from '../config/orderFilterConfig'
import { createEmptyLineItem, OrderServiceLineItemsSection } from './OrderServiceLineItemsSection'

function toOrderAttachments(files: File[]): OrderAttachment[] {
  return files.map((file, index) => ({
    id: `${Date.now()}-${index}-${file.name}`,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
  }))
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

export interface OrderFormSectionsProps {
  formData: OrderFormData
  setFormData: Dispatch<SetStateAction<OrderFormData>>
  errors: Record<string, string>
}

export function buildOrderFormSections({ formData, setFormData, errors }: OrderFormSectionsProps) {
  const patchCustomer = (next: Partial<OrderFormData['customer']>) => {
    setFormData((prev) => ({ ...prev, customer: { ...prev.customer, ...next } }))
  }

  const sections: AdminFullPageFormSection[] = [
    {
      id: 'customer-info-left',
      title: 'Customer Information',
      span: 1,
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
                onChange={(value) => patchCustomer({ companyOrCustomerName: value })}
                placeholder="Enter company or customer name"
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField label="Customer Type">
            <Select
              value={formData.customer.customerType}
              onChange={(value) => patchCustomer({ customerType: String(value) as OrderCustomerType })}
              options={orderCustomerTypeOptions.filter((option) => option.value)}
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
              onChange={(value) => patchCustomer({ contactPersonName: value })}
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
              onChange={(value) => patchCustomer({ contactNumber: value })}
              placeholder="Enter mobile number"
              fullWidth
            />
          </FormField>
        </>
      ),
    },
    {
      id: 'customer-info-right',
      title: 'Contact & Address',
      span: 1,
      columns: 2 as const,
      children: (
        <>
          <FormField label="Alternate Contact Number">
            <Input
              value={formData.customer.alternateContactNumber ?? ''}
              onChange={(value) => patchCustomer({ alternateContactNumber: value })}
              placeholder="Enter alternate contact number"
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
              onChange={(value) => patchCustomer({ emailAddress: value })}
              placeholder="name@company.com"
              fullWidth
            />
          </FormField>
          <FormField label="Company Website">
            <Input
              value={formData.customer.companyWebsite ?? ''}
              onChange={(value) => patchCustomer({ companyWebsite: value })}
              placeholder="https://example.com"
              fullWidth
            />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField label="Company Address">
              <Textarea
                value={formData.customer.companyAddress ?? ''}
                onChange={(value) => patchCustomer({ companyAddress: value })}
                placeholder="Street, city, state, postal code"
                minRows={2}
                fullWidth
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
        </>
      ),
    },
    {
      id: 'glts-service',
      title: 'GLTS Service',
      span: 2,
      columns: 1 as const,
      headerAction: (
        <Button
          label="Add Service"
          size="sm"
          startIcon={<Plus size={14} />}
          onClick={() =>
            setFormData((prev) => ({ ...prev, lineItems: [...prev.lineItems, createEmptyLineItem()] }))
          }
        />
      ),
      children: (
        <AdminFullPageFormFieldSpan>
          <OrderServiceLineItemsSection
            lineItems={formData.lineItems}
            onChange={(lineItems) => setFormData((prev) => ({ ...prev, lineItems }))}
            error={errors.lineItems}
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
          <FormField label="Notes" sx={additionalInfoColumnSx}>
            <Textarea
              value={formData.notes ?? ''}
              onChange={(value) => setFormData((prev) => ({ ...prev, notes: value }))}
              placeholder="Add notes or internal remarks for this order"
              minRows={4}
              fullWidth
              sx={additionalInfoTextareaSx}
            />
          </FormField>
          <FormField label="Attachments" sx={additionalInfoColumnSx}>
            <FileUpload
              multiple
              dropzoneTitle="Drag and drop files here, or browse"
              dropzoneCaption="Invoices, vendor confirmations, or supporting files"
              browseLabel="Browse files"
              sx={additionalInfoFileUploadSx}
              onUpload={(files) =>
                setFormData((prev) => ({ ...prev, attachments: toOrderAttachments(files) }))
              }
            />
          </FormField>
        </>
      ),
    },
  ]

  return sections
}
