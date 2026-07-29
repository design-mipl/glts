import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { enquiryService } from '@/shared/services/enquiryService'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { buildEnquiryFormSections } from '../components/EnquiryFormSections'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { getEnquiryActor } from '../utils/enquiryActor'
import { enquiryRecordToFormData } from '../utils/enquiryFormUtils'

const ENQUIRY_LISTING_PATH = '/admin/customer-accounts/enquiries'

export function EditEnquiryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, ENQUIRY_LISTING_PATH)
  const { showToast } = useToast()
  const { enquiryId } = useParams<{ enquiryId: string }>()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isConverted, setIsConverted] = useState(false)
  const { formData, setFormData, errors, validate } = useEnquiryForm()

  useEffect(() => {
    if (!enquiryId) {
      setNotFound(true)
      setPageLoading(false)
      return
    }
    void enquiryService.getById(enquiryId).then((record) => {
      if (!record) {
        setNotFound(true)
      } else {
        setIsConverted(record.status === 'converted')
        setFormData(enquiryRecordToFormData(record))
      }
      setPageLoading(false)
    })
  }, [enquiryId, setFormData])

  const enquiryDetailHref = enquiryId
    ? `/admin/customer-accounts/enquiries/${enquiryId}`
    : listingHref

  const breadcrumbs = [
    { label: 'Client Management', href: listingHref },
    { label: 'Lead Management', href: listingHref },
    { label: enquiryId ?? 'Edit', href: enquiryDetailHref },
    { label: 'Edit' },
  ]

  if (pageLoading) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading enquiry…
        </Typography>
      </Box>
    )
  }

  if (notFound) {
    return (
      <EmptyState
        title="Enquiry not found"
        description="The enquiry you are trying to edit does not exist or was removed."
        action={{ label: 'Back to enquiries', onClick: () => navigate(listingHref) }}
      />
    )
  }

  if (isConverted) {
    return (
      <EmptyState
        title="Cannot edit converted enquiry"
        description="This enquiry has been converted to a quotation and can no longer be edited."
        action={{
          label: 'View enquiry',
          onClick: () => navigate(enquiryDetailHref, { state: location.state }),
        }}
      />
    )
  }

  const handleSave = async () => {
    if (!enquiryId || !validate()) return
    setLoading(true)
    await enquiryService.update(enquiryId, formData, getEnquiryActor())
    setLoading(false)
    showToast({ title: 'Enquiry updated', variant: 'success' })
    navigate(enquiryDetailHref, { state: location.state })
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Edit Enquiry"
      headerActions={
        <AdminFullPageFormHeaderSave loading={loading} onClick={() => void handleSave()} />
      }
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(enquiryDetailHref, { state: location.state })}
          onSave={() => void handleSave()}
        />
      }
      sections={buildEnquiryFormSections({ formData, setFormData, errors, showFileUpload: true })}
    />
  )
}
