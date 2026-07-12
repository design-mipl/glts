import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Trash2 } from 'lucide-react'
import { IconButton } from '@/design-system/UIComponents'
import type { CommercialVisaPricingRule } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableScrollSx,
  agreementEmbeddedTableSx,
} from '../../../agreements/components/agreementFormLayout'

interface CommercialVisaPricingTableProps {
  rules: CommercialVisaPricingRule[]
  onEdit?: (rule: CommercialVisaPricingRule) => void
  onDelete?: (ruleId: string) => void
  readOnly?: boolean
}

function scopeLabel(rule: CommercialVisaPricingRule): string {
  if (rule.scope === 'country') return 'Country'
  if (rule.scope === 'country_group') return 'Country Group'
  return 'Rest of Countries'
}

function scopeValue(rule: CommercialVisaPricingRule): string {
  if (rule.scope === 'country') return rule.country || '—'
  if (rule.scope === 'country_group') return rule.countryGroupName || '—'
  return 'All other destinations'
}

export function CommercialVisaPricingTable({
  rules,
  onEdit,
  onDelete,
  readOnly,
}: CommercialVisaPricingTableProps) {
  return (
    <Box sx={agreementEmbeddedTableSx}>
      <Box sx={{ ...agreementEmbeddedTableScrollSx, maxHeight: 420 }}>
        <Table size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Scope</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Applies to</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Visa type</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                GLTS fee
              </TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
              {!readOnly ? (
                <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                  Actions
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} hover>
                <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>{scopeLabel(rule)}</TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{scopeValue(rule)}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{rule.visaType || '—'}</TableCell>
                <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatInr(rule.serviceFee)}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>{rule.gstApplicable ? 'Yes' : 'No'}</TableCell>
                <TableCell sx={{ fontSize: 13, color: 'text.secondary', maxWidth: 220 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 13,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={rule.remarks || undefined}
                  >
                    {rule.remarks || '—'}
                  </Typography>
                </TableCell>
                {!readOnly ? (
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                      {onEdit ? (
                        <IconButton
                          tooltip="Edit"
                          size="sm"
                          variant="soft"
                          icon={<Pencil size={14} />}
                          onClick={() => onEdit(rule)}
                        />
                      ) : null}
                      {onDelete ? (
                        <IconButton
                          tooltip="Delete"
                          size="sm"
                          variant="soft"
                          icon={<Trash2 size={14} />}
                          onClick={() => onDelete(rule.id)}
                        />
                      ) : null}
                    </Stack>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}
