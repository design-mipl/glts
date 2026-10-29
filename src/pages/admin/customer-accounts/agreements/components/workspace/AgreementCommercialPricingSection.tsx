import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import type { QuotationFormData } from '@/shared/types/quotation'
import {
  createEntityPricingSchedule,
  entityIdsMappedToOverrides,
  listOverridePricingSchedules,
  removePricingSchedule,
  replacePricingSchedule,
  syncAgreementPricingSchedules,
} from '@/shared/utils/agreementPricingScheduleUtils'
import { AgreementAddPricingSetModal } from './AgreementAddPricingSetModal'
import { AgreementMapEntitiesDrawer } from './AgreementMapEntitiesDrawer'
import { AgreementPricingScheduleCard } from './AgreementPricingScheduleCard'

interface AgreementCommercialPricingSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
  showTemplateControls?: boolean
}

function toScheduleSlice(data: CommercialAgreementFormData, scheduleId: string): QuotationFormData {
  const schedule = data.pricingSchedules.find((item) => item.id === scheduleId)
  return {
    sourceType: 'direct',
    enquiryId: undefined,
    workflowType: data.workflowType === 'retail' ? 'corporate' : data.workflowType,
    customer: {
      companyName: data.company.companyName,
      contactPersonName: data.company.contactPersonName,
      contactNumber: data.company.contactNumber,
      emailAddress: data.company.emailAddress,
      companyAddress: data.company.companyAddress,
    },
    quotationDate: data.startDate,
    validTill: data.endDate,
    notes: '',
    gstRateId: '',
    gstPercentage: data.billingConfig.gstPercentage,
    pricingMatrix: [],
    retailVisaPricing: [],
    commercialVisaPricing: schedule?.commercialVisaPricing ?? [],
    miscellaneousServices: schedule?.miscellaneousServices ?? [],
  }
}

function overrideErrorFor(
  errors: Record<string, string>,
  overrideIndex: number,
): string | undefined {
  if (overrideIndex < 0) return undefined
  return (
    errors[`pricingSchedules.${overrideIndex}.name`] ||
    errors[`pricingSchedules.${overrideIndex}.entityIds`] ||
    errors[`pricingSchedules.${overrideIndex}.fees`]
  )
}

export function AgreementCommercialPricingSection({
  data,
  errors,
  onChange,
  readOnly = false,
}: AgreementCommercialPricingSectionProps) {
  const synced = syncAgreementPricingSchedules(data)
  const [mapScheduleId, setMapScheduleId] = useState<string | null>(null)

  const commit = (nextSchedules: CommercialAgreementFormData['pricingSchedules']) => {
    onChange(syncAgreementPricingSchedules({ ...data, pricingSchedules: nextSchedules }))
  }

  const mapSchedule = synced.pricingSchedules.find((schedule) => schedule.id === mapScheduleId) ?? null
  const overrides = listOverridePricingSchedules(synced.pricingSchedules)

  return (
    <Stack spacing={2}>
      {errors.pricingMatrix ? (
        <Typography variant="body2" color="error" sx={{ fontSize: 12 }}>
          {errors.pricingMatrix}
        </Typography>
      ) : null}

      {synced.pricingSchedules.map((schedule) => {
        const overrideIndex =
          schedule.appliesTo === 'entities' ? overrides.findIndex((item) => item.id === schedule.id) : -1
        return (
          <AgreementPricingScheduleCard
            key={schedule.id}
            schedule={schedule}
            formSlice={toScheduleSlice(synced, schedule.id)}
            entities={synced.entities}
            error={overrideErrorFor(errors, overrideIndex)}
            readOnly={readOnly}
            onChangeSlice={(partial) => {
              commit(
                replacePricingSchedule(synced.pricingSchedules, schedule.id, {
                  commercialVisaPricing: partial.commercialVisaPricing ?? schedule.commercialVisaPricing,
                  miscellaneousServices: partial.miscellaneousServices ?? schedule.miscellaneousServices,
                }),
              )
            }}
            onMapEntities={() => setMapScheduleId(schedule.id)}
            onDelete={() => commit(removePricingSchedule(synced.pricingSchedules, schedule.id))}
          />
        )
      })}

      <AgreementMapEntitiesDrawer
        open={Boolean(mapSchedule)}
        schedule={mapSchedule}
        entities={synced.entities}
        schedules={synced.pricingSchedules}
        onClose={() => setMapScheduleId(null)}
        onSave={(entityIds) => {
          if (!mapScheduleId) return
          commit(replacePricingSchedule(synced.pricingSchedules, mapScheduleId, { entityIds }))
        }}
      />
    </Stack>
  )
}

/** Header actions for agreement workspace pricing step. */
export function AgreementPricingHeaderActions({
  data,
  onChange,
  readOnly,
}: {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}) {
  const synced = syncAgreementPricingSchedules(data)
  const [addOpen, setAddOpen] = useState(false)
  const noEntities = synced.entities.length === 0
  const noAvailable =
    synced.entities.length > 0 &&
    entityIdsMappedToOverrides(synced.pricingSchedules).length >= synced.entities.length

  if (readOnly) return null

  return (
    <>
      <span
        title={
          noEntities
            ? 'Add at least one entity to create entity-specific pricing'
            : noAvailable
              ? 'Every entity already has specific pricing'
              : undefined
        }
      >
        <Button
          label="Add pricing"
          size="sm"
          startIcon={<Plus size={14} />}
          disabled={noEntities || noAvailable}
          onClick={() => setAddOpen(true)}
        />
      </span>
      <AgreementAddPricingSetModal
        open={addOpen}
        entities={synced.entities}
        unavailableEntityIds={entityIdsMappedToOverrides(synced.pricingSchedules)}
        onClose={() => setAddOpen(false)}
        onSave={({ name, entityIds }) => {
          onChange(
            syncAgreementPricingSchedules({
              ...synced,
              pricingSchedules: [
                ...synced.pricingSchedules,
                createEntityPricingSchedule({ name, entityIds }),
              ],
            }),
          )
        }}
      />
    </>
  )
}
