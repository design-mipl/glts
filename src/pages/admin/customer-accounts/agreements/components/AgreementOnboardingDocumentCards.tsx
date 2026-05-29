import { Grid, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import { useToast } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { AgreementOnboardingDocumentCard } from './AgreementOnboardingDocumentCard'

interface AgreementOnboardingDocumentCardsProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
}

export function AgreementOnboardingDocumentCards({ data, onChange }: AgreementOnboardingDocumentCardsProps) {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeDocKeyRef = useRef<string>('')

  const updateDocument = (documentKey: string, patch: Partial<CommercialAgreementFormData['documents'][0]>) => {
    onChange({
      ...data,
      documents: data.documents.map((d) => (d.documentKey === documentKey ? { ...d, ...patch } : d)),
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

  return (
    <Stack spacing={1.5}>
      {data.agreementType === 'agreemented' ? (
        <Typography variant="caption" color="text.secondary">
          Agreement document upload is mandatory for agreemented type.
        </Typography>
      ) : null}
      <Grid container spacing={2}>
        {data.documents.map((doc) => (
          <Grid key={doc.documentKey} size={{ xs: 12, md: 6 }}>
            <AgreementOnboardingDocumentCard
              document={doc}
              onUpload={() => triggerUpload(doc.documentKey)}
              onReplace={() => triggerUpload(doc.documentKey)}
              onPreview={() =>
                showToast({
                  title: 'Preview',
                  description: doc.fileName ? `Previewing ${doc.fileName}` : 'Upload a document first.',
                  variant: 'info',
                })
              }
              onDownload={() =>
                showToast({
                  title: 'Download',
                  description: doc.fileName ? `Downloading ${doc.fileName}` : 'No file to download.',
                  variant: 'info',
                })
              }
            />
          </Grid>
        ))}
      </Grid>
      <input ref={fileInputRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </Stack>
  )
}
