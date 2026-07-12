import type { ReactNode } from 'react'
import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Info, Package, Plus, Tags } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import type { QuotationFormData } from '@/shared/types/quotation'
import { computeQuotationFormTotals } from '@/shared/utils/quotationCalculations'
import { isRetailPricingMode } from '@/shared/utils/quotationPricingUtils'
import { QuotationPricingSummary } from '../QuotationPricingSummary'
import { CommercialAddVisaPricingModal } from './CommercialAddVisaPricingModal'
import { CommercialVisaPricingTable } from './CommercialVisaPricingTable'
import { MiscAddServicesModal } from './MiscAddServicesModal'
import { MiscServicesTable } from './MiscServicesTable'
import { RetailAddPricingModal } from './RetailAddPricingModal'
import { RetailVisaPricingCard } from './RetailVisaPricingCard'

interface QuotationPricingSectionProps {
  formData: QuotationFormData
  onChange: (partial: Partial<QuotationFormData>) => void
  error?: string
  readOnly?: boolean
}

function SectionHeader({
  title,
  action,
  disabled,
}: {
  title: string
  action?: ReactNode
  disabled?: boolean
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, fontSize: 14, color: disabled ? 'text.disabled' : 'text.primary' }}
      >
        {title}
      </Typography>
      {action}
    </Stack>
  )
}

