import { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  BaseCard,
  ConfirmDialog,
  EmptyState,
  RichTextContent,
  useToast,
} from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { DocumentMasterStatus } from '@/shared/types/documentMaster'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { DocumentDeleteDialog } from '../components/DocumentDeleteDialog'
import { DocumentDetailSummary } from '../components/DocumentDetailSummary'
import { DocumentFormModal } from '../components/DocumentFormModal'
import { documentStatusLabel } from '../config/documentStatusConfig'

const DOCUMENT_LISTING_PATH = '/admin/masters/documents'

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'pre-wrap' }}>
        {value || '--'}
      </Typography>
    </Box>
  )
}

export function DocumentDetailPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, DOCUMENT_LISTING_PATH)
  const [searchParams] = useSearchParams()
  const { documentId } = useParams<{ documentId: string }>()
  const [editOpen, setEditOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const document = useMemo(() => {
    void refreshKey
    return documentId ? documentMasterService.getById(documentId) : undefined
  }, [documentId, refreshKey])

  const reload = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    if (searchParams.get('edit') !== '1' || !documentId) return
    setEditOpen(true)
    navigate(`/admin/masters/documents/${documentId}`, { replace: true })
  }, [documentId, navigate, searchParams])

  if (!documentId) {
    return (
      <EmptyState
        variant="no-results"
        title="Document not found"
        action={{
          label: 'Back to Document Master',
          onClick: () => navigate(listingHref),
        }}
      />
    )
  }

  if (!document) {
    return (
      <EmptyState
        variant="no-results"
        title="Document not found"
        description="This document may have been removed."
        action={{
          label: 'Back to Document Master',
          onClick: () => navigate(listingHref),
        }}
      />
    )
  }

  const handleConfirmStatus = async () => {
    const nextStatus: DocumentMasterStatus =
      document.status === 'active' ? 'inactive' : 'active'
    setActionLoading(true)
    documentMasterService.setStatus(document.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Document activated' : 'Document deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    reload()
  }

  const handleConfirmDelete = async () => {
    setActionLoading(true)
    const result = documentMasterService.remove(document.id)
    setActionLoading(false)
    if (!result.ok) {
      showToast({
        title: 'Cannot delete document',
        description:
          result.reason === 'in_use'
            ? 'This document is referenced in country checklists.'
            : 'Document not found.',
        variant: 'error',
      })
      setDeleteOpen(false)
      return
    }
    showToast({ title: 'Document deleted', variant: 'success' })
    navigate(listingHref)
  }

  const pendingStatusLabel = document.status === 'active' ? 'deactivate' : 'activate'

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Masters', href: listingHref },
          { label: 'Document Master', href: listingHref },
          { label: document.documentType },
        ]}
        summary={
          <DocumentDetailSummary
            document={document}
            onEdit={() => setEditOpen(true)}
            onToggleStatus={() => setStatusOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        }
      >
        <Stack spacing={2}>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="text.secondary">
                Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReadOnlyField label="Document type" value={document.documentType} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReadOnlyField label="Status" value={documentStatusLabel[document.status]} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Description
                    </Typography>
                    {document.description ? (
                      <RichTextContent content={document.description} sx={{ mt: 0.5 }} />
                    ) : (
                      <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                        --
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </BaseCard>
          <BaseCard sx={{ p: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created on {new Date(document.createdAt).toLocaleDateString()}. Last updated on{' '}
                {new Date(document.updatedAt).toLocaleDateString()}.
              </Typography>
            </Stack>
          </BaseCard>
        </Stack>
      </AdminDetailShell>

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={handleConfirmStatus}
        title={`${pendingStatusLabel.charAt(0).toUpperCase()}${pendingStatusLabel.slice(1)} document?`}
        description={`Set "${document.documentType}" to ${document.status === 'active' ? 'inactive' : 'active'}?`}
        confirmLabel={document.status === 'active' ? 'Deactivate' : 'Activate'}
        loading={actionLoading}
      />

      <DocumentFormModal
        open={editOpen}
        record={document}
        navigateToDetailOnCreate={false}
        onClose={() => setEditOpen(false)}
        onSaved={reload}
      />

      <DocumentDeleteDialog
        open={deleteOpen}
        document={document}
        loading={actionLoading}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
