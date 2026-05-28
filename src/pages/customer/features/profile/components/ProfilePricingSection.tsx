import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { PricingGroup, PricingModel } from '../types/accountWorkspace'

const pricingModelLabel: Record<PricingModel, string> = {
  credit: 'Credit',
  advance: 'Advance',
  mixed: 'Mixed',
}

export interface ProfilePricingSectionProps {
  groups: PricingGroup[]
}

export function ProfilePricingSection({ groups }: ProfilePricingSectionProps) {
  const colors = usePublicBrandColors()
  const [search, setSearch] = useState('')
  const q = search.trim().toLowerCase()

  const filteredGroups = useMemo(() => {
    if (!q) return groups
    return groups
      .map(g => ({
        ...g,
        rows: g.rows.filter(
          row =>
            row.country.toLowerCase().includes(q) ||
            row.visaType.toLowerCase().includes(q) ||
            row.serviceType.toLowerCase().includes(q),
        ),
      }))
      .filter(g => g.rows.length > 0)
  }, [groups, q])

  return (
    <Box>
      <TextField
        size="small"
        fullWidth
        placeholder="Search pricing by country, visa type, or service"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2, maxWidth: 420 }}
      />
      {filteredGroups.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: colors.textMuted }}>No pricing rows match your search.</Typography>
      ) : (
        filteredGroups.map(group => (
          <Accordion
            key={group.id}
            defaultExpanded
            disableGutters
            elevation={0}
            sx={{
              mb: 1,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px !important',
              '&:before': { display: 'none' },
              overflow: 'hidden',
            }}
          >
            <AccordionSummary expandIcon={<ChevronDown size={18} />} sx={{ bgcolor: colors.surface, minHeight: 44 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy }}>{group.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer sx={{ maxHeight: 320 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Visa type</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Base fee</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Add-ons</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Model</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.rows.map(row => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontSize: 12 }}>{row.visaType}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.serviceType}</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{row.baseFee}</TableCell>
                        <TableCell sx={{ fontSize: 12, color: colors.textMuted }}>{row.additionalCharges ?? '—'}</TableCell>
                        <TableCell>
                          <CustomerStatusChip label={pricingModelLabel[row.pricingModel]} tone="info" size="sm" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  )
}
