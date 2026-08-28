import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Camera, FileText, IdCard, IndianRupee } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DocumentChecklistRow } from '@/pages/website-v2/components/documentChecklist/DocumentChecklistRow'
import { WhyWeAskSheet } from '@/pages/website-v2/components/WhyWeAskSheet'
import {
  resolveDocumentWhyContent,
  type DocumentWhyContent,
} from '@/pages/website-v2/config/documentWhyContent'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import { StepShell } from '../StepShell'
import { applyFlow, applyFont } from '@/pages/website-v2/theme/applyFlowTheme'
import { SectionHeading } from '@/pages/website-v2/theme/applyFormControls'

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
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)
  const originals = documents.filter((doc) => doc.originalDocument)

  const body = (
    <>
      <Box sx={{ width: '100%' }}>
        <SectionHeading>{`Originals required — ${originals.length}`}</SectionHeading>
        {originals.length === 0 ? (
          <Typography
            sx={{ fontFamily: applyFont.body, fontSize: 13.5, color: applyFlow.inkMuted, py: 4 }}
          >
            No physical originals are required for this visa.
          </Typography>
        ) : (
          originals.map((doc) => (
            <DocumentChecklistRow
              key={doc.documentId}
              icon={docIcon(doc)}
              name={doc.name}
              description="Already uploaded — the embassy still needs the physical copy."
              statusTag={{ label: 'Original', tone: 'original' }}
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
          ))
        )}
      </Box>

      <WhyWeAskSheet open={Boolean(whyContent)} content={whyContent} onClose={() => setWhyContent(null)} />
    </>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="We also need these as originals"
      helperText="The embassy requires original copies of the following — we'll arrange collection next."
      onBack={onBack}
      onContinue={onContinue}
      contentMaxWidth={640}
    >
      {body}
    </StepShell>
  )
}