function PricingEmptyPlaceholder({
  icon,
  message,
  disabled,
}: {
  icon: ReactNode
  message: string
  disabled?: boolean
}) {
  return (
    <Box
      sx={{
        border: 1,
        borderStyle: disabled ? 'dashed' : 'solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: disabled ? 'action.hover' : 'background.paper',
        px: 2,
        py: 3.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        textAlign: 'center',
        opacity: disabled ? 0.72 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        userSelect: disabled ? 'none' : 'auto',
      }}
    >
      <Box sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography
        variant="body2"
        color={disabled ? 'text.disabled' : 'text.secondary'}
        sx={{ fontSize: 13, maxWidth: 480 }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export function QuotationPricingSection({
  formData,
  onChange,
  error,
  readOnly = false,
}: QuotationPricingSectionProps) {
  const retail = isRetailPricingMode(formData.workflowType)
  const totals = computeQuotationFormTotals(formData)

  const [retailModalOpen, setRetailModalOpen] = useState(false)
  const [retailEditId, setRetailEditId] = useState<string | null>(null)
  const [commercialModalOpen, setCommercialModalOpen] = useState(false)
  const [commercialEditId, setCommercialEditId] = useState<string | null>(null)
  const [miscModalOpen, setMiscModalOpen] = useState(false)
  const [miscEditing, setMiscEditing] = useState(false)

  const retailEditItem = retailEditId
    ? formData.retailVisaPricing.find((i) => i.id === retailEditId) ?? null
    : null
  const commercialEditRule = commercialEditId
    ? formData.commercialVisaPricing.find((i) => i.id === commercialEditId) ?? null
    : null

  const openAddVisaPricing = () => {
    if (retail) {
      setRetailEditId(null)
      setRetailModalOpen(true)
      return
    }
    setCommercialEditId(null)
    setCommercialModalOpen(true)
  }

  return (
    <Stack spacing={3}>
      {error ? (
        <Typography variant="body2" color="error" sx={{ fontSize: 12 }}>
          {error}
        </Typography>
      ) : null}

      <Box>
        <SectionHeader
          title="Visa Pricing"
          action={
            !readOnly ? (
              <Button
                label="Add Pricing"
                size="sm"
                startIcon={<Plus size={14} />}
                onClick={openAddVisaPricing}
              />
            ) : undefined
          }
        />

        {retail ? (
          formData.retailVisaPricing.length === 0 ? (
            <PricingEmptyPlaceholder
              icon={<Tags size={28} />}
              message="No visa pricing added yet. Add a country visa quotation with GLTS and VFS services."
            />
          ) : (
            <Stack spacing={1.5}>
              {formData.retailVisaPricing.map((item) => (
                <RetailVisaPricingCard
                  key={item.id}
                  item={item}
                  readOnly={readOnly}
                  onEdit={() => {
                    setRetailEditId(item.id)
                    setRetailModalOpen(true)
                  }}
                  onDelete={() =>
                    onChange({
                      retailVisaPricing: formData.retailVisaPricing.filter((r) => r.id !== item.id),
                    })
                  }
                />
              ))}
            </Stack>
          )
        ) : formData.commercialVisaPricing.length === 0 ? (
          <PricingEmptyPlaceholder
            icon={<Tags size={28} />}
            message="No visa pricing added yet. Add country, country group, or rest-of-countries GLTS fees."
          />
        ) : (
          <CommercialVisaPricingTable
            rules={formData.commercialVisaPricing}
            readOnly={readOnly}
            onEdit={(rule) => {
              setCommercialEditId(rule.id)
              setCommercialModalOpen(true)
            }}
            onDelete={(ruleId) =>
              onChange({
                commercialVisaPricing: formData.commercialVisaPricing.filter((r) => r.id !== ruleId),
              })
            }
          />
        )}
      </Box>

      <Divider />

      <Box sx={retail ? { opacity: 0.85 } : undefined}>
        <SectionHeader
          title="Miscellaneous Services"
          disabled={retail}
          action={
            !readOnly ? (
              <Button
                label="Add Service"
                size="sm"
                startIcon={<Plus size={14} />}
                disabled={retail}
                onClick={() => {
                  if (retail) return
                  setMiscEditing(false)
                  setMiscModalOpen(true)
                }}
              />
            ) : undefined
          }
        />

        {retail ? (
          <PricingEmptyPlaceholder
            disabled
            icon={<Info size={28} />}
            message="Retail quotations include miscellaneous services within each Visa Pricing item."
          />
        ) : formData.miscellaneousServices.length === 0 ? (
          <PricingEmptyPlaceholder
            icon={<Package size={28} />}
            message="No miscellaneous services added yet. Add agreement-level services such as insurance, courier, or handling."
          />
        ) : (
          <MiscServicesTable
            services={formData.miscellaneousServices}
            readOnly={readOnly}
            onEdit={() => {
              setMiscEditing(true)
              setMiscModalOpen(true)
            }}
            onDelete={(serviceId) =>
              onChange({
                miscellaneousServices: formData.miscellaneousServices.filter((s) => s.id !== serviceId),
              })
            }
          />
        )}
      </Box>

      {retail ? (
        <QuotationPricingSummary totals={totals} gstPercentage={formData.gstPercentage} />
      ) : null}

      <RetailAddPricingModal
        open={retailModalOpen}
        workflowType={formData.workflowType}
        initial={retailEditItem}
        onClose={() => {
          setRetailModalOpen(false)
          setRetailEditId(null)
        }}
        onSave={(item) => {
          const exists = formData.retailVisaPricing.some((r) => r.id === item.id)
          onChange({
            retailVisaPricing: exists
              ? formData.retailVisaPricing.map((r) => (r.id === item.id ? item : r))
              : [...formData.retailVisaPricing, item],
          })
        }}
      />

      <CommercialAddVisaPricingModal
        open={commercialModalOpen}
        workflowType={formData.workflowType}
        initial={commercialEditRule}
        onClose={() => {
          setCommercialModalOpen(false)
          setCommercialEditId(null)
        }}
        onSave={(rule) => {
          const exists = formData.commercialVisaPricing.some((r) => r.id === rule.id)
          onChange({
            commercialVisaPricing: exists
              ? formData.commercialVisaPricing.map((r) => (r.id === rule.id ? rule : r))
              : [...formData.commercialVisaPricing, rule],
          })
        }}
      />

      <MiscAddServicesModal
        open={miscModalOpen}
        workflowType={formData.workflowType}
        initial={miscEditing ? formData.miscellaneousServices : []}
        excludeServiceIds={
          miscEditing
            ? undefined
            : formData.miscellaneousServices.map((s) => s.serviceId)
        }
        onClose={() => {
          setMiscModalOpen(false)
          setMiscEditing(false)
        }}
        onSave={(services) => {
          onChange({
            miscellaneousServices: miscEditing
              ? services
              : [...formData.miscellaneousServices, ...services],
          })
        }}
      />
    </Stack>
  )
}
