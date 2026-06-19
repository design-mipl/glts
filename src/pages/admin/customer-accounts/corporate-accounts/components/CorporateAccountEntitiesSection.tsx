import { useRef, useState } from 'react'

import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

import { ChevronDown, Download, Pencil, Plus, Trash2, Upload } from 'lucide-react'

import { Button, Menu, useToast } from '@/design-system/UIComponents'

import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'

import { corporateAccountService } from '@/shared/services/corporateAccountService'

import { entityMasterService } from '@/shared/services/entityMasterService'

import type { EntityMaster } from '@/shared/types/entityMaster'

import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

import { agreementEmbeddedTableSx } from '../../agreements/components/agreementFormLayout'

import {

  downloadCorporateAccountEntityTemplate,

  importCorporateAccountEntitiesFromCsv,

} from '../utils/corporateAccountEntityBulkUtils'

import { CorporateAccountEntityDrawer } from './CorporateAccountEntityDrawer'



interface CorporateAccountEntitiesSectionProps {

  data: CorporateAccountFormData

  corporateAccountId?: string

  onChange: (next: CorporateAccountFormData) => void

}



interface EntitySectionActionsProps {

  onAdd: () => void

  onDownloadTemplate: () => void

  onUpload: () => void

}



function EntitySectionActions({ onAdd, onDownloadTemplate, onUpload }: EntitySectionActionsProps) {

  return (

    <Stack direction="row" spacing={1} alignItems="center">

      <Button label="Add entity" size="sm" startIcon={<Plus size={14} />} onClick={onAdd} />

      <Menu

        trigger={

          <Button

            label="More"

            size="sm"

            variant="neutral"

            endIcon={<ChevronDown size={14} />}

          />

        }

        placement="bottom-end"

        items={[

          {

            label: 'Download export format',

            icon: <Download size={16} />,

            onClick: onDownloadTemplate,

          },

          {

            label: 'Upload entities',

            icon: <Upload size={16} />,

            onClick: onUpload,

          },

        ]}

      />

    </Stack>

  )

}



export function CorporateAccountEntitiesSection({

  data,

  corporateAccountId,

  onChange,

}: CorporateAccountEntitiesSectionProps) {

  const { showToast } = useToast()

  const uploadInputRef = useRef<HTMLInputElement>(null)

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



  const handleDownloadTemplate = () => {

    downloadCorporateAccountEntityTemplate()

    showToast({ title: 'Export format downloaded', variant: 'success' })

  }



  const handleUploadClick = () => {

    uploadInputRef.current?.click()

  }



  const handleUploadFile = async (file: File) => {

    const text = await file.text()

    const result = importCorporateAccountEntitiesFromCsv(text, {

      corporateAccountId,

      existingEntityIds: data.entityIds,

    })



    if (result.imported.length === 0) {

      showToast({

        title: 'No entities imported',

        description: result.skipped[0]?.reason ?? 'Check the file format and try again.',

        variant: 'error',

      })

      return

    }



    const nextEntityIds = [...data.entityIds]

    for (const record of result.imported) {

      if (!nextEntityIds.includes(record.id)) {

        nextEntityIds.push(record.id)

        if (corporateAccountId) corporateAccountService.addEntityId(corporateAccountId, record.id)

      }

    }



    onChange({ ...data, entityIds: nextEntityIds })



    showToast({

      title: `${result.imported.length} entit${result.imported.length === 1 ? 'y' : 'ies'} uploaded`,

      description:

        result.skipped.length > 0

          ? `${result.skipped.length} row${result.skipped.length === 1 ? '' : 's'} skipped.`

          : undefined,

      variant: result.skipped.length > 0 ? 'warning' : 'success',

    })

  }



  return (

    <>

      <AdminOverlayFormSection

        title="Entities"

        description="Add billing and operational entities for this corporate account."

        columns={1}

        fieldColumnsFrom="xs"

        headerAction={

          <EntitySectionActions

            onAdd={openCreate}

            onDownloadTemplate={handleDownloadTemplate}

            onUpload={handleUploadClick}

          />

        }

      >

        <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>

          <Box sx={agreementEmbeddedTableSx}>

            {entities.length === 0 ? (

              <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>

                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>

                  No entities added yet. Add billing and operational entities for this corporate account.

                </Typography>

              </Box>

            ) : (

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

                  {entities.map((entity) => (

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

                  ))}

                </TableBody>

              </Table>

            )}

          </Box>

        </Box>

      </AdminOverlayFormSection>



      <input

        ref={uploadInputRef}

        type="file"

        accept=".csv,text/csv"

        hidden

        onChange={(event) => {

          const file = event.target.files?.[0]

          event.target.value = ''

          if (file) void handleUploadFile(file)

        }}

      />



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


