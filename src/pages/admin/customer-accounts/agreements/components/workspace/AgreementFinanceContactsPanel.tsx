import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { Button, Checkbox } from '@/design-system/UIComponents'
import type { AgreementFinanceContactPerson } from '@/shared/types/commercialAgreement'
import { financeContactSourceTypeLabel } from '@/shared/utils/agreementFinanceContacts'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '../agreementFormLayout'

interface AgreementFinanceContactsPanelProps {
  contacts: AgreementFinanceContactPerson[]
  selectedContactIds?: string[]
  readOnly?: boolean
  onRefresh?: () => void
  onToggleContact?: (contactId: string, checked: boolean) => void
}

export function AgreementFinanceContactsPanel({
  contacts,
  selectedContactIds = [],
  readOnly = false,
  onRefresh,
  onToggleContact,
}: AgreementFinanceContactsPanelProps) {
  const selectedSet = new Set(selectedContactIds)
  return (
    <Stack spacing={1.5}>
      {!readOnly && onRefresh ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 520 }}>
            Pulled from primary company, parent company, and entity contact details. Refresh after updating
            those sections.
          </Typography>
          <Button
            label="Refresh contacts"
            size="sm"
            variant="outlined"
            color="secondary"
            startIcon={<RefreshCw size={14} />}
            onClick={onRefresh}
          />
        </Stack>
      ) : null}

      <Box sx={agreementEmbeddedTableSx}>
        {contacts.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No finance contacts yet. Add company contact details, a parent company, or entities with contact
              persons in earlier steps.
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                {!readOnly ? <TableCell sx={agreementEmbeddedTableHeadCellSx}>Use</TableCell> : null}
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Source</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Contact person</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Email</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  {!readOnly ? (
                    <TableCell sx={{ width: 56 }}>
                      <Checkbox
                        checked={selectedSet.has(contact.id)}
                        onChange={(checked) => onToggleContact?.(contact.id, checked)}
                        aria-label={`Use ${contact.sourceLabel} finance contact`}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ fontSize: 13 }}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                        {contact.sourceLabel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {financeContactSourceTypeLabel(contact.sourceType)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{contact.contactPerson || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{contact.email || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{contact.phone || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Stack>
  )
}
