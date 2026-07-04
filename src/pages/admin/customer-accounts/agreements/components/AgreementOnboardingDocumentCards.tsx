import { Grid, Stack } from '@mui/material'
import { useRef } from 'react'
import { useToast } from '@/design-system/UIComponents'
import type { AgreementOnboardingDocument, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import {
  downloadAgreementDocument,
  previewAgreementDocument,
} from '@/shared/utils/agreementDocumentFileUtils'
import { normalizeDocumentKey } from '@/shared/utils/agreementDocumentUtils'
import { AgreementOnboardingDocumentCard } from './AgreementOnboardingDocumentCard'

interface AgreementOnboardingDocumentCardsProps {
  documents: AgreementOnboardingDocument[]
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}

export function AgreementOnboardingDocumentCards({
  documents,
  data,
  onChange,
  readOnly = false,
}: AgreementOnboardingDocumentCardsProps) {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeDocKeyRef = useRef<string>('')

  const updateDocument = (documentKey: string, patch: Partial<AgreementOnboardingDocument>) => {
    const normalizedKey = normalizeDocumentKey(documentKey)
    onChange({
      ...data,
      documents: data.documents.map((doc) =>
        normalizeDocumentKey(doc.documentKey) === normalizedKey ? { ...doc, ...patch } : doc,
      ),
    })
  }

  const triggerUpload = (documentKey: string) => {
    activeDocKeyRef.current = documentKey
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !activeDocKeyRef.current) return
    updateDocument(activeDocKeyRef.current, {
      status: 'uploaded',
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    })
    showToast({ title: 'Document uploaded', description: file.name, variant: 'success' })
    event.target.value = ''
  }

  const handlePreview = (doc: AgreementOnboardingDocument) => {
    if (!doc.fileName) {
      showToast({ title: 'No file to preview', variant: 'warning' })
      return
    }
    previewAgreementDocument(doc)
  }

  const handleDownload = (doc: AgreementOnboardingDocument) => {
    if (!doc.fileName) {
      showToast({ title: 'No file to download', variant: 'warning' })
      return
    }
    downloadAgreementDocument(doc)
    showToast({ title: 'Download started', description: doc.fileName, variant: 'success' })
  }

  return (
    <Stack spacing={1.5}>
      <Grid container spacing={2}>
        {documents.map((doc) => (
          <Grid key={doc.documentKey} size={{ xs: 12, md: 6 }}>
            <AgreementOnboardingDocumentCard
              document={doc}
              readOnly={readOnly}
              onUpload={() => triggerUpload(doc.documentKey)}
              onReplace={() => triggerUpload(doc.documentKey)}
              onPreview={() => handlePreview(doc)}
              onDownload={() => handleDownload(doc)}
            />
          </Grid>
        ))}
      </Grid>
      {!readOnly ? (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      ) : null}
    </Stack>
  )
}
