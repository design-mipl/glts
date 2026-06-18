import { useState } from 'react'
import { IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Copy, Eye, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Drawer } from '@/design-system/UIComponents'
import { quotationService } from '@/shared/services/quotationService'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import {
  quotationVersionStatusColor,
  quotationVersionStatusLabel,
} from '../../config/quotationStatusConfig'
import { QuotationPricingMatrixTable } from '../QuotationPricingMatrixTable'
import { QuotationPricingSummary } from '../QuotationPricingSummary'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '../../../agreements/components/agreementFormLayout'

const ACTOR = 'Admin User'

export function PricingVersionsTab({ quotation, onReload }: { quotation: QuotationRecord; onReload: () => void }) {
  const navigate = useNavigate()
  const [viewVersionId, setViewVersionId] = useState<string>()
  const versions = [...quotation.pricingVersions].sort((a, b) => b.versionNumber - a.versionNumber)
  const viewVersion = versions.find((v) => v.id === viewVersionId)
  const current = getCurrentVersion(quotation)

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          label="Create New Version"
          size="sm"
          startIcon={<Plus size={14} />}
          onClick={() => {
            const result = quotationService.createPricingVersion(quotation.id, ACTOR, current?.id)
            if (result.ok) {
              onReload()
              navigate(`/admin/customer-accounts/quotations/${quotation.id}/edit`)
            }
          }}
        />
      </Stack>

      <Stack sx={agreementEmbeddedTableSx}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Version</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Total Amount</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Created By</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Created Date</TableCell>
              <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id} hover>
                <TableCell sx={{ fontSize: 13 }}>
                  {version.versionLabel}
                  {version.id === quotation.currentVersionId ? ' (Current)' : ''}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>{formatInr(version.totals.grandTotal)}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Badge
                    label={quotationVersionStatusLabel[version.status]}
                    color={quotationVersionStatusColor[version.status]}
                    size="sm"
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>{version.createdBy}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{new Date(version.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="View version" onClick={() => setViewVersionId(version.id)}>
                    <Eye size={14} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="Duplicate version"
                    onClick={() => {
                      quotationService.duplicatePricingVersion(quotation.id, version.id, ACTOR)
                      onReload()
                      navigate(`/admin/customer-accounts/quotations/${quotation.id}/edit`)
                    }}
                  >
                    <Copy size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      <Drawer
        open={Boolean(viewVersion)}
        onClose={() => setViewVersionId(undefined)}
        title={viewVersion ? `${viewVersion.versionLabel} pricing snapshot` : 'Version'}
      >
        {viewVersion ? (
          <Stack spacing={2}>
            <QuotationPricingMatrixTable
              workflowType={quotation.workflowType}
              pricingMatrix={viewVersion.pricingMatrix}
              onChange={() => {}}
              readOnly
            />
            <QuotationPricingSummary totals={viewVersion.totals} gstPercentage={quotation.gstPercentage} />
          </Stack>
        ) : null}
      </Drawer>
    </Stack>
  )
}
