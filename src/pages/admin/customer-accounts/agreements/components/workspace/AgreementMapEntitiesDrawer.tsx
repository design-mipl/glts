import { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, Checkbox, Drawer } from '@/design-system/UIComponents'
import type { AgreementEntity, AgreementPricingSchedule } from '@/shared/types/commercialAgreement'
import { entityIdsMappedToOverrides } from '@/shared/utils/agreementPricingScheduleUtils'

interface AgreementMapEntitiesDrawerProps {
  open: boolean
  schedule: AgreementPricingSchedule | null
  entities: AgreementEntity[]
  schedules: AgreementPricingSchedule[]
  onClose: () => void
  onSave: (entityIds: string[]) => void
}

export function AgreementMapEntitiesDrawer({
  open,
  schedule,
  entities,
  schedules,
  onClose,
  onSave,
}: AgreementMapEntitiesDrawerProps) {
  const [entityIds, setEntityIds] = useState<string[]>([])

  useEffect(() => {
    if (!open || !schedule) return
    setEntityIds([...schedule.entityIds])
  }, [open, schedule])

  const usedElsewhere = new Set(entityIdsMappedToOverrides(schedules, schedule?.id))

  const toggle = (id: string, checked: boolean) => {
    setEntityIds((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Map entities"
      subtitle={schedule ? `Choose which billing entities use “${schedule.name}”.` : undefined}
      width={420}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Save"
            disabled={entityIds.length === 0}
            onClick={() => {
              onSave(entityIds)
              onClose()
            }}
          />
        </Stack>
      }
    >
      {entities.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          Add entities on the Entities step, then map them here.
        </Typography>
      ) : (
        <Stack spacing={0.75}>
          {entities.map((entity) => {
            const taken = usedElsewhere.has(entity.id)
            return (
              <Checkbox
                key={entity.id}
                size="sm"
                disabled={taken}
                label={
                  taken
                    ? `${entity.entityName || 'Untitled entity'} (used on another pricing)`
                    : entity.entityName || 'Untitled entity'
                }
                checked={entityIds.includes(entity.id)}
                onChange={(checked) => toggle(entity.id, checked)}
              />
            )
          })}
        </Stack>
      )}
    </Drawer>
  )
}
