import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type {
  ApplicationExpensePassengerSummaryRow,
  ApplicationExpenseRecord,
  UpsertApplicationExpenseInput,
} from '@/shared/types/applicationExpenseManagement'
import {
  computeExpenseTotalAmount,
  EXPENSE_SERVICE_OPTIONS,
  getExpenseServiceDefinition,
} from '../../config/expenseDetailFormConfig'
import { AddExpenseFormFields } from './AddExpenseFormFields'
import { createEmptyAddExpenseForm, type AddExpenseFormValue } from './addExpenseFormTypes'

interface AddExpenseDrawerProps {
  open: boolean
  onClose: () => void
  passengers: ApplicationExpensePassengerSummaryRow[]
  recordType: 'single' | 'bulk'
  record?: ApplicationExpenseRecord | null
  onSubmit: (input: UpsertApplicationExpenseInput) => void
}

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function recordToForm(
  record: ApplicationExpenseRecord,
  isSinglePassenger: boolean,
  defaultPassengerId: string,
): AddExpenseFormValue {
  const serviceDefinition = getExpenseServiceDefinition(record.expenseType)

  return {
    service: record.expenseType,
    vendorProvider: record.vendorStaffPartner ?? serviceDefinition?.defaultVendor ?? '',
    mappingScope: isSinglePassenger ? 'passenger' : record.passengerMapping.scope,
    passengerId: record.passengerMapping.passengerIds?.[0] ?? defaultPassengerId,
    passengerIds: record.passengerMapping.passengerIds ?? [],
    amount: String(record.amount),
    gstApplicable: record.gstAmount > 0 || record.gstIncluded,
    gstValue: String(record.gstAmount),
    paidBy: record.paidBy ?? 'glts_team',
    billTo: record.billTo ?? 'client',
    notes: record.internalRemarks ?? record.remarks ?? '',
    proofDocumentType: record.proofDocumentType ?? '',
    proofFileName: record.proofFileName ?? '',
  }
}

