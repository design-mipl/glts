# Foundation — Module Building Guide

Build a complete CRUD-style module using the **Billings** reference implementation.

**Related docs:** [PROJECT_STARTUP.md](./PROJECT_STARTUP.md) · [FORM_PATTERNS.md](./FORM_PATTERNS.md) · [CLAUDE.md](./CLAUDE.md)

---

## Module Architecture

Each module typically includes up to **3 page types**:

### 1. Listing Page

Table (or grid) with KPI summary, status tabs, search, filters, pagination, row actions, and optional modal create.

### 2. Form Pages (4 variants)

| Variant | When to use |
|---------|-------------|
| **Modal** | Quick create/edit, few fields |
| **Drawer** | Side edit without leaving listing |
| **Full-page** | Primary create/edit flow, many sections |
| **Stepper** | Long flows split into logical steps |

### 3. Detail Page

Read-only layout with breadcrumbs, actions, and 2-column sections. Edit opens modal, drawer, or navigates to form route.

---

## Step-by-Step Module Creation

### Step 1: Define Types

Billings keeps domain types in the template. Copy and adapt `src/design-system/UIComponents/Templates/BillingTemplate/types.ts`:

```typescript
// YourModuleTemplate/types.ts
import type { TagVariant } from '@/design-system/UIComponents/Display/Tag'

export type ItemStatus = 'Draft' | 'Active' | 'Inactive' | 'Archived'

export interface Item {
  id: string
  name: string
  email: string
  status: ItemStatus
  amount: number
  createdAt: string
}

export interface ItemFormData {
  name: string
  email: string
  status: ItemStatus
  notes: string
  amount: number
}

export interface KpiCardData {
  id: string
  label: string
  amount: number
  color: 'primary' | 'success' | 'warning' | 'info'
}

export const EMPTY_FORM: ItemFormData = {
  name: '',
  email: '',
  status: 'Draft',
  notes: '',
  amount: 0,
}
```

---

### Step 2: Create Mock Data Hook

Pattern from `src/pages/Billings/hooks/useBillingData.ts`:

```typescript
import type { Item, KpiCardData } from '@/design-system/UIComponents/Templates/YourModuleTemplate/types'

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    amount: 1000,
    createdAt: '2026-01-15',
  },
  // ...more rows
]

export const KPI_DATA: KpiCardData[] = [
  { id: 'total', label: 'Total Items', amount: 12, color: 'primary' },
  { id: 'active', label: 'Active', amount: 8, color: 'success' },
  { id: 'inactive', label: 'Inactive', amount: 3, color: 'warning' },
  { id: 'draft', label: 'Draft', amount: 1, color: 'info' },
]

export const STATUS_TAB_MAP: Record<string, ItemStatus | null> = {
  all: null,
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
}

export function getItemById(id: string): Item | undefined {
  return MOCK_ITEMS.find((item) => item.id === id)
}

export function filterByStatus(items: Item[], statusTab: string): Item[] {
  const status = STATUS_TAB_MAP[statusTab]
  if (!status) return items
  return items.filter((item) => item.status === status)
}

export function searchItems(items: Item[], query: string): Item[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q),
  )
}

export function useYourModuleData() {
  return {
    items: MOCK_ITEMS,
    kpiData: KPI_DATA,
    getItemById,
    filterByStatus,
    searchItems,
  }
}
```

---

### Step 3: Build Listing Page

The Billings listing composes template components and local state. See `src/pages/Billings/components/ListingPage.tsx`.

**Core structure:**

