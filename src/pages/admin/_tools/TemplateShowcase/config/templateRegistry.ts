/**
 * Single source of truth for module template recipes shown in Admin → Tools → Template showcase.
 * Update this file when adding, renaming, or removing a template recipe.
 * Keep in sync with docs/ADMIN_MODULE_IMPLEMENTATION_GUIDE.md and docAnchor sections in
 * docs/PRODUCT_UI_ARCHITECTURE_UX_STANDARDS.md.
 */

export type TemplateRecipeCategory = 'listing' | 'detail' | 'dashboard' | 'form'

export interface TemplateRecipeDefinition {
  id: string
  title: string
  description: string
  category: TemplateRecipeCategory
  /** Path relative to /admin/tools/templates */
  path: string
  /** Design-system and shell components used by this live demo */
  components: string[]
  docAnchor: string
}

const BASE = '/admin/tools/templates'

export const TEMPLATE_SHOWCASE_BASE = BASE

export const TEMPLATE_RECIPES: TemplateRecipeDefinition[] = [
  {
    id: 'listing',
    title: 'Listing module',
    description:
      'Full admin listing: sticky AdminPageHeader, KPIs, tabs, Filter popover on toolbar, table/grid toggle, column picker, toasts, row actions, and FilterPanel.',
    category: 'listing',
    path: `${BASE}/listing`,
    components: [
      'AdminListingShell',
      'AdminListingStickyHeader',
      'AdminListingToolbar',
      'AdminListingFilterPopover',
      'ListingFilterPopoverShell',
      'AdminListingTable',
      'AdminListingGrid',
      'Tabs',
      'FilterPanel',
      'Pagination',
      'RowActions',
      'useToast',
    ],
    docAnchor: 'listing-modules',
  },
  {
    id: 'detail',
    title: 'Detail module',
    description: 'Summary header, status, actions, and read-only sections using SummaryCard and FormSection.',
    category: 'detail',
    path: `${BASE}/detail`,
    components: ['AdminPageHeader', 'SummaryCard', 'FormSection', 'Badge', 'Button'],
    docAnchor: 'detail-modules',
  },
  {
    id: 'dashboard',
    title: 'Dashboard module',
    description: 'Operational overview with StatCard, MetricCard, ListCard, and ActionCard.',
    category: 'dashboard',
    path: `${BASE}/dashboard`,
    components: ['AdminPageHeader', 'StatCard', 'MetricCard', 'ListCard', 'ActionCard'],
    docAnchor: 'dashboard-modules',
  },
  {
    id: 'form-modal',
    title: 'Form — Modal',
    description: 'Short create/edit surface (2–8 fields) using Modal + FormSection.',
    category: 'form',
    path: `${BASE}/forms/modal`,
    components: [
      'Modal',
      'FormSection',
      'FormField',
      'Input',
      'Select',
      'AdminFullPageFormFooter',
      'Button',
    ],
    docAnchor: 'crud-modules',
  },
  {
    id: 'form-drawer',
    title: 'Form — Drawer',
    description: 'Side edit workflow using Drawer + grouped fields.',
    category: 'form',
    path: `${BASE}/forms/drawer`,
    components: [
      'Drawer',
      'AdminOverlayFormSection',
      'FormField',
      'Input',
      'Select',
      'Textarea',
      'AdminFullPageFormFooter',
      'Button',
    ],
    docAnchor: 'crud-modules',
  },
  {
    id: 'form-page',
    title: 'Form — Full page',
    description: 'Complex create/edit with sections, validation display, and sticky footer actions.',
    category: 'form',
    path: `${BASE}/forms/page`,
    components: [
      'AdminFullPageFormShell',
      'AdminFullPageFormFooter',
      'FormField',
      'Input',
      'Select',
      'Textarea',
      'Breadcrumb',
      'BaseCard',
      'Button',
    ],
    docAnchor: 'crud-modules',
  },
  {
    id: 'form-stepper',
    title: 'Form — Stepper',
    description: 'Multi-step workflow with Stepper, step panels, and review.',
    category: 'form',
    path: `${BASE}/forms/stepper`,
    components: [
      'Stepper',
      'BaseCard',
      'AdminOverlayFormSection',
      'FormField',
      'Input',
      'Select',
      'Textarea',
      'Button',
    ],
    docAnchor: 'crud-modules',
  },
]

export function getTemplateRecipeById(id: string): TemplateRecipeDefinition | undefined {
  return TEMPLATE_RECIPES.find((recipe) => recipe.id === id)
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateRecipeCategory, string> = {
  listing: 'Listing',
  detail: 'Detail',
  dashboard: 'Dashboard',
  form: 'Forms',
}
