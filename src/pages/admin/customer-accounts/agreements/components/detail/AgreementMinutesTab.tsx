import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { FileText } from 'lucide-react'
import { BaseCard, Button, FileUpload, useToast } from '@/design-system/UIComponents'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

interface AgreementMinutesTabProps {
  agreement: CommercialAgreement
  onReload: () => void
}

function formatFileType(fileType: string, fileName: string): string {
  if (fileType && fileType !== 'file' && !fileType.includes('/')) return fileType.toUpperCase()
  if (fileType.includes('/')) {
    const subtype = fileType.split('/')[1] ?? ''
    if (subtype.includes('word') || subtype.includes('document')) return 'WORD'
    if (subtype === 'pdf') return 'PDF'
    if (subtype) return subtype.toUpperCase()
  }
  const ext = fileName.includes('.') ? fileName.split('.').pop() : ''
  return (ext || 'FILE').toUpperCase()
}

export function AgreementMinutesTab({ agreement, onReload }: AgreementMinutesTabProps) {
  const { showToast } = useToast()
  const [uploadKey, setUploadKey] = useState(0)
  const minutes = agreement.minutes ?? []

  const handleUpload = (files: File[]) => {
    if (files.length === 0) return
    const updated = commercialAgreementService.addMinutes(
      agreement.id,
      files.map((file) => ({
        fileName: file.name,
        fileType: file.type || 'file',
        fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
      })),
    )
    if (!updated) {
      showToast({ title: 'Upload failed', description: 'Unable to save minutes for this agreement.', variant: 'error' })
      return
    }
    showToast({
      title: files.length === 1 ? 'Minutes uploaded' : `${files.length} files uploaded`,
      description: files.map((f) => f.name).join(', '),
      variant: 'success',
    })
    setUploadKey((key) => key + 1)
    onReload()
  }

  return (
    <Stack spacing={2}>
      <FileUpload
        key={uploadKey}
        multiple
        dropzoneTitle="Upload meeting minutes"
        dropzoneCaption="PDF, Word, or any file format — drag & drop or browse"
        browseLabel="Browse files"
        onUpload={handleUpload}
        onError={(message) => showToast({ title: 'Upload failed', description: message, variant: 'error' })}
      />

      {minutes.length === 0 ? (
        <BaseCard sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No minutes uploaded yet. Upload PDF, Word, or any supporting file from meetings with this client.
          </Typography>
        </BaseCard>
      ) : (
        <Stack spacing={1.25}>
          {minutes.map((item) => (
            <BaseCard key={item.id} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                  <FileText size={20} style={{ opacity: 0.45, flexShrink: 0 }} />
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {item.fileName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileType(item.fileType, item.fileName)} · {item.fileSizeKb} KB ·{' '}
                      {formatDisplayDateTime(item.uploadedAt)} · {item.uploadedBy}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1} flexShrink={0}>
                  <Button
                    label="Download"
                    variant="outlined"
                    size="sm"
                    onClick={() =>
                      showToast({
                        title: 'Download started',
                        description: item.fileName,
                        variant: 'info',
                      })
                    }
                  />
                  <Button
                    label="Delete"
                    variant="outlined"
                    color="error"
                    size="sm"
                    onClick={() => {
                      const updated = commercialAgreementService.removeMinute(agreement.id, item.id)
                      if (!updated) {
                        showToast({ title: 'Unable to delete', variant: 'error' })
                        return
                      }
                      showToast({ title: 'Minutes removed', description: item.fileName, variant: 'success' })
                      onReload()
                    }}
                  />
                </Stack>
              </Stack>
            </BaseCard>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
