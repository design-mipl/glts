import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { generateDocumentRuleId } from '@/shared/data/countryJurisdictionDefaults'
import type { CountryJurisdictionDocumentRule } from '@/shared/types/countryMaster'
import { CountryWorkspaceModeProvider } from '@/pages/admin/masters/country/components/workspace/countryWorkspaceModeContext'
import { DocumentCardList } from '@/pages/admin/masters/country/components/workspace/DocumentCardList'
import { AddDocumentModal } from '@/pages/admin/masters/country/components/workspace/drawers/AddDocumentModal'
import { buildReorderedDocumentIds } from '@/pages/admin/masters/country/utils/countryDocumentRuleUtils'

interface RequirementDocumentsTabProps {
  documents: CountryJurisdictionDocumentRule[]
  onChange: (documents: CountryJurisdictionDocumentRule[]) => void
}

export function RequirementDocumentsTab({ documents, onChange }: RequirementDocumentsTabProps) {
  const [addOpen, setAddOpen] = useState(false)

  const reorder = (index: number, direction: 'up' | 'down') => {
    const ids = buildReorderedDocumentIds(documents, 'jurisdiction', index, direction)
    if (!ids) return
    const byId = new Map(documents.map((document) => [document.id, document]))
    onChange(
      ids.map((id, sortOrder) => {
        const document = byId.get(id)
        return document ? { ...document, sortOrder } : document
      }).filter((document): document is CountryJurisdictionDocumentRule => Boolean(document)),
    )
  }

  return (
    <CountryWorkspaceModeProvider mode="edit">
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            label="Add document"
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={() => setAddOpen(true)}
          />
        </Box>
        <DocumentCardList
          segment="retail"
          rules={documents}
          showPhysicalDocumentToggle={false}
          onChange={(rule) =>
            onChange(documents.map((document) => (document.id === rule.id ? rule : document)))
          }
          onDuplicate={(rule) =>
            onChange([
              ...documents,
              { ...rule, id: generateDocumentRuleId(), sortOrder: documents.length },
            ])
          }
          onDelete={(rule) => onChange(documents.filter((document) => document.id !== rule.id))}
          onMoveUp={(index) => reorder(index, 'up')}
          onMoveDown={(index) => reorder(index, 'down')}
        />
      </Stack>

      <AddDocumentModal
        open={addOpen}
        segment="retail"
        group="jurisdiction"
        onClose={() => setAddOpen(false)}
        onSubmit={({ documentId, description, ownerType, sampleDocument }) => {
          onChange([
            ...documents,
            {
              id: generateDocumentRuleId(),
              documentId,
              group: 'jurisdiction',
              mandatory: true,
              ocrEnabled: documentId === 'passport',
              multipleUpload: false,
              commonDocument: false,
              originalDocument: false,
              ownerType,
              description: description.trim() || undefined,
              hasSample: Boolean(sampleDocument?.url),
              sampleDocumentName: sampleDocument?.fileName,
              sampleDocumentUrl: sampleDocument?.url,
              acceptedFormats: ['PDF', 'JPG', 'PNG'],
              sortOrder: documents.length,
            },
          ])
          setAddOpen(false)
        }}
      />
    </CountryWorkspaceModeProvider>
  )
}
