import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, FormField, FormSection, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { AgreementEntity, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '../agreementFormLayout'

interface AgreementEntitiesTableProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  onAddEntity: () => string
  onUpdateEntity: (entityId: string, patch: Partial<AgreementEntity>) => void
  onRemoveEntity: (entityId: string) => void
  readOnly?: boolean
}

function emptyEntity(): AgreementEntity {
  return {
    id: '',
    entityName: '',
    billingAddress: '',
    gstNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'active',
  }
}

export function AgreementEntitiesTable({
  data,
  errors,
  onChange,
  onAddEntity,
  onUpdateEntity,
  onRemoveEntity,
  readOnly = false,
}: AgreementEntitiesTableProps) {
  const [editEntity, setEditEntity] = useState<AgreementEntity | null>(null)

  const openCreate = () => {
    const id = onAddEntity()
    const entity = data.entities.find((e) => e.id === id) ?? { ...emptyEntity(), id }
    setEditEntity({ ...entity })
  }

  const saveEntity = () => {
    if (!editEntity) return
    if (data.entities.some((e) => e.id === editEntity.id)) {
      onUpdateEntity(editEntity.id, editEntity)
    } else {
      onChange({ ...data, entities: [...data.entities, editEntity] })
    }
    setEditEntity(null)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {!readOnly ? (
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
          <Button label="Add entity" size="sm" startIcon={<Plus size={14} />} onClick={openCreate} />
        </Stack>
      ) : null}

      <Box sx={agreementEmbeddedTableSx}>
        {data.entities.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
              No entities added yet. Entities are optional during agreement onboarding.
            </Typography>
            {!readOnly ? (
              <Button label="Add entity" size="sm" startIcon={<Plus size={14} />} onClick={openCreate} />
            ) : null}
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Entity name</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST number</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Contact person</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Email</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Phone</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
                {!readOnly ? (
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Actions
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.entities.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontSize: 13 }}>{row.entityName || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.gstNumber || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.contactPerson || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.email || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.phone || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    <Badge label={row.status === 'active' ? 'Active' : 'Inactive'} color={row.status === 'active' ? 'success' : 'neutral'} size="sm" />
                  </TableCell>
                  {!readOnly ? (
                    <TableCell align="right">
                      <IconButton size="small" aria-label="Edit entity" onClick={() => setEditEntity({ ...row })}>
                        <Pencil size={14} />
                      </IconButton>
                      <IconButton size="small" aria-label="Delete entity" onClick={() => onRemoveEntity(row.id)}>
                        <Trash2 size={14} />
                      </IconButton>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {errors.pricingMatrix ? null : null}

      <Modal
        open={Boolean(editEntity)}
        onClose={() => setEditEntity(null)}
        title={editEntity && data.entities.some((e) => e.id === editEntity.id) ? 'Edit entity' : 'Add entity'}
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={() => setEditEntity(null)} />
            <Button label="Save" onClick={saveEntity} />
          </Stack>
        }
      >
        {editEntity ? (
          <FormSection columns={2}>
            <FormField label="Entity name" required>
              <Input
                value={editEntity.entityName}
                onChange={(v) => setEditEntity({ ...editEntity, entityName: v })}
                placeholder="Enter entity name"
                fullWidth
              />
            </FormField>
            <FormField label="GST number">
              <Input
                value={editEntity.gstNumber}
                onChange={(v) => setEditEntity({ ...editEntity, gstNumber: v })}
                placeholder="Enter GST number"
                fullWidth
              />
            </FormField>
            <FormField label="Contact person" required>
              <Input
                value={editEntity.contactPerson}
                onChange={(v) => setEditEntity({ ...editEntity, contactPerson: v })}
                placeholder="Enter contact person"
                fullWidth
              />
            </FormField>
            <FormField label="Email address" required>
              <Input
                value={editEntity.email}
                onChange={(v) => setEditEntity({ ...editEntity, email: v })}
                placeholder="Enter email address"
                fullWidth
              />
            </FormField>
            <FormField label="Phone number" required>
              <Input
                value={editEntity.phone}
                onChange={(v) => setEditEntity({ ...editEntity, phone: v })}
                placeholder="Enter phone number"
                fullWidth
              />
            </FormField>
            <FormField label="Status">
              <Select
                value={editEntity.status}
                onChange={(v) => setEditEntity({ ...editEntity, status: v as AgreementEntity['status'] })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                fullWidth
              />
            </FormField>
            <AdminFullPageFormFieldSpan>
              <FormField label="Billing address" required>
                <Textarea
                  value={editEntity.billingAddress}
                  onChange={(v) => setEditEntity({ ...editEntity, billingAddress: v })}
                  placeholder="Enter billing address"
                  fullWidth
                  rows={2}
                />
              </FormField>
            </AdminFullPageFormFieldSpan>
          </FormSection>
        ) : null}
      </Modal>
    </Box>
  )
}
