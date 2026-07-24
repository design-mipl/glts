import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type {
  ApplicationExpensePassengerSummaryRow,
  ApplicationExpenseRecord,
  UpsertApplicationExpenseInput,
} from '@/shared/types/applicationExpenseManagement'
import { taxMasterService } from '@/shared/services/taxMasterService'
import {
  computeExpenseGstAmount,
  computeExpenseTotalAmount,
  getExpenseServiceDefinition,
} from '../../config/expenseDetailFormConfig'
import {
  defaultGstRateIdForAgreement,
  resolveAgreementExpenseServices,
} from '../../utils/agreementExpenseServiceUtils'
import { AddExpenseFormFields } from './AddExpenseFormFields'
import { createEmptyAddExpenseForm, type AddExpenseFormValue } from './addExpenseFormTypes'

interface AddExpenseDrawerProps {
  open: boolean
  onClose: () => void
  passengers: ApplicationExpensePassengerSummaryRow[]
  recordType: 'single' | 'bulk'
  companyName: string
  visaCountry?: string
  visaType?: string
  record?: ApplicationExpenseRecord | null
  onSubmit: (input: UpsertApplicationExpenseInput) => void
}

function parseAmount(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function resolveGstRateIdFromRecord(amount: number, gstAmount: number): string {
  if (amount <= 0 || gstAmount <= 0) return ''
  const percent = Math.round((gstAmount / amount) * 10000) / 100
  const match = taxMasterService
    .listActiveGstOptions()
    .map(option => taxMasterService.getGstById(String(option.value)))
    .find(rate => rate && Math.abs(rate.ratePercent - percent) < 0.05)
  if (match?.id) return match.id
  return String(taxMasterService.listActiveGstOptions().find(o => o.value === 'gst-18')?.value ?? '')
}

function recordToForm(
  record: ApplicationExpenseRecord,
  isSinglePassenger: boolean,
  defaultPassengerId: string,
): AddExpenseFormValue {
  const serviceDefinition = getExpenseServiceDefinition(record.expenseType)
  const gstApplicable = record.gstAmount > 0 || record.gstIncluded

  return {
    agreementServiceId: '',
    vendorProvider: record.vendorStaffPartner ?? serviceDefinition?.defaultVendor ?? '',
    mappingScope: isSinglePassenger ? 'passenger' : record.passengerMapping.scope,
    passengerId: record.passengerMapping.passengerIds?.[0] ?? defaultPassengerId,
    passengerIds: record.passengerMapping.passengerIds ?? [],
    amount: String(record.amount),
    gstApplicable,
    gstRateId: gstApplicable ? resolveGstRateIdFromRecord(record.amount, record.gstAmount) : '',
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
  companyName,
  visaCountry,
  visaType,
  record,
  onSubmit,
}: AddExpenseDrawerProps) {
  const isSinglePassenger = recordType === 'single' || passengers.length <= 1
  const defaultPassengerId = passengers[0]?.passengerId ?? ''

  const [form, setForm] = useState<AddExpenseFormValue>(() =>
    createEmptyAddExpenseForm(isSinglePassenger, defaultPassengerId),
  )
  const isEdit = Boolean(record)

  const agreementServices = useMemo(
    () =>
      resolveAgreementExpenseServices({
        companyName,
        visaCountry,
        visaType,
      }),
    [companyName, visaCountry, visaType],
  )

  useEffect(() => {
    if (!open) return
    if (record) {
      setForm(recordToForm(record, isSinglePassenger, defaultPassengerId))
      return
    }
    setForm(createEmptyAddExpenseForm(isSinglePassenger, defaultPassengerId))
  }, [open, record, isSinglePassenger, defaultPassengerId])

  const patch = useCallback((partial: Partial<AddExpenseFormValue>) => {
    setForm(prev => ({ ...prev, ...partial }))
  }, [])

  const handleSelectAgreementService = useCallback(
    (serviceId: string) => {
      const selected = agreementServices.options.find(option => option.id === serviceId)
      if (!selected) {
        setForm(prev => ({ ...prev, agreementServiceId: serviceId }))
        return
      }
      const gstApplicable = selected.gstApplicable
      setForm(prev => ({
        ...prev,
        agreementServiceId: serviceId,
        amount: selected.amount > 0 ? String(selected.amount) : prev.amount,
        gstApplicable,
        gstRateId: gstApplicable ? defaultGstRateIdForAgreement(true) : '',
        vendorProvider: prev.vendorProvider || 'GLTS Operations',
      }))
    },
    [agreementServices.options],
  )

  const gstPercent = useMemo(
    () => (form.gstApplicable ? taxMasterService.getGstPercent(form.gstRateId) ?? 0 : 0),
    [form.gstApplicable, form.gstRateId],
  )

  const totalAmount = useMemo(
    () => computeExpenseTotalAmount(parseAmount(form.amount), form.gstApplicable, gstPercent),
    [form.amount, form.gstApplicable, gstPercent],
  )

  const selectedAgreementService = useMemo(
    () => agreementServices.options.find(option => option.id === form.agreementServiceId),
    [agreementServices.options, form.agreementServiceId],
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

    const gstAmount = computeExpenseGstAmount(amount, form.gstApplicable, gstPercent)

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
        gstIncluded: form.gstApplicable,
        gstAmount,
        tdsApplicable: record.tdsApplicable,
        tdsAmount: record.tdsAmount,
        netPayableAmount: totalAmount,
        paymentStatus: record.paymentStatus,
        proofStatus: form.proofFileName.trim() ? 'uploaded' : 'missing',
        proofFileName: form.proofFileName.trim() || undefined,
        proofDocumentType: form.proofDocumentType || undefined,
        paidBy: form.paidBy,
        billTo: 'client',
        internalRemarks: form.notes.trim() || undefined,
      })
      onClose()
      return
    }

    if (!selectedAgreementService) return

    onSubmit({
      expenseName: selectedAgreementService.label,
      expenseType: selectedAgreementService.expenseType,
      expenseSource: selectedAgreementService.expenseSource,
      serviceSource: selectedAgreementService.serviceSource,
      linkedService: selectedAgreementService.linkedService,
      passengerMapping: buildMapping(),
      vendorStaffPartner: form.vendorProvider || undefined,
      amount,
      gstIncluded: form.gstApplicable,
      gstAmount,
      tdsApplicable: false,
      tdsAmount: 0,
      netPayableAmount: totalAmount,
      paymentStatus: 'not_paid',
      proofStatus: form.proofFileName.trim() ? 'uploaded' : 'missing',
      proofFileName: form.proofFileName.trim() || undefined,
      proofDocumentType: form.proofDocumentType || undefined,
      paidBy: form.paidBy,
      billTo: 'client',
      internalRemarks: form.notes.trim() || undefined,
    })
    onClose()
  }

  const canSave =
    parseAmount(form.amount) > 0 && (isEdit || Boolean(selectedAgreementService))

  const fieldProps = {
    form,
    passengers,
    isSinglePassenger,
    isEdit,
    serviceDisplayName: record ? record.expenseTypeLabel || record.expenseName : undefined,
    agreementServiceOptions: agreementServices.options,
    agreementLabel: agreementServices.agreement?.agreementId,
    totalAmount,
    onPatch: patch,
    onSelectAgreementService: handleSelectAgreementService,
  }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit expense' : 'Add expense'}
      subtitle={
        isEdit
          ? 'Update vendor, mapping, amount, billing, and proof details for this expense'
          : 'Service list comes from the client agreement (including Add-on lines). Select one, then map passengers and proof.'
      }
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSubmit}
          saveLabel={isEdit ? 'Save changes' : 'Add expense'}
          disabled={!canSave}
        />
      }
      sections={[
        {
          id: 'service',
          title: 'Service & mapping',
          description: 'Agreement service, vendor, and passenger mapping',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <AddExpenseFormFields {...fieldProps} section="service" />,
        },
        {
          id: 'amount',
          title: 'Amount & GST',
          description: 'Prefills from the agreement; adjust GST % from GST master if needed',
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