```typescript
import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button, useToast } from '@/design-system/components'
import type { TableState } from '@/design-system/components'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import {
  YourModuleKPICards,
  YourModuleStatusTabs,
  YourModuleTable,
  YourModulePagination,
  YourModuleModal,
  YourModuleToolbar,
} from '@/design-system/UIComponents/Templates/YourModuleTemplate'
import type { Item } from '@/design-system/UIComponents/Templates/YourModuleTemplate/types'
import { useYourModuleData } from '../hooks/useYourModuleData'

const initialTableState: TableState = {
  page: 0,
  pageSize: 10,
  sortKey: null,
  sortDirection: null,
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
  hiddenColumnKeys: [],
}

export default function ListingPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { items, kpiData, filterByStatus, searchItems } = useYourModuleData()

  const [statusTab, setStatusTab] = useState('all')
  const [tableState, setTableState] = useState<TableState>(initialTableState)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredItems = useMemo(() => {
    let result = items
    result = filterByStatus(result, statusTab)
    result = searchItems(result, tableState.searchQuery)
    return result
  }, [items, statusTab, tableState.searchQuery, filterByStatus, searchItems])

  const paginatedItems = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return filteredItems.slice(start, start + tableState.pageSize)
  }, [filteredItems, tableState.page, tableState.pageSize])

  const handleView = useCallback(
    (item: Item) => navigate(`/your-module/${item.id}`),
    [navigate],
  )

  const handleEdit = useCallback(
    (item: Item) => navigate(`/your-module/${item.id}/edit`),
    [navigate],
  )

  return (
    <Box>
      <YourModuleKPICards data={kpiData} />

      <Card
        elevation={0}
        sx={{
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          overflow: 'hidden',
        }}
      >
        <YourModuleStatusTabs value={statusTab} onChange={setStatusTab} />

        <YourModuleToolbar
          searchQuery={tableState.searchQuery}
          onSearchChange={(q) => setTableState((s) => ({ ...s, searchQuery: q, page: 0 }))}
          onAddClick={() => setModalOpen(true)}
        />

        <YourModuleTable
          items={paginatedItems}
          tableState={tableState}
          onTableStateChange={setTableState}
          onView={handleView}
          onEdit={handleEdit}
        />

        <YourModulePagination
          total={filteredItems.length}
          page={tableState.page}
          pageSize={tableState.pageSize}
          onPageChange={(page) => setTableState((s) => ({ ...s, page }))}
          onPageSizeChange={(pageSize) => setTableState((s) => ({ ...s, pageSize, page: 0 }))}
        />
      </Card>

      <YourModuleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {
          showToast({ title: 'Saved', variant: 'success' })
          setModalOpen(false)
        }}
      />

      <Button
        variant="contained"
        startIcon={<Plus size={16} />}
        onClick={() => navigate('/your-module/create')}
        sx={{ mt: 2 }}
      >
        Full-page create
      </Button>
    </Box>
  )
}
```

**Listing checklist (from Billings):**

- [ ] KPI row (`BillingKPICards` pattern)
- [ ] Status tabs with counts
- [ ] Search debounced via `tableState.searchQuery`
- [ ] Column filters (optional, `BillingColumnFilter`)
- [ ] Table/grid toggle
- [ ] Pagination synced with `TableState`
- [ ] Row actions: view, edit, delete
- [ ] Modal + link to full-page create

---

### Step 4: Build Form Pages

Shared form body: **`BillingFormSections`** pattern — `FormSection` + `FormField` + design-system inputs.

#### Modal (from `BillingModal.tsx`)

```typescript
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Button, Modal } from '@/design-system/components'
import type { ItemFormData } from '../types'
import { EMPTY_FORM } from '../types'
import YourModuleFormSections from './YourModuleFormSections'

export interface YourModuleModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: ItemFormData) => void
  initialData?: Partial<ItemFormData>
}

export default function YourModuleModal({
  open,
  onClose,
  onSave,
  initialData,
}: YourModuleModalProps) {
  const [formData, setFormData] = useState<ItemFormData>({ ...EMPTY_FORM, ...initialData })

  useEffect(() => {
    if (open) setFormData({ ...EMPTY_FORM, ...initialData })
  }, [open, initialData])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add item"
      subtitle="Fill in the details"
      size="md"
      footer={
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => { onSave?.(formData); onClose() }}>Save</Button>
        </Box>
      }
    >
      <YourModuleFormSections data={formData} onChange={setFormData} />
    </Modal>
  )
}
```

#### Drawer (from `BillingDrawer.tsx`)

Same as modal, but use `Drawer` with `width={500}` and full-width footer buttons.

#### Full-page (from `FormPage.tsx`)

