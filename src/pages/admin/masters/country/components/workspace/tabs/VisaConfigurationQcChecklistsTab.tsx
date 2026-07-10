import { useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { getDefaultQcChecklistTemplate, applyQcChecklistKindMetadata } from '@/shared/data/countryQcChecklistDefaults'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type {
  BusinessSegment,
  CountryMasterFormData,
  CountryQcChecklistKind,
  CountryQcChecklistTemplate,
} from '@/shared/types/countryMaster'
import { QcChecklistSummaryCard } from '../QcChecklistSummaryCard'
import { EditQcChecklistModal } from '../modals/EditQcChecklistModal'
import type { VisaConfigurationScope } from './VisaConfigurationDocumentsTab'

const QC_KIND_TABS: { value: CountryQcChecklistKind; label: string }[] = [
  { value: 'ops', label: 'OPS checklist' },
  { value: 'docs', label: 'Docs checklist' },
]

interface VisaConfigurationQcChecklistsTabProps {
  scope: VisaConfigurationScope
  countryId: string
  segment: BusinessSegment
  visaTypeId: string
  jurisdictionId?: string
  formData: CountryMasterFormData
  onRefresh: () => void
  readOnly: boolean
}

export function VisaConfigurationQcChecklistsTab({
  scope,
  countryId,
  segment,
  visaTypeId,
  jurisdictionId,
  formData,
  onRefresh,
  readOnly,
}: VisaConfigurationQcChecklistsTabProps) {
  const [activeKind, setActiveKind] = useState<CountryQcChecklistKind>('ops')
  const [modalOpen, setModalOpen] = useState(false)

  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  const jurisdiction =
    scope === 'jurisdiction' && jurisdictionId
      ? visaType?.jurisdictions?.find((j) => j.id === jurisdictionId)
      : undefined

  const savedTemplate = useMemo(() => {
    if (!visaType) return undefined
    if (scope === 'jurisdiction') {
      return activeKind === 'ops' ? jurisdiction?.opsQcChecklist : jurisdiction?.docsQcChecklist
    }
    return activeKind === 'ops' ? visaType.opsQcChecklist : visaType.docsQcChecklist
  }, [activeKind, jurisdiction, scope, visaType])

  const displayTemplate = useMemo(
    () => applyQcChecklistKindMetadata(activeKind, savedTemplate ?? getDefaultQcChecklistTemplate(activeKind)),
    [activeKind, savedTemplate],
  )

  if (!visaType) return null
  if (scope === 'jurisdiction' && !jurisdiction) return null

  const handleSave = (template: CountryQcChecklistTemplate) => {
    countryMasterAdminService.saveQcChecklistTemplate(
      countryId,
      segment,
      visaTypeId,
      activeKind,
      template,
      scope === 'jurisdiction' ? jurisdictionId : undefined,
    )
    onRefresh()
    setModalOpen(false)
  }

  return (
    <Stack spacing={1}>
      <Tabs
        items={QC_KIND_TABS}
        value={activeKind}
        onChange={(value) => setActiveKind(value as CountryQcChecklistKind)}
        variant="underline"
        size="sm"
      />

      <QcChecklistSummaryCard
        template={displayTemplate}
        isCustomized={Boolean(savedTemplate)}
        readOnly={readOnly}
        onEdit={() => setModalOpen(true)}
      />

      <EditQcChecklistModal
        open={modalOpen}
        kind={activeKind}
        initialTemplate={displayTemplate}
        readOnly={readOnly}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </Stack>
  )
}
