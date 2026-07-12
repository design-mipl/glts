import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import type { TableState } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import type { AdminStepperFormStep } from '@/pages/admin/components/AdminStepperFormShell'
import { getBillableApplicationRows } from '@/shared/utils/invoiceBillingEngine'
import {
  BillableApplicationSelectionTable,
  type BillableApplicationSelectionFilters,
} from '../components/workspace/BillableApplicationSelectionTable'
import { useGenerateInvoiceComposition } from '../hooks/useGenerateInvoiceComposition'
import { splitBillableSelection } from '../utils/billableApplicationSelectionUtils'
import { parseGenerateInvoiceStepParam } from '../utils/generateInvoiceFlowUtils'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'

const LISTING_PATH = '/admin/finance/invoices'

const INITIAL_TABLE_STATE: TableState = {
  page: 0,
  pageSize: 25,
  sortKey: null,
  sortDirection: null,
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
  hiddenColumnKeys: [],
}

interface GenerateInvoiceLocationState {
  applicationIds?: string[]
  batchIds?: string[]
}

export function GenerateInvoiceStepperPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, LISTING_PATH)
  const [searchParams, setSearchParams] = useSearchParams()
  const draftId = searchParams.get('draftId') ?? undefined
  const routeState = (location.state ?? {}) as GenerateInvoiceLocationState

  const initialStep = useMemo(() => {
    if (draftId) return 1
    return parseGenerateInvoiceStepParam(searchParams.get('step'))
  }, [draftId, searchParams])

  const [activeStep, setActiveStep] = useState(initialStep)
  const [filters, setFilters] = useState<BillableApplicationSelectionFilters>({
    companyId: '',
    dateFrom: '',
    dateTo: '',
  })
  const [tableState, setTableState] = useState<TableState>(INITIAL_TABLE_STATE)
  const [applicationIds, setApplicationIds] = useState<string[]>(routeState.applicationIds ?? [])
  const [batchIds, setBatchIds] = useState<string[]>(routeState.batchIds ?? [])

  const billableRows = useMemo(
    () => getBillableApplicationRows(filters.companyId || undefined, filters.dateFrom, filters.dateTo),
    [filters.companyId, filters.dateFrom, filters.dateTo],
  )

  const selectionCount = tableState.selectedRows.length
  const canProceed = selectionCount > 0

  const composition = useGenerateInvoiceComposition({
    applicationIds,
    batchIds,
    draftId,
    enabled: activeStep === 1,
  })

  useEffect(() => {
    if (activeStep !== 1 || composition.hasSelection) return
    setActiveStep(0)
  }, [activeStep, composition.hasSelection])

  const syncStepToUrl = useCallback(
    (step: number) => {
      const next = new URLSearchParams(searchParams)
      if (step === 1) {
        next.set('step', '1')
      } else {
        next.delete('step')
      }
      if (draftId) {
        next.set('draftId', draftId)
      }
      const nextStr = next.toString()
      const currentStr = searchParams.toString()
      if (nextStr !== currentStr) {
        setSearchParams(next, { replace: true })
      }
    },
    [draftId, searchParams, setSearchParams],
  )

  useEffect(() => {
    syncStepToUrl(activeStep)
  }, [activeStep, syncStepToUrl])

  const handleProceedFromSelection = (): boolean => {
    if (!canProceed) return false
    const split = splitBillableSelection(tableState.selectedRows, billableRows)
    setApplicationIds(split.applicationIds)
    setBatchIds(split.batchIds)
    setActiveStep(1)
    return true
  }

  const handleCancel = () => navigate(listingHref)

  const selectionStepContent = (
    <BillableApplicationSelectionTable
      filters={filters}
      onFiltersChange={setFilters}
      tableState={tableState}
      onTableStateChange={setTableState}
    />
  )

  const steps: AdminStepperFormStep[] = useMemo(
    () => [
      {
        id: 'selection',
        label: 'Select applications',
        description: 'Choose appointment booked applications eligible for billing.',
        children: selectionStepContent,
      },
      {
        id: 'composition',
        label: 'Invoice composition',
        description: 'Configure fees, billing setup, and submit the invoice.',
        sections: composition.sections,
      },
    ],
    [composition.sections, selectionStepContent],
  )

  const footer =
    activeStep === 0 ? (
      <AdminStepperFormFooter
        activeStep={0}
        isLastStep={false}
        onCancel={handleCancel}
        onNext={handleProceedFromSelection}
        nextLabel="Proceed"
        disabled={!canProceed}
      />
    ) : (
      <AdminFullPageFormFooter
        onCancel={() => setActiveStep(0)}
        cancelLabel="Back"
        onDraft={composition.handleSaveDraft}
        draftLabel="Save as Draft"
        onSave={composition.handleSubmit}
        saveLabel="Submit Invoice"
        loading={composition.saving}
        disabled={!composition.ready}
        extraActions={
          <Button
            label="Download Preview"
            variant="outlined"
            onClick={composition.handleDownloadPreview}
            disabled={composition.saving || !composition.ready}
          />
        }
      />
    )

  return (
    <AdminStepperFormShell
      breadcrumbs={[
        { label: 'Billing & invoice', href: listingHref },
        { label: 'Generate invoice' },
      ]}
      steps={steps}
      activeStep={activeStep}
      onActiveStepChange={setActiveStep}
      onStepClick={index => {
        if (index === 1 && !composition.hasSelection && !canProceed && applicationIds.length === 0) {
          return
        }
        if (index === 1 && canProceed && applicationIds.length === 0) {
          const split = splitBillableSelection(tableState.selectedRows, billableRows)
          setApplicationIds(split.applicationIds)
          setBatchIds(split.batchIds)
        }
        if (index <= activeStep || (index === 1 && (composition.hasSelection || draftId))) {
          setActiveStep(index)
        }
      }}
      footer={footer}
    />
  )
}