```typescript
import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton, Breadcrumb, useToast } from '@/design-system/components'
import {
  YourModuleFormSections,
  YourModuleFormCard,
  EMPTY_FORM,
} from '@/design-system/UIComponents/Templates/YourModuleTemplate'
import { useYourModuleData } from '../hooks/useYourModuleData'

export default function FormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { getItemById } = useYourModuleData()
  const isEdit = Boolean(id)
  const item = id ? getItemById(id) : undefined

  const [formData, setFormData] = useState(() =>
    item ? { ...EMPTY_FORM, name: item.name, email: item.email } : { ...EMPTY_FORM },
  )

  const handleSave = () => {
    showToast({ title: 'Saved', variant: 'success' })
    navigate('/your-module')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BackButton href="/your-module" />
        <Breadcrumb
          items={[
            { label: 'Your Module', href: '/your-module' },
            { label: isEdit ? 'Edit item' : 'Add item' },
          ]}
        />
      </Box>

      <Box sx={{ maxWidth: 960, mx: 'auto' }}>
        <YourModuleFormCard
          title={isEdit ? 'Edit item' : 'Add item'}
          subtitle="Fill in the details"
          onCancel={() => navigate('/your-module')}
          onSaveDraft={() => showToast({ title: 'Draft saved', variant: 'info' })}
          onSave={handleSave}
        >
          <YourModuleFormSections data={formData} onChange={setFormData} />
        </YourModuleFormCard>
      </Box>
    </Box>
  )
}
```

#### Stepper (from `StepperFormPage.tsx`)

```typescript
import { useState } from 'react'
import { Box, Card, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BackButton, Breadcrumb, Button, Stepper, useToast } from '@/design-system/components'
import { YourModuleFormSections, EMPTY_FORM } from '@/design-system/UIComponents/Templates/YourModuleTemplate'
import type { ItemFormData } from '@/design-system/UIComponents/Templates/YourModuleTemplate/types'

const STEPS = [
  { label: 'Basic info', description: 'Name and contact' },
  { label: 'Details', description: 'Status and notes' },
  { label: 'Review', description: 'Confirm data' },
  { label: 'Confirm', description: 'Save' },
]

export default function StepperFormPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<ItemFormData>({ ...EMPTY_FORM })

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BackButton href="/your-module" />
        <Breadcrumb items={[{ label: 'Your Module', href: '/your-module' }, { label: 'Create (stepper)' }]} />
      </Box>

      <Stepper steps={STEPS} activeStep={activeStep} sx={{ mb: 4 }} />

      <Card sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && (
          <YourModuleFormSections
            data={formData}
            onChange={setFormData}
            showNotes={false}
          />
        )}
        {activeStep === 1 && (
          <Typography variant="body2">Additional fields step</Typography>
        )}
        {activeStep === 2 && (
          <Typography variant="body2">Review: {formData.name} — {formData.email}</Typography>
        )}
        {activeStep === 3 && (
          <Typography variant="body2">Ready to submit.</Typography>
        )}
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>
          Previous
        </Button>
        {activeStep === STEPS.length - 1 ? (
          <Button variant="contained" onClick={() => { showToast({ title: 'Done', variant: 'success' }); navigate('/your-module') }}>
            Finish
          </Button>
        ) : (
          <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)}>Next</Button>
        )}
      </Box>
    </Box>
  )
}
```

Full variant details: [FORM_PATTERNS.md](./FORM_PATTERNS.md).

---

### Step 5: Build Detail Page

Follow `src/pages/Billings/components/DetailPage.tsx`:

- Load entity by `useParams().id`
- `BackButton` + `Breadcrumb` above content
- Header with title and action buttons
- `BillingDetailSections` (read-only 2-column grid)

