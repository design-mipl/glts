import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { quotationService } from '@/shared/services/quotationService'
import { buildQuotationFormSections } from '../components/QuotationFormSections'
import { useQuotationForm } from '../hooks/useQuotationForm'

const breadcrumbs = [
  { label: 'Client Management', href: '/admin/customer-accounts/quotations' },
  { label: 'Quotations', href: '/admin/customer-accounts/quotations' },
  { label: 'Create Quotation' },
]

const ACTOR = 'Admin User'

export function CreateQuotationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const { formData, setFormData, selectedEnquiry, errors, validate, hydrateFromEnquiry, clearEnquirySelection } =
    useQuotationForm()
  const [loading, setLoading] = useState(false)
  const addPricingHandlerRef = useRef<(() => void) | null>(null)
  const enquiryHydratedRef = useRef<string | null>(null)

  const enquiryIdParam = searchParams.get('enquiryId')

  useEffect(() => {
    if (!enquiryIdParam || enquiryHydratedRef.current === enquiryIdParam) return
    enquiryHydratedRef.current = enquiryIdParam
    void hydrateFromEnquiry(enquiryIdParam).then((ok) => {
      if (!ok) {
        showToast({
          title: 'Enquiry unavailable',
          description: 'The enquiry was not found or is no longer eligible for quotation.',
          variant: 'error',
        })
      }
    })
  }, [enquiryIdParam, hydrateFromEnquiry, showToast])

  const save = async () => {
    if (!validate()) return
    setLoading(true)
    const record = quotationService.saveForm(undefined, formData, ACTOR)
    showToast({ title: 'Quotation saved', variant: 'success' })
    navigate(`/admin/customer-accounts/quotations/${record.id}`)
    setLoading(false)
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Create Quotation"
      headerActions={<AdminFullPageFormHeaderSave loading={loading} onClick={() => void save()} />}
      sections={buildQuotationFormSections({
        formData,
        setFormData,
        errors,
        selectedEnquiry,
        addPricingHandlerRef,
        onSelectEnquiry: (enquiryId) => void hydrateFromEnquiry(enquiryId),
        onClearEnquiry: clearEnquirySelection,
      })}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate('/admin/customer-accounts/quotations')}
          onSave={() => void save()}
          saveLabel="Save Quotation"
        />
      }
    />
  )
}
