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
import type { SupportedOperations } from '../types/accountWorkspace'

export interface CompanyCountryVisaTableProps {
  operations: SupportedOperations
}

export function CompanyCountryVisaTable({ operations }: CompanyCountryVisaTableProps) {
  const colors = usePublicBrandColors()
  const { countryCoverage } = operations

  if (countryCoverage.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No countries are configured on your agreement yet.
      </Typography>
    )
  }

  return (
    <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: colors.surfaceAlt }}>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.textMuted, py: 1.25, width: '38%' }}>
              Country
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.textMuted, py: 1.25 }}>
              Visa types
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countryCoverage.map(entry => (
            <TableRow key={entry.country} sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: colors.surfaceAlt } }}>
              <TableCell sx={{ fontSize: 13, fontWeight: 600, color: colors.text, py: 1.25 }}>{entry.country}</TableCell>
              <TableCell sx={{ fontSize: 13, color: colors.textSecondary, py: 1.25 }}>{entry.visaTypes.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
