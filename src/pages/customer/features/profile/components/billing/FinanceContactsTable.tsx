import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { financeContactSourceTypeLabel } from '@/shared/utils/agreementFinanceContacts'
import type { FinanceContactPerson } from '../../types/accountWorkspace'

export interface FinanceContactsTableProps {
  persons: FinanceContactPerson[]
}

export function FinanceContactsTable({ persons }: FinanceContactsTableProps) {
  const colors = usePublicBrandColors()

  if (persons.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No finance contacts are configured on your agreement yet.
      </Typography>
    )
  }

  return (
    <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: colors.surfaceAlt }}>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.textMuted, py: 1.25, width: '32%' }}>
              Source
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.textMuted, py: 1.25 }}>
              Contact person
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.textMuted, py: 1.25 }}>
              Email
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.textMuted, py: 1.25, width: '22%' }}>
              Phone
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {persons.map(person => (
            <TableRow key={person.id} sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: colors.surfaceAlt } }}>
              <TableCell sx={{ py: 1.25, verticalAlign: 'top' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.text, lineHeight: 1.35 }}>
                  {person.sourceLabel}
                </Typography>
                <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.25 }}>
                  {financeContactSourceTypeLabel(person.sourceType)}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: 13, color: colors.text, py: 1.25 }}>{person.contactPerson || '—'}</TableCell>
              <TableCell sx={{ fontSize: 13, color: colors.textSecondary, py: 1.25, wordBreak: 'break-word' }}>
                {person.email || '—'}
              </TableCell>
              <TableCell sx={{ fontSize: 13, color: colors.textSecondary, py: 1.25, whiteSpace: 'nowrap' }}>
                {person.phone || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
