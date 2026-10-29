import { Box, Stack, Typography } from '@mui/material'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, IconButton } from '@/design-system/UIComponents'
import type { AgreementEntity, AgreementPricingSchedule } from '@/shared/types/commercialAgreement'
import type { QuotationFormData } from '@/shared/types/quotation'
import { QuotationPricingSection } from '@/pages/admin/customer-accounts/quotations/components/pricing/QuotationPricingSection'
import { QuotationPricingTemplateControls } from '@/pages/admin/customer-accounts/quotations/components/pricing/QuotationPricingTemplateControls'
import { scheduleDisplayEntities } from '@/shared/utils/agreementPricingScheduleUtils'

interface AgreementPricingScheduleCardProps {
  schedule: AgreementPricingSchedule
  formSlice: QuotationFormData
  entities: AgreementEntity[]
  error?: string
  readOnly?: boolean
  onChangeSlice: (partial: Partial<QuotationFormData>) => void
  onMapEntities?: () => void
  onDelete?: () => void
}

export function AgreementPricingScheduleCard({
  schedule,
  formSlice,
  entities,
  error,
  readOnly = false,
  onChangeSlice,
  onMapEntities,
  onDelete,
}: AgreementPricingScheduleCardProps) {
  const isDefault = schedule.appliesTo === 'all'
  const mapped = scheduleDisplayEntities(schedule, entities)
  const missingMap = !isDefault && mapped.length === 0

  return (
    <Box
      sx={{
        border: 1,
        borderColor: missingMap ? 'warning.main' : 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1.5}
          useFlexGap
          flexWrap="wrap"
        >
          <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14 }}>
                {schedule.name}
              </Typography>
              <Badge
                size="sm"
                color={isDefault ? 'info' : missingMap ? 'warning' : 'neutral'}
                label={isDefault ? 'All entities' : missingMap ? 'Map an entity' : 'Specific entities'}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              {isDefault
                ? 'Used when an entity has no override.'
                : mapped.length > 0
                  ? mapped.map((entity) => entity.entityName || 'Untitled entity').join(', ')
                  : 'Map at least one entity to use this pricing.'}
            </Typography>
          </Stack>
          {!readOnly ? (
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <QuotationPricingTemplateControls
                formData={formSlice}
                onChange={onChangeSlice}
                replaceScopeLabel={`“${schedule.name}”`}
              />
              {!isDefault ? (
                <>
                  <Button
                    label="Map entities"
                    size="sm"
                    variant="neutral"
                    startIcon={<Pencil size={14} />}
                    onClick={onMapEntities}
                  />
                  <IconButton
                    size="sm"
                    tooltip="Delete pricing set"
                    icon={<Trash2 size={14} />}
                    onClick={onDelete}
                  />
                </>
              ) : null}
            </Stack>
          ) : null}
        </Stack>

        <QuotationPricingSection
          formData={formSlice}
          onChange={onChangeSlice}
          error={error}
          readOnly={readOnly}
          addVisaPricingLabel="Add fee"
        />
      </Stack>
    </Box>
  )
}
