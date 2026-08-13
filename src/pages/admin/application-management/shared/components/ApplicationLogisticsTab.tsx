import { useMemo, useState } from 'react'
import { Link, Stack, Typography } from '@mui/material'
import {
  Badge,
  BaseCard,
  Button,
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  Modal,
  Select,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import { applicationCaseActivityService } from '@/shared/services/applicationCaseActivityService'
import {
  APPLICATION_LOGISTICS_COURIER_PARTNERS,
  APPLICATION_LOGISTICS_DELIVERY_METHODS,
  APPLICATION_LOGISTICS_STATUS_OPTIONS,
  type ApplicationLogisticsStatus,
  type ApplicationLogisticsUpdate,
  type ApplicationLogisticsUpdateInput,
} from '@/shared/types/applicationCaseActivity'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

interface ApplicationLogisticsTabProps {
  applicationId: string
  readOnly?: boolean
}

type ModalMode = 'add' | 'edit'

function emptyForm(): ApplicationLogisticsUpdateInput {
  return {
    status: 'Pending collection',
    deliveryMethod: '',
    courierPartner: '',
    awbNumber: '',
    trackingUrl: '',
    dispatchDateTime: '',
    remarks: '',
  }
}

function toForm(update: ApplicationLogisticsUpdate): ApplicationLogisticsUpdateInput {
  return {
    status: update.status,
    deliveryMethod: update.deliveryMethod,
    courierPartner: update.courierPartner,
    awbNumber: update.awbNumber,
    trackingUrl: update.trackingUrl,
    dispatchDateTime: update.dispatchDateTime,
    remarks: update.remarks,
  }
}

function statusBadgeColor(
  status: ApplicationLogisticsStatus,
): 'neutral' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'Delivered':
      return 'success'
    case 'In transit':
      return 'info'
    case 'Collected':
      return 'warning'
    case 'On hold':
      return 'error'
    case 'Pending collection':
    default:
      return 'neutral'
  }
}

function isEditableLogisticsUpdate(update: ApplicationLogisticsUpdate): boolean {
  return update.source === 'application_management'
}

