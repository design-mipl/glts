import { useState } from 'react'
import { Stack } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { Button, ConfirmDialog, Menu, useToast } from '@/design-system/UIComponents'
import { quotationCustomerTypeOptions } from '../../config/quotationCustomerTypeOptions'
import { quotationPricingTemplateService } from '@/shared/services/quotationPricingTemplateService'
import type { QuotationFormData } from '@/shared/types/quotation'
import type { QuotationPricingTemplate } from '@/shared/types/quotationPricingTemplate'
import { isRetailPricingMode } from '@/shared/utils/quotationPricingUtils'
import { SavePricingTemplateModal } from './SavePricingTemplateModal'

function workflowTypeLabel(value: string): string {
  return quotationCustomerTypeOptions.find((o) => o.value === value)?.label ?? value
}

interface QuotationPricingTemplateControlsProps {
  formData: QuotationFormData
  onChange: (partial: Partial<QuotationFormData>) => void
  readOnly?: boolean
}

/** Templates + Save as template for the Pricing section header (commercial only). */
export function QuotationPricingTemplateControls({
  formData,
  onChange,
  readOnly = false,
}: QuotationPricingTemplateControlsProps) {
  const { showToast } = useToast()
  const retail = isRetailPricingMode(formData.workflowType)
  const hasCommercialPricing =
    formData.commercialVisaPricing.length > 0 || formData.miscellaneousServices.length > 0

  const [templates, setTemplates] = useState<QuotationPricingTemplate[]>(() =>
    quotationPricingTemplateService.list(),
  )
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<QuotationPricingTemplate | null>(null)

  if (readOnly || retail) return null

  const refreshTemplates = () => {
    setTemplates(quotationPricingTemplateService.list())
  }

  const applyTemplate = (template: QuotationPricingTemplate) => {
    const materialised = quotationPricingTemplateService.materialize(template)
    onChange({
      commercialVisaPricing: materialised.commercialVisaPricing,
      miscellaneousServices: materialised.miscellaneousServices,
      retailVisaPricing: [],
    })
    showToast({
      variant: 'success',
      title: 'Template applied',
      description: `"${template.name}" replaced the current pricing.`,
    })
  }

  const requestApplyTemplate = (template: QuotationPricingTemplate) => {
    if (hasCommercialPricing) {
      setPendingTemplate(template)
      return
    }
    applyTemplate(template)
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Menu
          placement="bottom-end"
          trigger={
            <Button
              label="Templates"
              size="sm"
              variant="neutral"
              endIcon={<ChevronDown size={14} />}
              onClick={refreshTemplates}
            />
          }
          items={
            templates.length === 0
              ? [{ label: 'No templates yet', disabled: true }]
              : templates.map((template) => ({
                  label: `${template.name} · ${workflowTypeLabel(template.workflowType)}`,
                  onClick: () => requestApplyTemplate(template),
                }))
          }
        />
        <Button
          label="Save as template"
          size="sm"
          variant="neutral"
          disabled={!hasCommercialPricing}
          onClick={() => setSaveTemplateOpen(true)}
        />
      </Stack>

      <SavePricingTemplateModal
        open={saveTemplateOpen}
        onClose={() => setSaveTemplateOpen(false)}
        onSave={(name) => {
          quotationPricingTemplateService.save({
            name,
            workflowType: formData.workflowType,
            commercialVisaPricing: formData.commercialVisaPricing,
            miscellaneousServices: formData.miscellaneousServices,
          })
          refreshTemplates()
          showToast({
            variant: 'success',
            title: 'Template saved',
            description: `"${name}" is available from Templates.`,
          })
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingTemplate)}
        onClose={() => setPendingTemplate(null)}
        title="Replace current pricing?"
        description={
          pendingTemplate
            ? `Applying "${pendingTemplate.name}" will replace all visa pricing and miscellaneous services on this quotation.`
            : undefined
        }
        confirmLabel="Replace pricing"
        variant="destructive"
        onConfirm={() => {
          if (!pendingTemplate) return
          applyTemplate(pendingTemplate)
          setPendingTemplate(null)
        }}
      />
    </>
  )
}
