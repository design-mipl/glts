import { SEED_QUOTATION_PRICING_TEMPLATES } from '@/shared/data/mockQuotationPricingTemplates'
import type { QuotationPricingTemplate } from '@/shared/types/quotationPricingTemplate'
import type { CommercialVisaPricingRule, QuotationServiceLine } from '@/shared/types/quotation'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'

const STORAGE_KEY = 'glts:quotation-pricing-templates'
const SEED_VERSION_KEY = 'glts:quotation-pricing-templates-seed-version'
const SEED_VERSION = 1

function nowIso() {
  return new Date().toISOString()
}

function id() {
  return `qpt-${Math.random().toString(36).slice(2, 10)}`
}

function readRaw(): QuotationPricingTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as QuotationPricingTemplate[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(rows: QuotationPricingTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

/** Merge fixed seed templates once (by id) so local saves are kept. */
function ensureSeeded(): QuotationPricingTemplate[] {
  const store = readRaw()
  const storedVersion = Number(localStorage.getItem(SEED_VERSION_KEY) ?? '0')
  if (storedVersion >= SEED_VERSION) return store

  const existingIds = new Set(store.map((t) => t.id))
  const missing = SEED_QUOTATION_PRICING_TEMPLATES.filter((t) => !existingIds.has(t.id)).map((t) =>
    structuredClone(t),
  )
  const next = missing.length > 0 ? [...missing, ...store] : store
  writeStore(next)
  localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION))
  return next
}

function cloneRules(rules: CommercialVisaPricingRule[]): CommercialVisaPricingRule[] {
  return rules.map((rule) => ({
    ...rule,
    id: `cvr-${Math.random().toString(36).slice(2, 8)}`,
  }))
}

function cloneServices(services: QuotationServiceLine[]): QuotationServiceLine[] {
  return services.map((svc) => ({
    ...svc,
    id: `qsl-${Math.random().toString(36).slice(2, 8)}`,
  }))
}

export const quotationPricingTemplateService = {
  list(): QuotationPricingTemplate[] {
    return ensureSeeded().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  getById(templateId: string): QuotationPricingTemplate | undefined {
    return ensureSeeded().find((t) => t.id === templateId)
  },

  save(input: {
    name: string
    workflowType: AgreementWorkflowType
    commercialVisaPricing: CommercialVisaPricingRule[]
    miscellaneousServices: QuotationServiceLine[]
  }): QuotationPricingTemplate {
    const timestamp = nowIso()
    const template: QuotationPricingTemplate = {
      id: id(),
      name: input.name.trim(),
      workflowType: input.workflowType,
      commercialVisaPricing: structuredClone(input.commercialVisaPricing),
      miscellaneousServices: structuredClone(input.miscellaneousServices),
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    const store = ensureSeeded()
    store.unshift(template)
    writeStore(store)
    return template
  },

  remove(templateId: string): boolean {
    const store = ensureSeeded()
    const next = store.filter((t) => t.id !== templateId)
    if (next.length === store.length) return false
    writeStore(next)
    return true
  },

  /** Fresh ids so applied rows don’t collide with existing draft ids. */
  materialize(template: QuotationPricingTemplate): {
    commercialVisaPricing: CommercialVisaPricingRule[]
    miscellaneousServices: QuotationServiceLine[]
  } {
    return {
      commercialVisaPricing: cloneRules(template.commercialVisaPricing),
      miscellaneousServices: cloneServices(template.miscellaneousServices),
    }
  },
}