export function ApplicationLogisticsTab({
  applicationId,
  readOnly = false,
}: ApplicationLogisticsTabProps) {
  const { showToast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('add')
  const [editingUpdate, setEditingUpdate] = useState<ApplicationLogisticsUpdate | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApplicationLogisticsUpdate | null>(null)
  const [form, setForm] = useState<ApplicationLogisticsUpdateInput>(emptyForm)

  const updates = useMemo(() => {
    void refreshKey
    return applicationCaseActivityService.listLogisticsUpdates(applicationId)
  }, [applicationId, refreshKey])

  const latest = updates[0]
  const nextSequence = (latest?.sequence ?? 0) + 1

  const deliveryOptions = APPLICATION_LOGISTICS_DELIVERY_METHODS.map(value => ({
    value,
    label: value,
  }))
  const courierOptions = APPLICATION_LOGISTICS_COURIER_PARTNERS.map(value => ({
    value,
    label: value,
  }))

  const openAddUpdateModal = () => {
    setModalMode('add')
    setEditingUpdate(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  const openEditUpdateModal = (update: ApplicationLogisticsUpdate) => {
    if (!isEditableLogisticsUpdate(update)) return
    setModalMode('edit')
    setEditingUpdate(update)
    setForm(toForm(update))
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingUpdate(null)
    setForm(emptyForm())
  }

  const handleSave = () => {
    if (!form.deliveryMethod.trim()) {
      showToast({
        title: 'Missing delivery method',
        description: 'Select how the passport/documents will move.',
        variant: 'error',
      })
      return
    }

    if (modalMode === 'edit' && editingUpdate) {
      const saved = applicationCaseActivityService.updateLogisticsUpdate(
        applicationId,
        editingUpdate.id,
        form,
      )
      if (!saved) {
        showToast({
          title: 'Cannot edit',
          description: 'Ground Ops logistics entries are read-only here.',
          variant: 'error',
        })
        return
      }
      setRefreshKey(key => key + 1)
      closeModal()
      showToast({
        title: `Logistics update #${saved.sequence} updated`,
        description: `${saved.status} · ${saved.deliveryMethod}`,
        variant: 'success',
      })
      return
    }

    const saved = applicationCaseActivityService.addLogisticsUpdate(applicationId, form)
    setRefreshKey(key => key + 1)
    closeModal()
    showToast({
      title: `Logistics update #${saved.sequence} added`,
      description: `${saved.status} · ${saved.deliveryMethod}`,
      variant: 'success',
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    const ok = applicationCaseActivityService.deleteLogisticsUpdate(applicationId, deleteTarget.id)
    setDeleteTarget(null)
    if (!ok) {
      showToast({
        title: 'Cannot delete',
        description: 'Ground Ops logistics entries are read-only here.',
        variant: 'error',
      })
      return
    }
    setRefreshKey(key => key + 1)
    showToast({
      title: `Logistics update #${deleteTarget.sequence} deleted`,
      variant: 'success',
    })
  }

  if (!applicationId.trim()) {
    return <EmptyState title="No application selected" description="Open a case to manage logistics." />
  }

  const modalTitle = modalMode === 'edit' ? 'Edit delivery update' : 'Add delivery update'
  const modalSubtitle =
    modalMode === 'edit' && editingUpdate
      ? `Update #${editingUpdate.sequence} · ${applicationId}`
      : `Update #${nextSequence} · ${applicationId}`

  return (
    <>
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0, width: '100%', overflow: 'auto' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={1}
        >
          <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Logistics</Typography>
              {latest ? (
                <Badge label={latest.status} color={statusBadgeColor(latest.status)} size="sm" />
              ) : null}
            </Stack>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Ground Ops entries are view-only. Updates added here can be edited or deleted.
            </Typography>
          </Stack>
          {!readOnly ? (
            <Button
              label="Add logistics entry"
              variant="outlined"
              onClick={openAddUpdateModal}
              sx={{ flexShrink: 0 }}
            />
          ) : null}
        </Stack>

        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
          Update history
        </Typography>

        {updates.length === 0 ? (
          <EmptyState
            title="No logistics updates yet"
            description="Add a courier / dispatch update to start the history."
          />
        ) : (
          <Stack spacing={1.25}>
            {updates.map(update => {
              const canManage = !readOnly && isEditableLogisticsUpdate(update)
              return (
                <BaseCard key={update.id} sx={{ p: 1.5 }}>
                  <Stack spacing={0.75}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: 'wrap' }}
                    >
                      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                          Update #{update.sequence}
                        </Typography>
                        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                          <Badge
                            label={update.status}
                            color={statusBadgeColor(update.status)}
                            size="sm"
                          />
                          <Badge
                            label={
                              update.source === 'ground_operations'
                                ? 'From Ground Ops'
                                : 'Added here'
                            }
                            color={update.source === 'ground_operations' ? 'info' : 'neutral'}
                            size="sm"
                          />
                        </Stack>
                      </Stack>
                      {canManage ? (
                        <Stack direction="row" spacing={0.75}>
                          <Button
                            label="Edit"
                            size="sm"
                            variant="neutral"
                            onClick={() => openEditUpdateModal(update)}
                          />
                          <Button
                            label="Delete"
                            size="sm"
                            variant="neutral"
                            color="error"
                            onClick={() => setDeleteTarget(update)}
                          />
                        </Stack>
                      ) : null}
                    </Stack>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {update.createdBy} · {formatDisplayDateTime(update.createdAt)}
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      {[
                        update.deliveryMethod,
                        update.courierPartner,
                        update.awbNumber ? `AWB ${update.awbNumber}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </Typography>
                    {update.trackingUrl ? (
                      <Link
                        href={update.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontSize: 12 }}
                      >
                        Open tracking link
                      </Link>
                    ) : null}
                    {update.remarks?.trim() ? (
                      <Typography
                        sx={{ fontSize: 12, color: 'text.secondary', wordBreak: 'break-word' }}
                      >
                        {update.remarks}
                      </Typography>
                    ) : null}
                    {update.source === 'ground_operations' ? (
                      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                        Synced from Tracking & Logistics — view only.
                      </Typography>
                    ) : null}
                  </Stack>
                </BaseCard>
              )
            })}
          </Stack>
        )}
      </Stack>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        subtitle={modalSubtitle}
        size="md"
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={closeModal} />
            <Button
              label={modalMode === 'edit' ? 'Save changes' : 'Save update'}
              onClick={handleSave}
            />
          </Stack>
        }
      >
        <Stack spacing={1.5} sx={{ pt: 0.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <FormField label="Status" required sx={{ flex: 1 }}>
              <Select
                size="sm"
                fullWidth
                value={form.status}
                onChange={value =>
                  setForm(prev => ({ ...prev, status: String(value) as ApplicationLogisticsStatus }))
                }
                options={APPLICATION_LOGISTICS_STATUS_OPTIONS}
              />
            </FormField>
            <FormField label="Delivery method" required sx={{ flex: 1 }}>
              <Select
                size="sm"
                fullWidth
                value={form.deliveryMethod}
                onChange={value => setForm(prev => ({ ...prev, deliveryMethod: String(value) }))}
                options={deliveryOptions}
                placeholder="Select delivery method"
              />
            </FormField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <FormField label="Courier partner" sx={{ flex: 1 }}>
              <Select
                size="sm"
                fullWidth
                value={form.courierPartner}
                onChange={value => setForm(prev => ({ ...prev, courierPartner: String(value) }))}
                options={courierOptions}
                placeholder="Select courier"
              />
            </FormField>
            <FormField label="AWB / tracking no." sx={{ flex: 1 }}>
              <Input
                size="sm"
                fullWidth
                value={form.awbNumber}
                onChange={value => setForm(prev => ({ ...prev, awbNumber: value }))}
                placeholder="Enter AWB"
              />
            </FormField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <FormField label="Dispatch date / time" sx={{ flex: 1 }}>
              <Input
                size="sm"
                fullWidth
                type="datetime-local"
                value={form.dispatchDateTime}
                onChange={value => setForm(prev => ({ ...prev, dispatchDateTime: value }))}
              />
            </FormField>
            <FormField label="Tracking URL" sx={{ flex: 1 }}>
              <Input
                size="sm"
                fullWidth
                value={form.trackingUrl}
                onChange={value => setForm(prev => ({ ...prev, trackingUrl: value }))}
                placeholder="https://"
              />
            </FormField>
          </Stack>
          <FormField label="Remarks">
            <Textarea
              fullWidth
              minRows={2}
              value={form.remarks}
              onChange={value => setForm(prev => ({ ...prev, remarks: value }))}
              placeholder="Optional notes for this update"
            />
          </FormField>
        </Stack>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete logistics update?"
        description={
          deleteTarget
            ? `Update #${deleteTarget.sequence} will be removed from this application. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </>
  )
}
