import { useRef, useState } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Download, Eye, Plus, Replace } from 'lucide-react'
import { Button, IconButton, useToast } from '@/design-system/UIComponents'
import { vendorService } from '@/shared/services/vendorService'
import type { Vendor } from '@/shared/types/vendor'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { vendorDocumentTypeLabel } from '../../config/vendorDocumentTypes'
import { VendorDocumentUploadModal } from '../VendorDocumentUploadModal'

interface VendorDocumentsTabProps {
  vendor: Vendor
  onUpdated: () => void
}

export function VendorDocumentsTab({ vendor, onUpdated }: VendorDocumentsTabProps) {
  const { showToast } = useToast()
  const [uploadOpen, setUploadOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceDocIdRef = useRef<string>('')

  const triggerReplace = (docId: string) => {
    replaceDocIdRef.current = docId
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !replaceDocIdRef.current) return
    vendorService.replaceDocument(vendor.id, replaceDocIdRef.current, { fileName: file.name })
    showToast({ title: 'Document replaced', description: file.name, variant: 'success' })
    event.target.value = ''
    replaceDocIdRef.current = ''
    onUpdated()
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button label="Upload document" startIcon={<Plus size={14} />} onClick={() => setUploadOpen(true)} />
      </Stack>

      {vendor.documents.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No documents uploaded yet.</Box>
      ) : (
        <Box sx={agreementEmbeddedTableSx}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Document name</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Document type</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Uploaded date</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Uploaded by</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendor.documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.documentName}</TableCell>
                  <TableCell>{vendorDocumentTypeLabel[doc.documentType]}</TableCell>
                  <TableCell>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>{doc.uploadedBy ?? '—'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton
                        icon={<Eye size={14} />}
                        tooltip="View document"
                        onClick={() =>
                          showToast({
                            title: 'Preview',
                            description: doc.fileName ? `Previewing ${doc.fileName}` : 'No file attached.',
                            variant: 'info',
                          })
                        }
                      />
                      <IconButton
                        icon={<Download size={14} />}
                        tooltip="Download document"
                        onClick={() =>
                          showToast({
                            title: 'Download',
                            description: doc.fileName ? `Downloading ${doc.fileName}` : 'No file to download.',
                            variant: 'info',
                          })
                        }
                      />
                      <IconButton
                        icon={<Replace size={14} />}
                        tooltip="Replace document"
                        onClick={() => triggerReplace(doc.id)}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <input ref={fileInputRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      <VendorDocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={(payload) => {
          vendorService.addDocument(vendor.id, payload)
          showToast({ title: 'Document uploaded', variant: 'success' })
          setUploadOpen(false)
          onUpdated()
        }}
      />
    </Stack>
  )
}
