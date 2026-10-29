import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, Checkbox, FormField, FormSection, Input, Modal } from '@/design-system/UIComponents'
import type { AgreementEntity } from '@/shared/types/commercialAgreement'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'

interface AgreementAddPricingSetModalProps {
  open: boolean
  entities: AgreementEntity[]
  unavailableEntityIds: string[]
  onClose: () => void
  onSave: (payload: { name: string; entityIds: string[] }) => void
}

export function AgreementAddPricingSetModal({
  open,
  entities,
  unavailableEntityIds,
  onClose,
  onSave,
}: AgreementAddPricingSetModalProps) {
  const [name, setName] = useState('')
  const [entityIds, setEntityIds] = useState<string[]>([])

  const available = useMemo(
    () => entities.filter((entity) => !unavailableEntityIds.includes(entity.id)),
    [entities, unavailableEntityIds],
  )

  useEffect(() => {
    if (!open) return
    setName('')
    setEntityIds(available.length === 1 ? [available[0].id] : [])
  }, [open, available])

  const toggle = (id: string, checked: boolean) => {
    setEntityIds((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
  }

  const canSave = name.trim().length > 0 && entityIds.length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add pricing"
      subtitle="Create entity-specific processing visa fees. Default pricing still applies to everyone else."
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Create"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return
              onSave({ name: name.trim(), entityIds })
              onClose()
            }}
          />
        </Stack>
      }
    >
      <FormSection title="Pricing set" columns={1}>
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={setName}
            placeholder="e.g. Subsidiary — Singapore"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Applies to" required>
            {entities.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                Add at least one entity before creating entity-specific pricing.
              </Typography>
            ) : available.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                Every entity already has specific pricing. Unmap an entity to use it here.
              </Typography>
            ) : (
              <Stack spacing={0.5}>
                {available.map((entity) => (
                  <Checkbox
                    key={entity.id}
                    size="sm"
                    label={entity.entityName || 'Untitled entity'}
                    checked={entityIds.includes(entity.id)}
                    onChange={(checked) => toggle(entity.id, checked)}
                  />
                ))}
              </Stack>
            )}
          </FormField>
        </AdminFullPageFormFieldSpan>
      </FormSection>
    </Modal>
  )
}
