import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Camera, FileText, IdCard, IndianRupee } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx } from '@/pages/website-v2/theme/retailFlowTokens'
import { DocumentChecklistRow } from '@/pages/website-v2/components/documentChecklist/DocumentChecklistRow'
import { WhyWeAskSheet } from '@/pages/website-v2/components/WhyWeAskSheet'
import {
  resolveDocumentWhyContent,
  type DocumentWhyContent,
} from '@/pages/website-v2/config/documentWhyContent'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import { StepShell } from '../StepShell'

interface OriginalDocumentsStepProps {
  documents: RetailChecklistDocument[]
  onBack: () => void
  onContinue: () => void
  /** Preview-only: skip StepShell chrome. */
  previewOnly?: boolean
}

function docIcon(doc: RetailChecklistDocument): LucideIcon {
  const hay = `${doc.documentId} ${doc.name}`.toLowerCase()
  if (/photo|photograph/.test(hay)) return Camera
  if (/passport/.test(hay)) return FileText
  if (/aadhaar|aadhar|pan|id/.test(hay)) return IdCard
  if (/bank|statement|financial|salary|itr/.test(hay)) return IndianRupee
  return FileText
}

export function OriginalDocumentsStep({
  documents,
  onBack,
  onContinue,
  previewOnly = false,
}: OriginalDocumentsStepProps) {
  const colors = usePublicBrandColors()
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)
  const originals = documents.filter((doc) => doc.originalDocument)

  const body = (
    <>
      <Box
        sx={{
          ...getElevatedCardSx(colors.border),
          borderRadius: BORDER_RADIUS.lg,
          bgcolor: colors.white,
          overflow: 'hidden',
        }}
      >
        {originals.length === 0 ? (
          <Typography sx={{ fontSize: 13.5, color: colors.textMuted, p: 2 }}>
            No physical originals are required for this visa.
          </Typography>
        ) : (
          <Stack spacing={0} sx={{ px: 0.5, py: 0.5 }}>
            {originals.map((doc) => (
              <DocumentChecklistRow
                key={doc.documentId}
                icon={docIcon(doc)}
                name={doc.name}
                description={
                  doc.description ??
                  'Upload is done — the embassy still needs the physical original.'
                }
                statusTag={{ label: 'Original required', tone: 'original' }}
                onInfoClick={() =>
                  setWhyContent(
                    resolveDocumentWhyContent({
                      documentId: doc.documentId,
                      name: doc.name,
                      description: doc.description,
                    }),
                  )
                }
              />
            ))}
          </Stack>
        )}
      </Box>

      <WhyWeAskSheet open={Boolean(whyContent)} content={whyContent} onClose={() => setWhyContent(null)} />
    </>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="These need physical originals"
      helperText="The embassy requires original copies of the following — we'll arrange collection next."
      onBack={onBack}
      onContinue={onContinue}
      contentMaxWidth={640}
    >
      {body}
    </StepShell>
  )
}
