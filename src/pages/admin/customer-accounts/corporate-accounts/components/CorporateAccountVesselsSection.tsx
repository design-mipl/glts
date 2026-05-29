import { useState } from 'react'
import { IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import type { VesselMaster } from '@/shared/types/vesselMaster'
import { CorporateAccountVesselDrawer } from './CorporateAccountVesselDrawer'

interface CorporateAccountVesselsSectionProps {
  data: CorporateAccountFormData
  corporateAccountId?: string
  onChange: (next: CorporateAccountFormData) => void
}

export function CorporateAccountVesselsSection({
  data,
  corporateAccountId,
  onChange,
}: CorporateAccountVesselsSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editVessel, setEditVessel] = useState<VesselMaster>()

  const vessels = data.vesselIds.map((id) => vesselMasterService.getById(id)).filter(Boolean) as VesselMaster[]

  const handleSaved = (record: VesselMaster) => {
    if (!data.vesselIds.includes(record.id)) {
      onChange({ ...data, vesselIds: [...data.vesselIds, record.id] })
      if (corporateAccountId) corporateAccountService.addVesselId(corporateAccountId, record.id)
    }
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            Vessels
          </Typography>
          <Button
            label="Add vessel"
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={() => {
              setEditVessel(undefined)
              setDrawerOpen(true)
            }}
          />
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vessel name</TableCell>
              <TableCell>Vessel type</TableCell>
              <TableCell>Linked entity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vessels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    No vessels added yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              vessels.map((vessel) => (
                <TableRow key={vessel.id}>
                  <TableCell>{vessel.vesselName}</TableCell>
                  <TableCell>{vessel.vesselType}</TableCell>
                  <TableCell>
                    {vessel.linkedEntityId
                      ? entityMasterService.getById(vessel.linkedEntityId)?.entityName ?? vessel.linkedEntityId
                      : '—'}
                  </TableCell>
                  <TableCell>{vessel.status}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditVessel(vessel)
                        setDrawerOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onChange({ ...data, vesselIds: data.vesselIds.filter((id) => id !== vessel.id) })}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Stack>

      <CorporateAccountVesselDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        corporateAccountId={corporateAccountId}
        entityIds={data.entityIds}
        initial={editVessel}
        onSaved={handleSaved}
      />
    </>
  )
}
