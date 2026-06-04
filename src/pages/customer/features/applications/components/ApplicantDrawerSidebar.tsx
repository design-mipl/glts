import { Stack, Typography } from '@mui/material'
import type { ApplicantAdditionalDetails } from '../config/applicantAdditionalDetailsConfig'
import type { ApplicantBasicDetails } from '../config/applicantBasicDetailsConfig'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'
import {
  ApplicantAdditionalDetailsCollapsedHint,
  ApplicantAdditionalDetailsNavPreview,
} from './ApplicantAdditionalDetailsNavPreview'
import {
  ApplicantBasicDetailsCollapsedHint,
  ApplicantBasicDetailsNavPreview,
} from './ApplicantBasicDetailsNavPreview'
import { ApplicantDocumentChecklistNav } from './ApplicantDocumentChecklistNav'
import {
  ApplicantDrawerNavSection,
  drawerNavSummaryPill,
  type DrawerNavSummaryVariant,
} from './ApplicantDrawerNavSection'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export type ApplicantDrawerSection = 'basic' | 'documents' | 'additional'

interface ApplicantDrawerSidebarProps {
  activeSection: ApplicantDrawerSection
  onSectionChange: (section: ApplicantDrawerSection) => void
  basicDetails: ApplicantBasicDetails
  basicComplete: number
  basicTotal: number
  documents: ApplicantDocumentItem[]
  activeDocumentId?: string
  documentsComplete: number
  documentsTotal: number
  onDocumentSelect: (documentId: string) => void
  additionalDetails: ApplicantAdditionalDetails
  additionalStatusLabel: string
}

function basicSummaryVariant(complete: number, total: number): DrawerNavSummaryVariant {
  return complete === total ? 'complete' : complete > 0 ? 'progress' : 'neutral'
}

function documentsSummaryVariant(complete: number, total: number): DrawerNavSummaryVariant {
  return complete === total ? 'complete' : complete > 0 ? 'progress' : 'neutral'
}

function additionalSummaryVariant(label: string): DrawerNavSummaryVariant {
  return label === 'In progress' ? 'progress' : 'neutral'
}

export function ApplicantDrawerSidebar({
  activeSection,
  onSectionChange,
  basicDetails,
  basicComplete,
  basicTotal,
  documents,
  activeDocumentId,
  documentsComplete,
  documentsTotal,
  onDocumentSelect,
  additionalDetails,
  additionalStatusLabel,
}: ApplicantDrawerSidebarProps) {
  const colors = usePublicBrandColors()

  const documentsActive = activeSection === 'documents'

  return (
    <Stack
      spacing={1.5}
      sx={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ApplicantDrawerNavSection
        step={1}
        title="Basic details"
        selected={activeSection === 'basic'}
        expanded={activeSection === 'basic'}
        onSelect={() => onSectionChange('basic')}
        summary={drawerNavSummaryPill(
          `${basicComplete}/${basicTotal}`,
          colors,
          basicSummaryVariant(basicComplete, basicTotal),
        )}
        collapsedHint={<ApplicantBasicDetailsCollapsedHint details={basicDetails} />}
      >
        <ApplicantBasicDetailsNavPreview details={basicDetails} />
      </ApplicantDrawerNavSection>

      <ApplicantDrawerNavSection
        step={2}
        title="Document checklist"
        selected={documentsActive}
        expanded={documentsActive}
        fillAvailableHeight={documentsActive}
        onSelect={() => onSectionChange('documents')}
        summary={drawerNavSummaryPill(
          `${documentsComplete}/${documentsTotal}`,
          colors,
          documentsSummaryVariant(documentsComplete, documentsTotal),
        )}
        collapsedHint={
          <DocumentsCollapsedHint
            complete={documentsComplete}
            total={documentsTotal}
            colors={colors}
          />
        }
      >
        <ApplicantDocumentChecklistNav
          documents={documents}
          activeDocumentId={activeDocumentId}
          onSelect={onDocumentSelect}
        />
      </ApplicantDrawerNavSection>

      <ApplicantDrawerNavSection
        step={3}
        title="Additional details"
        selected={activeSection === 'additional'}
        expanded={activeSection === 'additional'}
        onSelect={() => onSectionChange('additional')}
        summary={drawerNavSummaryPill(
          additionalStatusLabel,
          colors,
          additionalSummaryVariant(additionalStatusLabel),
        )}
        collapsedHint={<ApplicantAdditionalDetailsCollapsedHint details={additionalDetails} />}
      >
        <ApplicantAdditionalDetailsNavPreview details={additionalDetails} />
      </ApplicantDrawerNavSection>
    </Stack>
  )
}

function DocumentsCollapsedHint({
  complete,
  total,
  colors,
}: {
  complete: number
  total: number
  colors: ReturnType<typeof usePublicBrandColors>
}) {
  return (
    <Typography sx={{ fontSize: 11.5, color: colors.textMuted, lineHeight: 1.4 }}>
      {complete} of {total} required documents uploaded
    </Typography>
  )
}
