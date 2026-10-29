import type { Dispatch, SetStateAction } from 'react'
import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFieldSpan,
  type AdminFullPageFormSection,
} from '@/pages/admin/components/AdminFullPageFormShell'
import type { OrderEnquiryFormData } from '@/shared/types/orderEnquiry'
import { orderEnquiryServiceOptions } from '../config/orderEnquiryFilterConfig'
import {
  orderEnquirySourceOptions,
  orderEnquiryStatusOptions,
} from '../config/orderEnquiryStatusConfig'

export interface OrderEnquiryFormSectionsProps {
  formData: OrderEnquiryFormData
  setFormData: Dispatch<SetStateAction<OrderEnquiryFormData>>
  errors: Record<string, string>
  /** Hide status/source on create when defaults apply. */
  showMetaFields?: boolean
}

export function buildOrderEnquiryFormSections({
  formData,
  setFormData,
  errors,
  showMetaFields = true,
}: OrderEnquiryFormSectionsProps) {
  const patchCustomer = (next: Partial<OrderEnquiryFormData['customer']>) => {
    setFormData((prev) => ({ ...prev, customer: { ...prev.customer, ...next } }))
  }

  const sections: AdminFullPageFormSection[] = [
    {
      id: 'order-enquiry-customer',
      title: 'Customer details',
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
                placeholder="Company or customer name"
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField
            label="Contact Person Name"
            required
            error={Boolean(errors.contactPersonName)}
            helperText={errors.contactPersonName}
          >
            <Input
              value={formData.customer.contactPersonName}
              onChange={(value) => patchCustomer({ contactPersonName: value })}
              placeholder="Primary contact"
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
              placeholder="+91 …"
            />
          </FormField>
          <FormField
            label="Email Address"
            required
            error={Boolean(errors.emailAddress)}
            helperText={errors.emailAddress}
          >
            <Input
              type="email"
              value={formData.customer.emailAddress}
              onChange={(value) => patchCustomer({ emailAddress: value })}
              placeholder="email@company.com"
            />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField
              label="Company Address"
              required
              error={Boolean(errors.companyAddress)}
              helperText={errors.companyAddress}
            >
              <Textarea
                value={formData.customer.companyAddress}
                onChange={(value) => patchCustomer({ companyAddress: value })}
                placeholder="Full address"
                minRows={2}
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
        </>
      ),
    },
    {
      id: 'order-enquiry-service',
      title: 'Service request',
      span: 1,
      columns: showMetaFields ? (2 as const) : (1 as const),
      children: (
        <>
          <FormField label="Service required" required>
            <Select
              value={formData.service}
              options={orderEnquiryServiceOptions}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, service: value as OrderEnquiryFormData['service'] }))
              }
            />
          </FormField>
          {showMetaFields ? (
            <>
              <FormField label="Source">
                <Select
                  value={formData.source}
                  options={orderEnquirySourceOptions}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, source: value as OrderEnquiryFormData['source'] }))
                  }
                />
              </FormField>
              <FormField label="Status">
                <Select
                  value={formData.status ?? 'new'}
                  options={orderEnquiryStatusOptions}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value as OrderEnquiryFormData['status'] }))
                  }
                />
              </FormField>
            </>
          ) : null}
          <AdminFullPageFormFieldSpan>
            <FormField label="Notes">
              <Textarea
                value={formData.notes ?? ''}
                onChange={(value) => setFormData((prev) => ({ ...prev, notes: value }))}
                placeholder="Internal notes or customer context"
                minRows={3}
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
        </>
      ),
    },
  ]

  return sections
}
