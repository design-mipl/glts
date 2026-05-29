import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { EmptyState, useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { documentMasterService } from '@/shared/services/documentMasterService'
import { DocumentFormFields } from '../components/DocumentFormFields'
import { useDocumentForm } from '../hooks/useDocumentForm'

const listBreadcrumbs = [
  { label: 'Masters', href: '/admin/masters/documents' },
  { label: 'Document Master', href: '/admin/masters/documents' },
]

export function EditDocumentPage() {
  const navigate = useNavigate()
  const { documentId } = useParams<{ documentId: string }>()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useDocumentForm()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!documentId) {
      setPageLoading(false)
      return
    }
    const found = documentMasterService.getById(documentId)
    if (found) {
      reset({
        documentType: found.documentType,
        description: found.description,
        status: found.status,
      })
    }
    setPageLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per route id
  }, [documentId])

  const record = documentId ? documentMasterService.getById(documentId) : undefined

  const handleSubmit = async () => {
    if (!documentId || !validate()) return
    setLoading(true)
    const updated = documentMasterService.update(documentId, formData)
    setLoading(false)
    if (!updated) {
      showToast({ title: 'Document not found', variant: 'error' })
      return
    }
    showToast({ title: 'Document updated', variant: 'success' })
    navigate(`/admin/masters/documents/${documentId}`)
  }

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!record) {
    return (
      <EmptyState
        variant="no-results"
        title="Document not found"
        description="This document may have been removed."
        action={{
          label: 'Back to Document Master',
          onClick: () => navigate('/admin/masters/documents'),
        }}
      />
    )
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={[...listBreadcrumbs, { label: record.documentType, href: `/admin/masters/documents/${record.id}` }, { label: 'Edit' }]}
      title="Edit Document"
      headerActions={
        <AdminFullPageFormHeaderSave loading={loading} onClick={() => void handleSubmit()} />
      }
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(`/admin/masters/documents/${record.id}`)}
          onSave={() => void handleSubmit()}
        />
      }
      sections={[
        {
          id: 'primary',
          title: 'Document details',
          columns: 1,
          children: (
            <DocumentFormFields
              formData={formData}
              onChange={setFormData}
              errors={errors}
              documentId={record.id}
            />
          ),
        },
      ]}
    />
  )
}
