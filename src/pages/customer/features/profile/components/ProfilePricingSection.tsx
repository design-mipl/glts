import { Box, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Package, Tags } from 'lucide-react'
import type { ReactNode } from 'react'
import type { CommercialVisaPricingRule, QuotationServiceLine } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export interface ProfilePricingSectionProps {
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
}

function scopeLabel(rule: CommercialVisaPricingRule): string {
  if (rule.scope === 'country') return 'Country'
  if (rule.scope === 'country_group') return 'Country Group'
  if (rule.scope === 'rest_of_countries_online') return 'Rest of the countries online'
  return 'Rest of the countries offline'
}

function scopeValue(rule: CommercialVisaPricingRule): string {
  if (rule.scope === 'country') return rule.country || '—'
  if (rule.scope === 'country_group') return rule.countryGroupName || '—'
  if (rule.scope === 'rest_of_countries_online') return 'All other destinations (online)'
  return 'All other destinations (offline)'
}

function headCellSx(colors: ReturnType<typeof usePublicBrandColors>) {
  return {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
    bgcolor: colors.surfaceAlt,
    py: 1.25,
    whiteSpace: 'nowrap' as const,
  }
}

function SectionTitle({ children }: { children: string }) {
  const colors = usePublicBrandColors()
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text, mb: 1.25 }}>
      {children}
    </Typography>
  )
}

function EmptyPlaceholder({
  icon,
  message,
}: {
  icon: ReactNode
  message: string
}) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        px: 2,
        py: 3.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: colors.textMuted, display: 'flex' }}>{icon}</Box>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, maxWidth: 480 }}>{message}</Typography>
    </Box>
  )
}

function TableShell({ children, minWidth }: { children: ReactNode; minWidth: number }) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ overflowX: 'auto', maxHeight: 420 }}>
        <Table size="small" sx={{ minWidth }}>
          {children}
        </Table>
      </Box>
    </Box>
  )
}

export function ProfilePricingSection({
  commercialVisaPricing,
  miscellaneousServices,
}: ProfilePricingSectionProps) {
  const colors = usePublicBrandColors()
  const head = headCellSx(colors)

  return (
    <Stack spacing={3}>
      <Box>
        <SectionTitle>Visa Pricing</SectionTitle>
        {commercialVisaPricing.length === 0 ? (
          <EmptyPlaceholder
            icon={<Tags size={28} />}
            message="No visa pricing configured on your agreement yet."
          />
        ) : (
          <TableShell minWidth={720}>
            <TableHead>
              <TableRow>
                <TableCell sx={head}>Scope</TableCell>
                <TableCell sx={head}>Applies to</TableCell>
                <TableCell sx={head}>Visa type</TableCell>
                <TableCell sx={head} align="right">
                  GLTS fee
                </TableCell>
                <TableCell sx={head}>GST</TableCell>
                <TableCell sx={head}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commercialVisaPricing.map(rule => (
                <TableRow key={rule.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap', color: colors.text }}>
                    {scopeLabel(rule)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: colors.text }}>
                    {scopeValue(rule)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.text }}>{rule.visaType || '—'}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', color: colors.text }}
                  >
                    {formatInr(rule.serviceFee)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.text }}>
                    {rule.gstApplicable ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary, maxWidth: 220 }}>
                    <Typography
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
                </TableRow>
              ))}
            </TableBody>
          </TableShell>
        )}
      </Box>

      <Divider />

      <Box>
        <SectionTitle>Miscellaneous Services</SectionTitle>
        {miscellaneousServices.length === 0 ? (
          <EmptyPlaceholder
            icon={<Package size={28} />}
            message="No miscellaneous services added yet. Agreement-level services such as insurance, courier, or handling will appear here."
          />
        ) : (
          <TableShell minWidth={560}>
            <TableHead>
              <TableRow>
                <TableCell sx={head}>Service</TableCell>
                <TableCell sx={head} align="right">
                  Amount
                </TableCell>
                <TableCell sx={head}>GST</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {miscellaneousServices.map(svc => (
                <TableRow key={svc.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: colors.text }}>
                    {svc.serviceName}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', color: colors.text }}
                  >
                    {formatInr(svc.amount)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.text }}>
                    {svc.gstApplicable ? 'Yes' : 'No'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableShell>
        )}
      </Box>
    </Stack>
  )
}
