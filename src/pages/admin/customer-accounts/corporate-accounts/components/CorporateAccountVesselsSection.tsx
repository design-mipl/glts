import { useRef, useState } from 'react'

import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

import { ChevronDown, Download, Pencil, Plus, Trash2, Upload } from 'lucide-react'

import { Button, Menu, useToast } from '@/design-system/UIComponents'

import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'

import { corporateAccountService } from '@/shared/services/corporateAccountService'

import { vesselMasterService } from '@/shared/services/vesselMasterService'

import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

import type { VesselMaster } from '@/shared/types/vesselMaster'

import { agreementEmbeddedTableSx } from '../../agreements/components/agreementFormLayout'

import {

  downloadCorporateAccountVesselTemplate,

  importCorporateAccountVesselsFromCsv,

} from '../utils/corporateAccountVesselBulkUtils'

import { CorporateAccountVesselDrawer } from './CorporateAccountVesselDrawer'



interface CorporateAccountVesselsSectionProps {

  data: CorporateAccountFormData

  corporateAccountId?: string

  onChange: (next: CorporateAccountFormData) => void

}



interface VesselSectionActionsProps {

  onAdd: () => void

  onDownloadTemplate: () => void

  onUpload: () => void

}



function VesselSectionActions({ onAdd, onDownloadTemplate, onUpload }: VesselSectionActionsProps) {

  return (

    <Stack direction="row" spacing={1} alignItems="center">

      <Button label="Add vessel" size="sm" startIcon={<Plus size={14} />} onClick={onAdd} />

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

            label: 'Upload vessels',

            icon: <Upload size={16} />,

            onClick: onUpload,

          },

        ]}

      />

    </Stack>

  )

}



export function CorporateAccountVesselsSection({

  data,

  corporateAccountId,

  onChange,

}: CorporateAccountVesselsSectionProps) {

  const { showToast } = useToast()

  const uploadInputRef = useRef<HTMLInputElement>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [editVessel, setEditVessel] = useState<VesselMaster>()



  const vessels = data.vesselIds.map((id) => vesselMasterService.getById(id)).filter(Boolean) as VesselMaster[]



  const openCreate = () => {

    setEditVessel(undefined)

    setDrawerOpen(true)

  }



  const handleSaved = (record: VesselMaster) => {

    if (!data.vesselIds.includes(record.id)) {

      onChange({ ...data, vesselIds: [...data.vesselIds, record.id] })

      if (corporateAccountId) corporateAccountService.addVesselId(corporateAccountId, record.id)

    }

  }



  const handleDownloadTemplate = () => {

    downloadCorporateAccountVesselTemplate()

    showToast({ title: 'Export format downloaded', variant: 'success' })

  }



  const handleUploadClick = () => {

    uploadInputRef.current?.click()

  }



  const handleUploadFile = async (file: File) => {

    const text = await file.text()

    const result = importCorporateAccountVesselsFromCsv(text, {

      entityIds: data.entityIds,

      corporateAccountId,

      existingVesselIds: data.vesselIds,

    })



    if (result.imported.length === 0) {

      showToast({

        title: 'No vessels imported',

        description: result.skipped[0]?.reason ?? 'Check the file format and try again.',

        variant: 'error',

      })

      return

    }



    const nextVesselIds = [...data.vesselIds]

    for (const record of result.imported) {

      if (!nextVesselIds.includes(record.id)) {

        nextVesselIds.push(record.id)

        if (corporateAccountId) corporateAccountService.addVesselId(corporateAccountId, record.id)

      }

    }



    onChange({ ...data, vesselIds: nextVesselIds })



    showToast({

      title: `${result.imported.length} vessel${result.imported.length === 1 ? '' : 's'} uploaded`,

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

        title="Vessels"

        description="Link vessels to entities for marine workflow applications."

        columns={1}

        fieldColumnsFrom="xs"

        headerAction={

          <VesselSectionActions

            onAdd={openCreate}

            onDownloadTemplate={handleDownloadTemplate}

            onUpload={handleUploadClick}

          />

        }

      >

        <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>

          <Box sx={agreementEmbeddedTableSx}>

            {vessels.length === 0 ? (

              <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>

                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>

                  No vessels added yet. Link vessels to entities for marine workflow applications.

                </Typography>

              </Box>

            ) : (

              <Table size="small">

                <TableHead>

                  <TableRow>

                    <TableCell>Vessel name</TableCell>

                    <TableCell>Vessel type</TableCell>

                    <TableCell>Status</TableCell>

                    <TableCell align="right">Actions</TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {vessels.map((vessel) => (

                    <TableRow key={vessel.id}>

                      <TableCell>{vessel.vesselName}</TableCell>

                      <TableCell>{vessel.vesselType}</TableCell>

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