```typescript
import { Box } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { BackButton, Breadcrumb, Button } from '@/design-system/components'
import { Pencil } from 'lucide-react'
import { YourModuleDetailSections } from '@/design-system/UIComponents/Templates/YourModuleTemplate'
import { useYourModuleData } from '../hooks/useYourModuleData'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getItemById } = useYourModuleData()
  const item = id ? getItemById(id) : undefined

  if (!item) return null

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BackButton href="/your-module" />
          <Breadcrumb items={[{ label: 'Your Module', href: '/your-module' }, { label: item.name }]} />
        </Box>
        <Button
          variant="outlined"
          startIcon={<Pencil size={16} />}
          onClick={() => navigate(`/your-module/${item.id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <YourModuleDetailSections item={item} />
    </Box>
  )
}
```

---

## Form Sections Example (Real Billings Pattern)

From `BillingFormSections.tsx`:

```typescript
<FormSection title="Invoice details" columns={2}>
  <FormField label="Invoice no." required>
    <Input
      placeholder="e.g., INV-2026-001"
      value={data.invoiceNo}
      onChange={(value) => patch({ invoiceNo: value })}
    />
  </FormField>
  <FormField label="Client" required>
    <Select
      placeholder="Select client"
      value={data.client}
      onChange={(val) => patch({ client: String(val) })}
      options={clientOptions}
    />
  </FormField>
</FormSection>
```

Foundation `Input` / `Select` use **value/onChange callbacks** (not native DOM events).

---

## Component Reusability

| Source (Billings) | Target (your module) |
|-------------------|------------------------|
| `BillingKPICards` | `YourModuleKPICards` |
| `BillingStatusTabs` | `YourModuleStatusTabs` |
| `BillingToolbar` | `YourModuleToolbar` |
| `BillingTable` | `YourModuleTable` |
| `BillingPagination` | `YourModulePagination` |
| `BillingModal` | `YourModuleModal` |
| `BillingDrawer` | `YourModuleDrawer` |
| `BillingFormCard` | `YourModuleFormCard` |
| `BillingFormSections` | `YourModuleFormSections` |
| `BillingDetailSections` | `YourModuleDetailSections` |

**Replace:**

- Type names (`Invoice` → `Item`)
- Field keys and column definitions
- Status enum values and tab map
- Formatters (e.g. `formatINR` → your currency helper)
- Routes (`/billings` → `/your-module`)

---

## Layout Shell

`src/pages/Billings/index.tsx`:

```typescript
import { Outlet } from 'react-router-dom'

export default function BillingsLayout() {
  return <Outlet />
}
```

Copy this for `YourModule/index.tsx` so child routes render without remounting the shell.

---

## Testing Checklist

- [ ] Listing shows KPI + table data
- [ ] Status tabs filter rows
- [ ] Search narrows results
- [ ] Pagination and page size work
- [ ] Modal opens, saves, closes
- [ ] Drawer opens (if used)
- [ ] Full-page create and edit routes work
- [ ] Stepper advances through all steps
- [ ] Detail loads by ID; Edit navigates correctly
- [ ] Breadcrumbs and BackButton paths correct
- [ ] Toasts on save/error
- [ ] Responsive: 320px, 1024px, 1920px
- [ ] Light and dark mode
- [ ] `npm run build` passes

---

## Tips & Tricks

1. **Copy `BillingTemplate` first** — rename in one pass with IDE refactor
2. **Keep `TableState` in listing** — matches `DataTable` APIs
3. **Share one `FormSections` component** — modal, drawer, and full-page stay in sync
4. **Use `EMPTY_FORM` constant** — reset modal/drawer on open via `useEffect`
5. **Lazy-load page components** — keeps initial bundle small
6. **Pre-fill edit forms** — `getItemById` in `useState` initializer (see `FormPage.tsx`)
7. **Stepper review step** — map `formData` to a preview object (see `formToReviewInvoice` in Billings)
8. **Export template from `index.ts`** — clean imports in pages

---

## Common Issues

| Symptom | Fix |
|---------|-----|
| Blank child route | Parent must render `<Outlet />` |
| Input not updating | Use Foundation `onChange={(value) => ...}` signature |
| Modal stale data | Reset state when `open` becomes true |
| Wrong nav active | Match `href` and `path` exactly |
| Types out of sync | Single `types.ts` imported by template + hook |

---

## See Also

- [PROJECT_STARTUP.md](./PROJECT_STARTUP.md) — clone, routes, nav
- [FORM_PATTERNS.md](./FORM_PATTERNS.md) — all four form variants in depth
- [CLAUDE.md](./CLAUDE.md) — components, tokens, breakpoints