export function AddExpenseDrawer({
  open,
  onClose,
  passengers,
  recordType,
  record,
  onSubmit,
}: AddExpenseDrawerProps) {
  const isSinglePassenger = recordType === 'single' || passengers.length <= 1
  const defaultPassengerId = passengers[0]?.passengerId ?? ''

  const [form, setForm] = useState<AddExpenseFormValue>(() =>
    createEmptyAddExpenseForm(isSinglePassenger, defaultPassengerId),
  )
  const isEdit = Boolean(record)

  useEffect(() => {
    if (!open) return
    if (record) {
      setForm(recordToForm(record, isSinglePassenger, defaultPassengerId))
      return
    }
    setForm(createEmptyAddExpenseForm(isSinglePassenger, defaultPassengerId))
  }, [open, record, isSinglePassenger, defaultPassengerId])

  const patch = useCallback((partial: Partial<AddExpenseFormValue>) => {
    setForm(prev => {
      const next = { ...prev, ...partial }
      if (!record && partial.service) {
        const definition = getExpenseServiceDefinition(partial.service)
        if (definition) {
          next.vendorProvider = definition.defaultVendor
        }
      }
      return next
    })
  }, [record])

  const totalAmount = useMemo(
    () =>
      computeExpenseTotalAmount(
        parseAmount(form.amount),
        form.gstApplicable,
        parseAmount(form.gstValue),
      ),
    [form],
  )

  const buildMapping = (): UpsertApplicationExpenseInput['passengerMapping'] => {
    if (isSinglePassenger) {
      const passenger = passengers[0]
      return {
        scope: 'passenger',
        passengerIds: passenger ? [passenger.passengerId] : [],
        displayLabel: passenger?.passengerName ?? 'Applicant',
      }
    }
    if (form.mappingScope === 'application') {
      return { scope: 'application', displayLabel: 'Entire Application' }
    }
    if (form.mappingScope === 'multiple_passengers') {
      const selected = passengers.filter(p => form.passengerIds.includes(p.passengerId))
      return {
        scope: 'multiple_passengers',
        passengerIds: form.passengerIds,
        displayLabel:
          selected.length > 1
            ? `${selected.length} Passengers`
            : selected[0]?.passengerName ?? 'Selected Passengers',
      }
    }
    const passenger = passengers.find(p => p.passengerId === form.passengerId)
    return {
      scope: 'passenger',
      passengerIds: form.passengerId ? [form.passengerId] : [],
      displayLabel: passenger?.passengerName ?? 'Selected Passenger',
    }
  }

  const handleSubmit = () => {
    const amount = parseAmount(form.amount)
    if (amount <= 0) return

    const gstAmount = form.gstApplicable ? parseAmount(form.gstValue) : 0

    if (isEdit && record) {
      onSubmit({
        expenseName: record.expenseTypeLabel || record.expenseName,
        expenseType: record.expenseType,
        expenseSource: record.expenseSource,
        serviceSource: record.serviceSource,
        linkedService: record.linkedService,
        passengerMapping: buildMapping(),
        vendorStaffPartner: form.vendorProvider || undefined,
        amount,
        gstIncluded: record.gstIncluded,
        gstAmount,
        tdsApplicable: record.tdsApplicable,
        tdsAmount: record.tdsAmount,
        netPayableAmount: totalAmount,
        paymentStatus: record.paymentStatus,
        proofStatus: form.proofFileName.trim() ? 'uploaded' : 'missing',
        proofFileName: form.proofFileName.trim() || undefined,
        proofDocumentType: form.proofDocumentType || undefined,
        paidBy: form.paidBy,
        billTo: form.billTo,
        internalRemarks: form.notes.trim() || undefined,
      })
      onClose()
      return
    }

    const serviceDefinition = getExpenseServiceDefinition(form.service)
    const serviceLabel =
      serviceDefinition?.label ??
      EXPENSE_SERVICE_OPTIONS.find(option => option.value === form.service)?.label ??
      'Expense'

    onSubmit({
      expenseName: serviceLabel,
      expenseType: form.service,
      expenseSource: serviceDefinition?.expenseSource ?? 'manual_finance_entry',
      serviceSource: serviceDefinition?.defaultSource ?? 'other',
      passengerMapping: buildMapping(),
      vendorStaffPartner: form.vendorProvider || undefined,
      amount,
      gstIncluded: false,
      gstAmount,
      tdsApplicable: false,
      tdsAmount: 0,
      netPayableAmount: totalAmount,
      paymentStatus: 'not_paid',
      proofStatus: form.proofFileName.trim() ? 'uploaded' : 'missing',
      proofFileName: form.proofFileName.trim() || undefined,
      proofDocumentType: form.proofDocumentType || undefined,
      paidBy: form.paidBy,
      billTo: form.billTo,
      internalRemarks: form.notes.trim() || undefined,
    })
    onClose()
  }

  const fieldProps = {
    form,
    passengers,
    isSinglePassenger,
    isEdit,
    serviceDisplayName: record ? record.expenseTypeLabel || record.expenseName : undefined,
    totalAmount,
    onPatch: patch,
  }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit expense' : 'Add expense'}
      subtitle={
        isEdit
          ? 'Update vendor, mapping, amount, billing, and proof details for this expense'
          : 'Add an application-linked expense with service, mapping, and proof details'
      }
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel={isEdit ? 'Save changes' : 'Add expense'}
        />
      }
      sections={[
        {
          id: 'service',
          title: 'Service & mapping',
          description: 'Service classification, vendor, and passenger mapping',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <AddExpenseFormFields {...fieldProps} section="service" />,
        },
        {
          id: 'amount',
          title: 'Amount & GST',
          description: 'Base amount, GST, and auto-calculated total',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <AddExpenseFormFields {...fieldProps} section="amount" />,
        },
        {
          id: 'billing',
          title: 'Billing, notes & proof',
          description: 'Paid by, bill to, notes, and supporting proof',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <AddExpenseFormFields {...fieldProps} section="billing" />,
        },
      ]}
    />
  )
}
