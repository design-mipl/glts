import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState } from '@/design-system/UIComponents'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'

interface ChecklistTabProps {
  country: CountryMaster
  segment: BusinessSegment
}

export function ChecklistTab({ country, segment }: ChecklistTabProps) {
  const navigate = useNavigate()
  const segConfig = country.segments.find((s) => s.segment === segment)

  if (!segConfig?.enabled || segConfig.visaTypes.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No checklist configured"
        description="Add visa types and map documents from Document Master."
        action={{
          label: 'Configure checklist',
          onClick: () => navigate(`/admin/masters/country/${country.id}/edit?step=3`),
        }}
      />
    )
  }

  return (
    <Stack spacing={3}>
      {segConfig.visaTypes.map((vt) => {
        const sorted = [...vt.checklist].sort((a, b) => a.sortOrder - b.sortOrder)
        return (
          <Box key={vt.id}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              {vt.name}
            </Typography>
            {sorted.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No documents mapped.
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document</TableCell>
                      <TableCell>Mandatory</TableCell>
                      <TableCell>OCR</TableCell>
                      <TableCell>Validation rule</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sorted.map((item) => (
                      <TableRow key={item.documentId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.mandatory ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{item.ocrEnabled ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{item.validationRule || '—'}</TableCell>
                        <TableCell>{item.remarks || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>
        )
      })}
      <Button
        label="Edit checklist"
        variant="outlined"
        onClick={() => navigate(`/admin/masters/country/${country.id}/edit?step=3`)}
        sx={{ alignSelf: 'flex-start' }}
      />
    </Stack>
  )
}
