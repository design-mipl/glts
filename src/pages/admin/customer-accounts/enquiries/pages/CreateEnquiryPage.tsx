import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  BaseCard,
  Button,
  FileUpload,
  FormField,
  FormSection,
  Input,
  MultiSelect,
  Select,
  Textarea,
  Toggle,
  useToast,
} from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { enquiryService } from '@/shared/services/enquiryService'
import type { EnquiryFormData } from '@/shared/types/enquiry'
import { useEnquiryForm } from '../hooks/useEnquiryForm'

const countryOptions = [
  { label: 'UAE', value: 'UAE' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'UK', value: 'UK' },
  { label: 'USA', value: 'USA' },
]

export function CreateEnquiryPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useEnquiryForm()
  const [loading, setLoading] = useState(false)

  const patch = (section: keyof EnquiryFormData, next: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...next },
    }))
  }

  const handleSubmit = async (saveAssign = false) => {
    if (!validate()) return
    setLoading(true)
    const created = await enquiryService.create(formData, 'Admin User')
    if (saveAssign) {
      await enquiryService.assignOwner(
        created.id,
        {
          assignedTeam: formData.salesDetails.assignedOperationsTeam,
          assignedUser: formData.salesDetails.assignedSalesPerson,
          branch: formData.salesDetails.branch,
          priority: formData.salesDetails.priorityLevel,
        },
        'Admin User',
      )
    }
    setLoading(false)
    showToast({ title: 'Enquiry created', variant: 'success' })
    navigate(`/admin/customer-accounts/enquiries/${created.id}`)
  }

  return (
    <Stack spacing={2.5}>
      <AdminPageHeader
        title="Create Enquiry"
        description="Capture customer and visa requirements, then assign ownership for follow-up."
        breadcrumbs={[
          { label: 'Customer & Accounts', href: '/admin/customer-accounts/enquiries' },
          { label: 'Enquiry Management', href: '/admin/customer-accounts/enquiries' },
          { label: 'Create Enquiry' },
        ]}
      />
      <BaseCard>
        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2.5}>
            <FormSection title="Section A - Customer Information" columns={2}>
              <FormField label="Customer / Company Name" required error={Boolean(errors.companyOrCustomerName)} helperText={errors.companyOrCustomerName}>
                <Input value={formData.customer.companyOrCustomerName} onChange={(value) => patch('customer', { companyOrCustomerName: value })} fullWidth />
              </FormField>
              <FormField label="Customer Type">
                <Select
                  value={formData.customer.customerType}
                  onChange={(value) => patch('customer', { customerType: String(value) as typeof formData.customer.customerType })}
                  options={[
                    { label: 'Retail', value: 'retail' },
                    { label: 'Corporate', value: 'corporate' },
                    { label: 'Marine', value: 'marine' },
                  ]}
                  fullWidth
                />
              </FormField>
              <FormField label="Contact Person Name" required error={Boolean(errors.contactPersonName)} helperText={errors.contactPersonName}>
                <Input value={formData.customer.contactPersonName} onChange={(value) => patch('customer', { contactPersonName: value })} fullWidth />
              </FormField>
              <FormField label="Contact Number" required error={Boolean(errors.contactNumber)} helperText={errors.contactNumber}>
                <Input value={formData.customer.contactNumber} onChange={(value) => patch('customer', { contactNumber: value })} fullWidth />
              </FormField>
              <FormField label="Email Address" required error={Boolean(errors.emailAddress)} helperText={errors.emailAddress}>
                <Input value={formData.customer.emailAddress} onChange={(value) => patch('customer', { emailAddress: value })} fullWidth />
              </FormField>
              <FormField label="Alternate Contact Number">
                <Input value={formData.customer.alternateContactNumber ?? ''} onChange={(value) => patch('customer', { alternateContactNumber: value })} fullWidth />
              </FormField>
              <FormField label="Company Website">
                <Input value={formData.customer.companyWebsite ?? ''} onChange={(value) => patch('customer', { companyWebsite: value })} fullWidth />
              </FormField>
              <FormField label="Company Address">
                <Textarea value={formData.customer.companyAddress ?? ''} onChange={(value) => patch('customer', { companyAddress: value })} minRows={2} fullWidth />
              </FormField>
            </FormSection>

            <FormSection title="Section B - Visa Requirement Details" columns={2}>
              <FormField label="Country Requirement" required error={Boolean(errors.countries)} helperText={errors.countries}>
                <MultiSelect value={formData.visaRequirement.countries} onChange={(value) => patch('visaRequirement', { countries: value.map(String) })} options={countryOptions} fullWidth />
              </FormField>
              <FormField label="Visa Type" required error={Boolean(errors.visaType)} helperText={errors.visaType}>
                <Input value={formData.visaRequirement.visaType} onChange={(value) => patch('visaRequirement', { visaType: value })} fullWidth />
              </FormField>
              <FormField label="Purpose of Visit">
                <Input value={formData.visaRequirement.purposeOfVisit} onChange={(value) => patch('visaRequirement', { purposeOfVisit: value })} fullWidth />
              </FormField>
              <FormField label="Number of Applicants">
                <Input
                  type="number"
                  value={String(formData.visaRequirement.numberOfApplicants)}
                  onChange={(value) => patch('visaRequirement', { numberOfApplicants: Number(value || 0) })}
                  fullWidth
                />
              </FormField>
              <FormField label="Marine Requirement Toggle">
                <Toggle checked={formData.visaRequirement.marineRequirement} onChange={(value) => patch('visaRequirement', { marineRequirement: value })} />
              </FormField>
              <FormField label="Tentative Travel Date">
                <Input type="date" value={formData.visaRequirement.tentativeTravelDate ?? ''} onChange={(value) => patch('visaRequirement', { tentativeTravelDate: value })} fullWidth />
              </FormField>
            </FormSection>

            <FormSection title="Section C - Operational Requirements" columns={3}>
              <FormField label="Bulk Upload Required"><Toggle checked={formData.operationalRequirements.bulkUploadRequired} onChange={(value) => patch('operationalRequirements', { bulkUploadRequired: value })} /></FormField>
              <FormField label="Document Pickup Required"><Toggle checked={formData.operationalRequirements.documentPickupRequired} onChange={(value) => patch('operationalRequirements', { documentPickupRequired: value })} /></FormField>
              <FormField label="Ground Operations Required"><Toggle checked={formData.operationalRequirements.groundOperationsRequired} onChange={(value) => patch('operationalRequirements', { groundOperationsRequired: value })} /></FormField>
              <FormField label="Biometrics Assistance Required"><Toggle checked={formData.operationalRequirements.biometricsAssistanceRequired} onChange={(value) => patch('operationalRequirements', { biometricsAssistanceRequired: value })} /></FormField>
              <FormField label="Courier Support Required"><Toggle checked={formData.operationalRequirements.courierSupportRequired} onChange={(value) => patch('operationalRequirements', { courierSupportRequired: value })} /></FormField>
              <FormField label="Dedicated SPOC Required"><Toggle checked={formData.operationalRequirements.dedicatedSpocRequired} onChange={(value) => patch('operationalRequirements', { dedicatedSpocRequired: value })} /></FormField>
            </FormSection>

            <FormSection title="Section D - Enquiry Source & Sales Details" columns={2}>
              <FormField label="Inquiry Source">
                <Select
                  value={formData.salesDetails.inquirySource}
                  onChange={(value) => patch('salesDetails', { inquirySource: String(value) as typeof formData.salesDetails.inquirySource })}
                  options={[
                    { label: 'Website', value: 'website' },
                    { label: 'Referral', value: 'referral' },
                    { label: 'Existing Customer', value: 'existing_customer' },
                    { label: 'Email', value: 'email' },
                    { label: 'Call', value: 'call' },
                    { label: 'Sales Team', value: 'sales_team' },
                  ]}
                  fullWidth
                />
              </FormField>
              <FormField label="Assigned Sales Person">
                <Input value={formData.salesDetails.assignedSalesPerson ?? ''} onChange={(value) => patch('salesDetails', { assignedSalesPerson: value })} fullWidth />
              </FormField>
              <FormField label="Assigned Operations Team">
                <Input value={formData.salesDetails.assignedOperationsTeam ?? ''} onChange={(value) => patch('salesDetails', { assignedOperationsTeam: value })} fullWidth />
              </FormField>
              <FormField label="Branch">
                <Input value={formData.salesDetails.branch ?? ''} onChange={(value) => patch('salesDetails', { branch: value })} fullWidth />
              </FormField>
            </FormSection>

            <FormSection title="Section E - Discussion Notes" columns={2}>
              <FormField label="Initial Discussion Notes">
                <Textarea value={formData.notes.initialDiscussionNotes ?? ''} onChange={(value) => patch('notes', { initialDiscussionNotes: value })} minRows={3} fullWidth />
              </FormField>
              <FormField label="Customer Expectations">
                <Textarea value={formData.notes.customerExpectations ?? ''} onChange={(value) => patch('notes', { customerExpectations: value })} minRows={3} fullWidth />
              </FormField>
              <FormField label="Special Instructions">
                <Textarea value={formData.notes.specialInstructions ?? ''} onChange={(value) => patch('notes', { specialInstructions: value })} minRows={3} fullWidth />
              </FormField>
              <FormField label="Internal Notes">
                <Textarea value={formData.notes.internalNotes ?? ''} onChange={(value) => patch('notes', { internalNotes: value })} minRows={3} fullWidth />
              </FormField>
            </FormSection>

            <FormSection title="Section F - Attachments" columns={1}>
              <FormField label="Requirement Documents / Passport Samples / Applicant Files / Supporting Docs">
                <FileUpload
                  multiple
                  onUpload={(files) =>
                    setFormData((prev) => ({
                      ...prev,
                      attachments: files.map((file, index) => ({
                        id: `TEMP-${index}`,
                        fileName: file.name,
                        fileType: file.type || 'file',
                        fileSizeKb: Math.round(file.size / 1024),
                        uploadedAt: new Date().toISOString(),
                        uploadedBy: 'Admin User',
                        version: 1,
                      })),
                    }))
                  }
                />
              </FormField>
            </FormSection>
          </Stack>
        </Box>
        <Box sx={{ px: 2.5, py: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
            <Button
              label="Save Draft"
              variant="outlined"
              loading={loading}
              onClick={async () => {
                setLoading(true)
                await enquiryService.create({ ...formData, status: 'new' }, 'Admin User')
                setLoading(false)
                showToast({ title: 'Draft saved', variant: 'info' })
                navigate('/admin/customer-accounts/enquiries')
              }}
            />
            <Button label="Submit Enquiry" loading={loading} onClick={() => void handleSubmit(false)} />
            <Button label="Save & Assign" variant="outlined" loading={loading} onClick={() => void handleSubmit(true)} />
            <Button label="Cancel" variant="text" onClick={() => navigate('/admin/customer-accounts/enquiries')} />
          </Stack>
        </Box>
      </BaseCard>
    </Stack>
  )
}
