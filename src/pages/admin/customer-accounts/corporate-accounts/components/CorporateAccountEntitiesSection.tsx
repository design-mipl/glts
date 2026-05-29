import { useState } from 'react'
import { IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import type { EntityMaster } from '@/shared/types/entityMaster'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { CorporateAccountEntityDrawer } from './CorporateAccountEntityDrawer'

interface CorporateAccountEntitiesSectionProps {
  data: CorporateAccountFormData
  corporateAccountId?: string
  onChange: (next: CorporateAccountFormData) => void
}

export function CorporateAccountEntitiesSection({
  data,
  corporateAccountId,
  onChange,
}: CorporateAccountEntitiesSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editEntity, setEditEntity] = useState<EntityMaster>()

  const entities = data.entityIds
    .map((id) => entityMasterService.getById(id))
    .filter(Boolean) as EntityMaster[]

  const openCreate = () => {
    setEditEntity(undefined)
    setDrawerOpen(true)
  }

  const openEdit = (entity: EntityMaster) => {
    setEditEntity(entity)
    setDrawerOpen(true)
  }

  const handleSaved = (record: EntityMaster) => {
    if (!data.entityIds.includes(record.id)) {
      onChange({ ...data, entityIds: [...data.entityIds, record.id] })
      if (corporateAccountId) corporateAccountService.addEntityId(corporateAccountId, record.id)
    }
  }

  const removeEntity = (id: string) => {
    onChange({ ...data, entityIds: data.entityIds.filter((eid) => eid !== id) })
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            Entities
          </Typography>
          <Button label="Add entity" size="sm" startIcon={<Plus size={14} />} onClick={openCreate} />
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Entity name</TableCell>
              <TableCell>Contact person</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    No entities added yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell>{entity.entityName}</TableCell>
                  <TableCell>{entity.contactPersonName}</TableCell>
                  <TableCell>{entity.location || entity.city || '—'}</TableCell>
                  <TableCell>{entity.status}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(entity)}>
                      <Pencil size={14} />
                    </IconButton>
                    <IconButton size="small" onClick={() => removeEntity(entity.id)}>
                      <Trash2 size={14} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Stack>

      <CorporateAccountEntityDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        corporateAccountId={corporateAccountId}
        initial={editEntity}
        onSaved={handleSaved}
      />
    </>
  )
}

