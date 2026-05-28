import { Box, Grid, Stack, TextField, MenuItem, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Ship, Upload, Users } from 'lucide-react'
import { Button, FileUpload, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import {
  CustomerActionPanel,
  CustomerCard,
  CustomerInfoGrid,
  CustomerPageHeader,
  CustomerStatusChip,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'

export function CrewUploadPage() {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const upload = useMemo(() => customerPortalService.getCrewUpload(), [])
  const [crewName, setCrewName] = useState('')
  const [passport, setPassport] = useState('')
  const [cdc, setCdc] = useState('')
  const [rank, setRank] = useState('')
  const [vessel, setVessel] = useState('')
  const [port, setPort] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [ticketType, setTicketType] = useState('oneway')
  const verified = upload.rows.filter(row => row.status === 'verified').length
  const needsReview = upload.rows.filter(row => row.status === 'needs_review').length

  const handleAdd = () => {
    showToast({ title: 'Crew member staged', description: `${crewName || 'Crew member'} was added to the manifest preview.`, variant: 'success' })
    setCrewName('')
    setPassport('')
    setCdc('')
    setRank('')
  }

  return (
    <Box>
      <CustomerPageHeader
        eyebrow="Marine"
        title="Crew upload"
        subtitle="Build a crew manifest, validate passport data, and prepare a bulk visa submission."
        badge={upload.batchId}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <CustomerCard title="Add crew member" subtitle="Manual entry for one-off crew records" icon={Ship}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="Crew name" value={crewName} onChange={e => setCrewName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="Passport number" value={passport} onChange={e => setPassport(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="CDC number" value={cdc} onChange={e => setCdc(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="Rank" value={rank} onChange={e => setRank(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="Vessel name" value={vessel} onChange={e => setVessel(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="Joining port" value={port} onChange={e => setPort(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label="Joining date" type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth size="small" label="Ticket type" value={ticketType} onChange={e => setTicketType(e.target.value)}>
                  <MenuItem value="oneway">One-way</MenuItem>
                  <MenuItem value="twoway">Two-way</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="contained" disabled={!crewName || !passport} onClick={handleAdd}>
                Add crew member
              </Button>
            </Stack>
          </CustomerCard>

          <CustomerCard title="Manifest upload" subtitle="Upload passport scans, ZIP folders, or crew manifests" icon={Upload} sx={{ mt: 2 }}>
            <FileUpload onUpload={() => showToast({ title: 'Manifest uploaded', variant: 'success' })} accept=".zip,.csv,.xlsx,image/*,.pdf" multiple />
          </CustomerCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2}>
            <CustomerCard title="Manifest readiness" icon={Users} tone="info">
              <CustomerInfoGrid
                columns={3}
                items={[
                  { label: 'Total files', value: String(upload.rows.length) },
                  { label: 'Verified', value: String(verified) },
                  { label: 'Needs review', value: String(needsReview) },
                ]}
              />
            </CustomerCard>

            <CustomerCard title="Crew preview" subtitle="OCR output from the latest upload" icon={Ship}>
              <Stack spacing={1}>
                {upload.rows.map(row => (
                  <CustomerActionPanel
                    key={row.id}
                    title={row.travelerName === '�' ? row.fileName : row.travelerName}
                    description={`${row.passportNo} � ${row.nationality} � Confidence ${row.confidence}%`}
                    action={<CustomerStatusChip label={row.status.replace('_', ' ')} tone={getCustomerStatusTone(row.status)} />}
                  />
                ))}
              </Stack>
              <Typography sx={{ mt: 2, fontSize: 12, color: colors.textMuted }}>
                This manifest can continue into the bulk application flow once all crew records are verified.
              </Typography>
            </CustomerCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}