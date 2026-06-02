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
import type {
  BusinessSegment,
  CountryDocumentChecklistItem,
  CountryMaster,
  CountryVisaType,
} from '@/shared/types/countryMaster'
import {
  mergeVisaTypeChecklistRows,
  resolveChecklistItemDescription,
  resolveDocumentMasterLabel,
} from '../../utils/countryChecklistUtils'

interface ChecklistTabProps {
  country: CountryMaster
  segment: BusinessSegment
}

function VisaTypeChecklistReadonly({
  visaType,
  commonDocuments,
}: {
  visaType: CountryVisaType
  commonDocuments: CountryDocumentChecklistItem[]
}) {
  const rows = mergeVisaTypeChecklistRows(commonDocuments, visaType.applicationDocuments)
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        No documents mapped.
      </Typography>
    )
  }

  return (
    <Box sx={{ overflowX: 'auto', mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Document</TableCell>
            <TableCell width={88}>Common</TableCell>
            <TableCell width={100}>Mandatory</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.scope}-${row.documentId}`}>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {resolveDocumentMasterLabel(row.documentId)}
                </Typography>
              </TableCell>
              <TableCell>{row.scope === 'common' ? 'Yes' : 'No'}</TableCell>
              <TableCell>{row.mandatory ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {resolveChecklistItemDescription(row) || '—'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
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
    <Stack spacing={2}>
      {segConfig.visaTypes.map((vt) => (
        <Box key={vt.id}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {vt.name}
          </Typography>
          <VisaTypeChecklistReadonly
            visaType={vt}
            commonDocuments={segConfig.commonDocuments ?? []}
          />
        </Box>
      ))}
      <Button
        label="Edit checklist"
        variant="outlined"
        onClick={() => navigate(`/admin/masters/country/${country.id}/edit?step=3`)}
        sx={{ alignSelf: 'flex-start' }}
      />
    </Stack>
  )
}
