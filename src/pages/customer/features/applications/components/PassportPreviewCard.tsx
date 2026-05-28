import { Box, Typography } from '@mui/material'
import type { UploadQueueRow } from '../data/applicationFlowData'

interface PassportPreviewCardProps {
  row: UploadQueueRow
}

export function PassportPreviewCard({ row }: PassportPreviewCardProps) {
  const surname = row.fields.find(f => f.key === 'surname')?.value ?? row.travelerName.split(' ').slice(-1)[0]
  const given = row.fields.find(f => f.key === 'given')?.value ?? row.travelerName.split(' ')[0]

  return (
    <Box
      sx={{
        borderRadius: '14px',
        overflow: 'hidden',
        bgcolor: '#0d3d4a',
        color: '#fff',
        minHeight: 220,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography sx={{ fontSize: '10px', letterSpacing: '0.12em', opacity: 0.7 }}>PASSPORT</Typography>
      <Box>
        <Typography sx={{ fontSize: '11px', opacity: 0.75, mb: 0.5 }}>Surname / Given names</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>
          {surname}
          <br />
          {given}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontSize: '11px', opacity: 0.75 }}>Passport no.</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '15px', fontFamily: 'monospace' }}>{row.passportNo}</Typography>
      </Box>
      {row.mrzLine && (
        <Typography
          sx={{
            fontSize: '9px',
            fontFamily: 'monospace',
            opacity: 0.85,
            letterSpacing: '0.04em',
            wordBreak: 'break-all',
            mt: 1,
          }}
        >
          {row.mrzLine}
        </Typography>
      )}
    </Box>
  )
}
