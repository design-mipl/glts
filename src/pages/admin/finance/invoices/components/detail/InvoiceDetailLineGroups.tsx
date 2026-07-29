import { useEffect, useMemo, useState } from 'react'
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
import { Button } from '@/design-system/UIComponents'
import type { Invoice, InvoiceLineItem } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { ApplicantFeeAccordion } from '../composition/ApplicantFeeAccordion'
import {
  InvoiceApplicationFeeAccordion,
  InvoiceApplicationFeeAccordionList,
} from '../composition/InvoiceApplicationFeeAccordion'
import {
  buildInvoiceDetailApplicationGroups,
  sumInvoiceDetailLines,
  type InvoiceDetailApplicationGroup,
} from '../../utils/invoiceDetailLineGroups'

function ReadOnlyServiceTable({ lines }: { lines: InvoiceLineItem[] }) {
  if (lines.length === 0) return null

  return (
    <Table
      size="small"
      sx={{
        '& .MuiTableCell-root': { py: 0.625, px: 1.25, borderColor: 'divider' },
        '& .MuiTableCell-head': { py: 0.625 },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
          <TableCell sx={agreementEmbeddedTableHeadCellSx}>Description</TableCell>
          <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 64 }} align="right">
            Qty
          </TableCell>
          <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 120 }} align="right">
            Amount
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lines.map(line => (
          <TableRow key={line.id}>
            <TableCell sx={{ fontSize: 13, fontWeight: 600, verticalAlign: 'middle' }}>
              {line.serviceType || '—'}
            </TableCell>
            <TableCell sx={{ fontSize: 13, verticalAlign: 'middle', color: 'text.secondary' }}>
              {line.description || '—'}
            </TableCell>
            <TableCell sx={{ fontSize: 13, verticalAlign: 'middle' }} align="right">
              {line.quantity}
            </TableCell>
            <TableCell sx={{ fontSize: 13, fontWeight: 600, verticalAlign: 'middle' }} align="right">
              {formatInr(line.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ApplicationGroupAccordion({
  group,
  expanded,
  onExpandedChange,
}: {
  group: InvoiceDetailApplicationGroup
  expanded: boolean
  onExpandedChange: (open: boolean) => void
}) {
  const [expandedPassengers, setExpandedPassengers] = useState<string[]>(() =>
    group.passengers[0] ? [group.passengers[0].key] : [],
  )

  const togglePassenger = (key: string, open: boolean) => {
    setExpandedPassengers(prev =>
      open ? [...prev.filter(id => id !== key), key] : prev.filter(id => id !== key),
    )
  }

  return (
    <InvoiceApplicationFeeAccordion
      id={group.id}
      applicationName={group.displayName}
      typeLabel={group.typeLabel}
      meta={[
        ...(group.typeLabel === 'Bulk'
          ? [
              {
                label: 'Applicants',
                value: String(
                  group.passengers.length > 0
                    ? group.passengers.length
                    : Math.max(
                        1,
                        group.sharedLines.reduce((sum, line) => sum + (line.quantity || 0), 0),
                      ),
                ),
              },
            ]
          : []),
        { label: 'Country', value: group.country },
        { label: 'Visa', value: group.visaType },
        { label: 'Vessel', value: group.vessel },
      ]}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <Stack spacing={1.25}>
        {group.passengers.map(passenger => (
          <ApplicantFeeAccordion
            key={passenger.key}
            applicantId={passenger.key}
            applicantName={passenger.applicantName}
            passportNumber={passenger.passportNumber}
            country={group.country}
            visaType={group.visaType}
            serviceCount={passenger.lines.length}
            servicesTotal={sumInvoiceDetailLines(passenger.lines)}
            expanded={expandedPassengers.includes(passenger.key)}
            onExpandedChange={open => togglePassenger(passenger.key, open)}
          >
            <ReadOnlyServiceTable lines={passenger.lines} />
          </ApplicantFeeAccordion>
        ))}
        {group.sharedLines.length > 0 ? <ReadOnlyServiceTable lines={group.sharedLines} /> : null}
        {group.passengers.length === 0 && group.sharedLines.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, px: 0.5 }}>
            No services on this application.
          </Typography>
        ) : null}
      </Stack>
    </InvoiceApplicationFeeAccordion>
  )
}

interface InvoiceDetailLineGroupsProps {
  invoice: Invoice
  title: string
}

export function InvoiceDetailLineGroups({ invoice, title }: InvoiceDetailLineGroupsProps) {
  const groups = useMemo(() => buildInvoiceDetailApplicationGroups(invoice), [invoice])
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  useEffect(() => {
    setExpandedIds(prev => {
      if (prev.length > 0) return prev.filter(id => groups.some(g => g.id === id))
      return groups[0] ? [groups[0].id] : []
    })
  }, [groups])

  const setExpanded = (id: string, open: boolean) => {
    setExpandedIds(prev => (open ? [...prev.filter(x => x !== id), id] : prev.filter(x => x !== id)))
  }

  if (groups.length === 0) {
    return (
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1.25, fontSize: 13 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          No line items on this invoice.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        useFlexGap
        sx={{ mb: 1.25, flexWrap: 'wrap', rowGap: 1 }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            label="Expand all"
            size="sm"
            variant="outlined"
            onClick={() => setExpandedIds(groups.map(g => g.id))}
          />
          <Button
            label="Collapse all"
            size="sm"
            variant="outlined"
            onClick={() => setExpandedIds([])}
          />
        </Stack>
      </Stack>

      <InvoiceApplicationFeeAccordionList>
        {groups.map(group => (
          <ApplicationGroupAccordion
            key={group.id}
            group={group}
            expanded={expandedIds.includes(group.id)}
            onExpandedChange={open => setExpanded(group.id, open)}
          />
        ))}
      </InvoiceApplicationFeeAccordionList>
    </Box>
  )
}
