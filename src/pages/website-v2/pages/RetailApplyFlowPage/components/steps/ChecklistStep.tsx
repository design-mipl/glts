import { Box, Stack, Typography } from '@mui/material'
import { Check, Upload } from 'lucide-react'
import { brandPrimaryGreenRgb, usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  retailFlowLayout,
  retailFlowType,
} from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from '../StepShell'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import type { RetailCapturedImage } from '../../types'

interface ChecklistStepProps {
  documents: RetailChecklistDocument[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage) => void
  onBack: () => void
  onContinue: () => void
}

export function ChecklistStep({ documents, uploads, onUpload, onBack, onContinue }: ChecklistStepProps) {
  const colors = usePublicBrandColors()
  const readyCount = documents.filter((doc) => uploads[doc.documentId]).length
  const mandatoryComplete = documents.filter((doc) => doc.mandatory).every((doc) => uploads[doc.documentId])

  function handleFile(documentId: string, file: File) {
    const reader = new FileReader()
    reader.onload = () => onUpload(documentId, { dataUrl: reader.result as string, capturedAt: new Date().toISOString() })
    reader.readAsDataURL(file)
  }

  return (
    <StepShell
      title="Your documents"
      helperText={`${readyCount} of ${documents.length} complete`}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!mandatoryComplete}
    >
      <Stack spacing={1}>
        {documents.map((doc) => {
          const uploaded = Boolean(uploads[doc.documentId])
          return (
            <Stack
              key={doc.documentId}
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                border: `1px solid ${uploaded ? `rgba(${brandPrimaryGreenRgb}, 0.4)` : colors.border}`,
                borderRadius: retailFlowLayout.controlRadius,
                bgcolor: uploaded ? `rgba(${brandPrimaryGreenRgb}, 0.06)` : colors.white,
                px: 1.75,
                py: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: retailFlowLayout.checkRadius,
                  backgroundColor: uploaded ? colors.greenBright : colors.surfaceAlt,
                  color: uploaded ? colors.onBrandFilled : colors.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {uploaded ? <Check size={12} strokeWidth={3} /> : '○'}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                  {doc.name}
                  {!doc.mandatory ? ' (optional)' : ''}
                </Typography>
                {doc.description ? (
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>{doc.description}</Typography>
                ) : null}
              </Box>
              {uploaded ? (
                <Typography
                  sx={{
                    ...retailFlowType.sectionLabel,
                    color: colors.textMuted,
                    flexShrink: 0,
                  }}
                >
                  Ready
                </Typography>
              ) : (
                <Box
                  component="label"
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: colors.greenDark,
                    bgcolor: colors.greenMuted,
                    border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.15)`,
                    borderRadius: '5px',
                    px: 1.5,
                    py: 0.75,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Upload size={12} /> Upload
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) handleFile(doc.documentId, file)
                    }}
                  />
                </Box>
              )}
            </Stack>
          )
        })}
      </Stack>
    </StepShell>
  )
}
