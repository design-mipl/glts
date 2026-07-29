import { useState } from 'react'
import { IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { ArrowRight, Copy, Eye, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal } from '@/design-system/UIComponents'
import { quotationService } from '@/shared/services/quotationService'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import { canConvertQuotationToAgreement } from '@/shared/utils/quotationPricingUtils'
import { QuotationPricingMatrixTable } from '../QuotationPricingMatrixTable'
import { QuotationPricingSummary } from '../QuotationPricingSummary'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '../../../agreements/components/agreementFormLayout'

const ACTOR = 'Admin User'

interface PricingVersionsTabProps {
  quotation: QuotationRecord
  onReload: () => void
  onConvert: (versionId: string) => void
}

export function PricingVersionsTab({ quotation, onReload, onConvert }: PricingVersionsTabProps) {
  const navigate = useNavigate()
  const [viewVersionId, setViewVersionId] = useState<string>()
  const versions = [...quotation.pricingVersions].sort((a, b) => b.versionNumber - a.versionNumber)
  const viewVersion = versions.find((v) => v.id === viewVersionId)
  const current = getCurrentVersion(quotation)
  const canConvert = canConvertQuotationToAgreement(quotation)

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
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Pricing Rows</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Total Amount</TableCell>
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
                <TableCell sx={{ fontSize: 13 }}>{version.pricingMatrix.length}</TableCell>
                <TableCell sx={{ fontSize: 13 }}>{formatInr(version.totals.grandTotal)}</TableCell>
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
                  {canConvert &&
                  ((version.commercialVisaPricing?.length ?? 0) > 0 ||
                    version.pricingMatrix.length > 0) ? (
                    <IconButton
                      size="small"
                      aria-label="Convert version to agreement"
                      onClick={() => onConvert(version.id)}
                    >
                      <ArrowRight size={14} />
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      <Modal
        open={Boolean(viewVersion)}
        onClose={() => setViewVersionId(undefined)}
        title={viewVersion ? `${viewVersion.versionLabel} pricing snapshot` : 'Version'}
        size="lg"
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
      </Modal>
    </Stack>
  )
}
