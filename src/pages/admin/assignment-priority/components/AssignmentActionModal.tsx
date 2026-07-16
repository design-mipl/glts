import { useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { Button, Checkbox, FormField, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { vendorService } from '@/shared/services/vendorService'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { resolveFundAllocationOfferingContext } from '@/shared/utils/fundAllocationOfferingUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  mapVfsPickerServicesToChargeLines,
  resolveVfsPickerServices,
  sumVfsPickerServiceAmounts,
  type VfsPickerService,
  type VfsServiceChargeLine,
} from '@/shared/utils/vfsServicePickerUtils'
import {
  vfsServicePickerEmptyStateSx,
  vfsServicePickerLayout,
  vfsServicePickerListSx,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'
import type {
  AssignmentAssigneeType,
  OperationalPassengerRow,
  PassengerOperationalStatus,
} from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_CITY_TEAMS } from '@/shared/types/operationalPassengerAssignment'
import { ASSIGN_USER_VENDOR_ACTION_LABEL } from '../config/assignmentActionConfig'
import { ASSIGNMENT_PRIORITY_OPTIONS } from '../config/assignmentPriorityConfig'
import { PASSENGER_STATUS_OPTIONS } from '../config/assignmentStatusConfig'
import type { AssignmentAdminAction, DeskPassengerAction } from './AssignmentActionMenu'
import { AssignmentAssigneeTypeToggle } from './AssignmentAssigneeTypeToggle'

export type AssignmentActionPayload =
  | {
      action: 'assign_user'
      assigneeType: AssignmentAssigneeType
      team: string
      user: string
      vendor: string
      priority: string
      passengerPhone?: string
      passengerEmail?: string
      requestFundAllocation?: boolean
      selectedServices?: VfsServiceChargeLine[]
      fundTotalAmount?: number
    }
  | { action: 'change_priority'; priority: string }
  | { action: 'update_status'; status: PassengerOperationalStatus }
  | {
      action: 'reassign'
      assigneeType: AssignmentAssigneeType
      team: string
      user: string
      vendor: string
      priority: string
      passengerPhone?: string
      passengerEmail?: string
      requestFundAllocation?: boolean
      selectedServices?: VfsServiceChargeLine[]
      fundTotalAmount?: number
    }
  | { action: 'add_notes'; notes: string }
  | { action: 'move_next_date' }
  | { action: 'upload_proof'; fileName: string }
  | { action: 'mark_complete' }
  | { action: 'escalate' }

type ModalAction = AssignmentAdminAction | DeskPassengerAction

interface AssignmentActionModalProps {
  open: boolean
  action: ModalAction | null
  record: OperationalPassengerRow | null
  onClose: () => void
  onConfirm: (payload: AssignmentActionPayload) => void
}

const ACTION_TITLES: Partial<Record<ModalAction, string>> = {
  assign_user: ASSIGN_USER_VENDOR_ACTION_LABEL,
  change_priority: 'Change priority',
  update_status: 'Update status',
  reassign: 'Reassign passenger',
  add_notes: 'Add operational notes',
  move_next_date: 'Move to next operational date',
  upload_proof: 'Upload operational proof',
  mark_complete: 'Mark operational completion',
  escalate: 'Escalate issue',
}

const TEAM_OPTIONS = ASSIGNMENT_CITY_TEAMS.map(t => ({ value: t, label: t }))

const EXECUTIVE_OPTIONS = [
  { value: 'Sneha Patel', label: 'Sneha Patel' },
  { value: 'Arun Krishnan', label: 'Arun Krishnan' },
  { value: 'Karan Mehta', label: 'Karan Mehta' },
  { value: 'Rajan Mehta', label: 'Rajan Mehta' },
]

function inferAssigneeType(record: OperationalPassengerRow): AssignmentAssigneeType {
  if (record.assigneeType) return record.assigneeType
  if (record.assignedVendor) return 'vendor'
  if (!record.assignedTeam && record.assignedUser) return 'vendor'
  return 'user'
}

export function AssignmentActionModal({
  open,
  action,
  record,
  onClose,
  onConfirm,
}: AssignmentActionModalProps) {
  const [assigneeType, setAssigneeType] = useState<AssignmentAssigneeType>('user')
  const [priority, setPriority] = useState('Medium')
  const [team, setTeam] = useState('Mumbai Team')
  const [user, setUser] = useState('')
  const [vendor, setVendor] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [passengerEmail, setPassengerEmail] = useState('')
  const [status, setStatus] = useState<PassengerOperationalStatus>('In Progress')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState('')
  const [requestFundAllocation, setRequestFundAllocation] = useState(false)
  const [serviceSearch, setServiceSearch] = useState('')
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])

  const vendorOptions = useMemo(
    () =>
      vendorService.list({ status: 'active' }).map(row => ({
        value: row.vendorName,
        label: row.vendorName,
      })),
    [],
  )

  const catalogServices = useMemo(() => {
    if (!record) return [] as VfsPickerService[]
    const offeringContext = resolveFundAllocationOfferingContext(
      record.country,
      record.visaType,
      record.jurisdiction,
    )
    return resolveVfsPickerServices({
      country: record.country,
      visaType: record.visaType,
      ...offeringContext,
    })
  }, [record])

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase()
    if (!query) return catalogServices
    return catalogServices.filter(service => service.serviceName.toLowerCase().includes(query))
  }, [catalogServices, serviceSearch])

  const selectedServices = useMemo(
    () => catalogServices.filter(service => selectedServiceIds.includes(service.id)),
    [catalogServices, selectedServiceIds],
  )

  const fundTotalAmount = useMemo(
    () => sumVfsPickerServiceAmounts(selectedServices),
    [selectedServices],
  )

  useEffect(() => {
    if (!record || !open) return
    const nextAssigneeType = inferAssigneeType(record)
    setAssigneeType(nextAssigneeType)
    setPriority(record.priority)
    setTeam(record.assignedTeam || 'Mumbai Team')
    setUser(record.assignedUser || '')
    setVendor(record.assignedVendor || (nextAssigneeType === 'vendor' ? record.assignedUser : ''))
    setPassengerPhone(record.passengerPhone === '—' ? '' : record.passengerPhone)
    setPassengerEmail(record.passengerEmail === '—' ? '' : record.passengerEmail)
    setStatus(record.passengerStatus)
    setNotes('')
    setFileName('')
    setRequestFundAllocation(false)
    setServiceSearch('')
    setSelectedServiceIds([])

    const offeringContext = resolveFundAllocationOfferingContext(
      record.country,
      record.visaType,
      record.jurisdiction,
    )
    const catalog = resolveVfsPickerServices({
      country: record.country,
      visaType: record.visaType,
      ...offeringContext,
    })

    const existing =
      fundAllocationService.getById(record.id) ??
      fundAllocationService
        .listByApplicationId(record.gltsApplicationId)
        .find(row => row.id === record.id)

    if (existing?.fundRequested && existing.selectedServices.length > 0) {
      setRequestFundAllocation(true)
      const ids = catalog
        .filter(service =>
          existing.selectedServices.some(
            line =>
              line.embassyFeeServiceId === service.id ||
              line.embassyFeeServiceId === service.embassyFeeServiceId ||
              line.serviceName.trim().toLowerCase() === service.serviceName.trim().toLowerCase(),
          ),
        )
        .map(service => service.id)
      setSelectedServiceIds(ids)
    }
  }, [record, action, open])

  if (!action || !record) return null

  const title = ACTION_TITLES[action] ?? 'Update record'
  const subtitle = `${record.passengerName} · ${record.gltsApplicationId}`
  const isAssigneeAction = action === 'assign_user' || action === 'reassign'
  const canConfirmAssignee =
    assigneeType === 'vendor'
      ? Boolean(vendor.trim() && user.trim())
      : assigneeType === 'passenger'
        ? Boolean(user.trim() && passengerPhone.trim() && passengerEmail.trim())
        : Boolean(user.trim())
  const canConfirmFundRequest =
    !requestFundAllocation || (selectedServices.length > 0 && fundTotalAmount > 0)
  const canConfirm = isAssigneeAction
    ? canConfirmAssignee && canConfirmFundRequest
    : true

  const handleConfirm = () => {
    const passengerContact =
      assigneeType === 'passenger'
        ? { passengerPhone: passengerPhone.trim(), passengerEmail: passengerEmail.trim() }
        : {}

    const fundRequestFields =
      isAssigneeAction && requestFundAllocation
        ? {
            requestFundAllocation: true as const,
            selectedServices: mapVfsPickerServicesToChargeLines(selectedServices),
            fundTotalAmount,
          }
        : isAssigneeAction
          ? { requestFundAllocation: false as const }
          : {}

    switch (action) {
      case 'assign_user':
        onConfirm({ action, assigneeType, team, user, vendor, priority, ...passengerContact, ...fundRequestFields })
        break
      case 'change_priority':
        onConfirm({ action, priority })
        break
      case 'update_status':
        onConfirm({ action, status })
        break
      case 'reassign':
        onConfirm({
          action: 'reassign',
          assigneeType,
          team,
          user,
          vendor,
          priority,
          ...passengerContact,
          ...fundRequestFields,
        })
        break
      case 'add_notes':
        onConfirm({ action, notes })
        break
      case 'move_next_date':
        onConfirm({ action: 'move_next_date' })
        break
      case 'upload_proof':
        onConfirm({ action, fileName: fileName.trim() || 'operational-proof.pdf' })
        break
      case 'mark_complete':
        onConfirm({ action: 'mark_complete' })
        break
      case 'escalate':
        onConfirm({ action: 'escalate' })
        break
    }
  }

  const needsForm =
    action === 'assign_user' ||
    action === 'change_priority' ||
    action === 'update_status' ||
    action === 'reassign' ||
    action === 'add_notes' ||
    action === 'upload_proof'

  const showTeamUserFields =
    assigneeType === 'user' || assigneeType === 'vendor' || assigneeType === 'passenger'

  const toggleService = (serviceId: string, checked: boolean) => {
    setSelectedServiceIds(current =>
      checked ? [...new Set([...current, serviceId])] : current.filter(id => id !== serviceId),
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size={isAssigneeAction ? 'md' : 'sm'}
      footer={
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ width: '100%' }}
        >
          {isAssigneeAction && requestFundAllocation ? (
            <Stack spacing={0.25}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
                Selected services: {selectedServices.length}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
                Total value: {fundTotalAmount > 0 ? formatInr(fundTotalAmount) : '—'}
              </Typography>
            </Stack>
          ) : (
            <Box />
          )}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={onClose} />
            <Button label="Confirm" onClick={handleConfirm} disabled={!canConfirm} />
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={1.5} sx={{ pt: 0.5 }}>
        {isAssigneeAction ? (
          <>
            <AssignmentAssigneeTypeToggle value={assigneeType} onChange={setAssigneeType} />

            {assigneeType === 'passenger' ? (
              <>
                <FormField label="Phone number">
                  <Input
                    value={passengerPhone}
                    onChange={setPassengerPhone}
                    placeholder="Enter phone number"
                    size="sm"
                  />
                </FormField>
                <FormField label="Email address">
                  <Input
                    value={passengerEmail}
                    onChange={setPassengerEmail}
                    placeholder="Enter email address"
                    size="sm"
                  />
                </FormField>
              </>
            ) : null}

            {assigneeType === 'vendor' ? (
              <FormField label="Vendor">
                <Select
                  value={vendor}
                  onChange={v => setVendor(String(v))}
                  options={vendorOptions}
                  placeholder="Select vendor"
                  size="sm"
                  fullWidth
                />
              </FormField>
            ) : null}

            {showTeamUserFields ? (
              <>
                <FormField label="Team">
                  <Select value={team} onChange={v => setTeam(String(v))} options={TEAM_OPTIONS} size="sm" fullWidth />
                </FormField>
                <FormField label="User">
                  <Select
                    value={user}
                    onChange={v => setUser(String(v))}
                    options={EXECUTIVE_OPTIONS}
                    placeholder="Select user"
                    size="sm"
                    fullWidth
                  />
                </FormField>
              </>
            ) : null}

            <FormField label="Priority">
              <Select
                value={priority}
                onChange={v => setPriority(String(v))}
                options={ASSIGNMENT_PRIORITY_OPTIONS}
                size="sm"
                fullWidth
              />
            </FormField>

            <Divider />

            <Stack spacing={1}>
              <Checkbox
                checked={requestFundAllocation}
                onChange={checked => setRequestFundAllocation(checked)}
                label="Request fund allocation"
                size="sm"
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                Select VFS services and send a fund request to Finance. Allocated card and amount will appear in Ground
                Operations.
              </Typography>
            </Stack>

            {requestFundAllocation ? (
              <>
                <Stack spacing={1}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}>
                    VFS services
                  </Typography>
                  <Input
                    value={serviceSearch}
                    onChange={setServiceSearch}
                    placeholder="Search by service name..."
                    size="sm"
                    fullWidth
                    startAdornment={<Search size={16} />}
                  />
                </Stack>

                <Box sx={vfsServicePickerListSx}>
                  {filteredServices.length === 0 ? (
                    <Box sx={vfsServicePickerEmptyStateSx}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: vfsServicePickerLayout.bodyFontSize }}
                      >
                        {catalogServices.length === 0
                          ? 'No VFS services are configured for this country and visa type in country master.'
                          : 'No services match your search.'}
                      </Typography>
                    </Box>
                  ) : (
                    <Stack divider={<Divider />}>
                      {filteredServices.map((service: VfsPickerService) => (
                        <Stack
                          key={service.id}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={vfsServicePickerServiceRowSx}
                        >
                          <Checkbox
                            checked={selectedServiceIds.includes(service.id)}
                            onChange={checked => toggleService(service.id, checked)}
                            size="sm"
                          />
                          <Typography variant="body2" sx={{ flex: 1, fontSize: vfsServicePickerLayout.bodyFontSize }}>
                            {service.serviceName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: vfsServicePickerLayout.bodyFontSize,
                              fontVariantNumeric: 'tabular-nums',
                              fontWeight: 600,
                            }}
                          >
                            {formatInr(service.amount)}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Box>

                <FormField label="Total value">
                  <Input value={fundTotalAmount > 0 ? formatInr(fundTotalAmount) : '—'} disabled size="sm" />
                </FormField>
              </>
            ) : null}
          </>
        ) : null}
        {action === 'change_priority' ? (
          <FormField label="Priority">
            <Select
              value={priority}
              onChange={v => setPriority(String(v))}
              options={ASSIGNMENT_PRIORITY_OPTIONS}
              size="sm"
              fullWidth
            />
          </FormField>
        ) : null}
        {action === 'update_status' ? (
          <FormField label="Operational status">
            <Select
              value={status}
              onChange={v => setStatus(String(v) as PassengerOperationalStatus)}
              options={PASSENGER_STATUS_OPTIONS}
              size="sm"
              fullWidth
            />
          </FormField>
        ) : null}
        {action === 'add_notes' ? (
          <FormField label="Operational remarks">
            <Textarea value={notes} onChange={setNotes} rows={4} placeholder="Add operational note…" />
          </FormField>
        ) : null}
        {action === 'upload_proof' ? (
          <FormField label="Document name" helperText="Mock upload — file name will be stored on the record.">
            <Input value={fileName} onChange={setFileName} placeholder="e.g. vfs-receipt.pdf" size="sm" />
          </FormField>
        ) : null}
        {!needsForm && action !== 'mark_complete' && action !== 'escalate' ? (
          <Stack spacing={0.5}>
            This will move the passenger to the next operational date and mark as carry forward.
          </Stack>
        ) : null}
        {action === 'mark_complete' ? (
          <Stack spacing={0.5}>Mark this passenger operational work as completed.</Stack>
        ) : null}
        {action === 'escalate' ? (
          <Stack spacing={0.5}>Escalate to urgent priority and flag for supervisor visibility.</Stack>
        ) : null}
      </Stack>
    </Modal>
  )
}
