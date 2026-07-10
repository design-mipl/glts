import { Stack, Typography } from '@mui/material'
import { Pencil } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import {
  countEnabledQcChecklistItems,
  countEnabledQcChecklistSections,
  getExecutableQcChecklistSections,
} from '@/shared/utils/countryQcChecklistUtils'

interface QcChecklistSummaryCardProps {
  template: CountryQcChecklistTemplate
  isCustomized: boolean
  readOnly: boolean
  onEdit: () => void
}

export function QcChecklistSummaryCard({
  template,
  isCustomized,
  readOnly,
  onEdit,
}: QcChecklistSummaryCardProps) {
  const sectionCount = countEnabledQcChecklistSections(template)
  const itemCount = countEnabledQcChecklistItems(template)
  const sections = getExecutableQcChecklistSections(template)

  const actionLabel = readOnly ? 'View checklist' : isCustomized ? 'Edit checklist' : 'Customize checklist'

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 14, minWidth: 0 }}>
          {template.title}
        </Typography>
        <Button
          label={actionLabel}
          size="sm"
          variant={readOnly ? 'outlined' : 'contained'}
          startIcon={<Pencil size={14} />}
          onClick={onEdit}
          sx={{ flexShrink: 0 }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
        <Badge
          label={isCustomized ? 'Customized' : 'Default template'}
          color={isCustomized ? 'success' : 'neutral'}
        />
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {sectionCount} sections · {itemCount} items
        </Typography>
      </Stack>

      {template.subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {template.subtitle}
        </Typography>
      ) : null}

      <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
        {sections.map((section) => (
          <Typography
            key={section.id}
            component="li"
            variant="body2"
            sx={{ fontSize: 13 }}
          >
            {section.title}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
              ({section.items.length} items)
            </Typography>
          </Typography>
        ))}
      </Stack>
    </Stack>
  )
}
