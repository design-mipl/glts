import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, Checkbox, FormField, FormSection, Input, Modal, Select } from '@/design-system/UIComponents'
import type { AgreementFinanceContactPerson, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import {
  createEmptyManualFinanceContact,
  financeContactSourceTypeLabel,
  getFinanceContactSourceOptions,
  getFinanceContactSourceValue,
  isManualFinanceContact,
} from '@/shared/utils/agreementFinanceContacts'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '../agreementFormLayout'

interface AgreementFinanceContactsPanelProps {
  data: CommercialAgreementFormData
  contacts: AgreementFinanceContactPerson[]
  selectedContactIds?: string[]
  readOnly?: boolean
  onRefresh?: () => void
  onToggleContact?: (contactId: string, checked: boolean) => void
  onSaveManualContact?: (contact: AgreementFinanceContactPerson) => void
  onRemoveManualContact?: (contactId: string) => void
}

export function AgreementFinanceContactsPanel({
  data,
  contacts,
  selectedContactIds = [],
  readOnly = false,
  onRefresh,
  onToggleContact,
  onSaveManualContact,
  onRemoveManualContact,
}: AgreementFinanceContactsPanelProps) {
  const [editContact, setEditContact] = useState<AgreementFinanceContactPerson | null>(null)
  const selectedSet = new Set(selectedContactIds)
  const sourceOptions = useMemo(() => getFinanceContactSourceOptions(data), [data])
  const canManageManualContacts = !readOnly && Boolean(onSaveManualContact && onRemoveManualContact)

  const openCreate = () => {
    setEditContact(createEmptyManualFinanceContact(data))
  }

  const saveContact = () => {
    if (!editContact || !onSaveManualContact) return
    if (editContact.sourceType !== 'manual' && !editContact.sourceId) return
    onSaveManualContact({
      ...editContact,
      sourceLabel: editContact.sourceLabel.trim(),
      contactPerson: editContact.contactPerson.trim(),
      email: editContact.email.trim(),
      phone: editContact.phone.trim(),
    })
    setEditContact(null)
  }

  const handleSourceChange = (value: string) => {
    if (!editContact) return
    const selected = sourceOptions.find((option) => option.value === value)
    if (!selected) return
    setEditContact({
      ...editContact,
      sourceType: selected.sourceType,
      sourceId: selected.sourceId,
      sourceLabel: selected.sourceLabel,
    })
  }

  return (
    <Stack spacing={1.5}>
      {!readOnly ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 520 }}>
            Auto-filled from company, parent, and entity contacts. Add manually or refresh after edits.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            {canManageManualContacts ? (
              <Button label="Add contact person" size="sm" startIcon={<Plus size={14} />} onClick={openCreate} />
            ) : null}
            {onRefresh ? (
              <Button
                label="Refresh contacts"
                size="sm"
                variant="outlined"
                color="secondary"
                startIcon={<RefreshCw size={14} />}
                onClick={onRefresh}
              />
            ) : null}
          </Stack>
        </Stack>
      ) : null}

      <Box sx={agreementEmbeddedTableSx}>
        {contacts.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No finance contacts yet. Add company contact details, a parent company, entities with contact
              persons in earlier steps, or add a contact manually.
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                {!readOnly ? <TableCell sx={agreementEmbeddedTableHeadCellSx}>Use</TableCell> : null}
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Source</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Contact person</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Email</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Phone</TableCell>
                {canManageManualContacts ? (
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Actions
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  {!readOnly ? (
                    <TableCell sx={{ width: 56 }}>
                      <Checkbox
                        checked={selectedSet.has(contact.id)}
                        onChange={(checked) => onToggleContact?.(contact.id, checked)}
                        aria-label={`Use ${contact.sourceLabel} finance contact`}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ fontSize: 13 }}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                        {contact.sourceLabel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {financeContactSourceTypeLabel(contact.sourceType)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{contact.contactPerson || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{contact.email || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{contact.phone || '—'}</TableCell>
                  {canManageManualContacts ? (
                    <TableCell align="right">
                      {isManualFinanceContact(contact) ? (
                        <>
                          <IconButton
                            size="small"
                            aria-label="Edit finance contact"
                            onClick={() => setEditContact({ ...contact })}
                          >
                            <Pencil size={14} />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label="Delete finance contact"
                            onClick={() => onRemoveManualContact?.(contact.id)}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </>
                      ) : null}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      <Modal
        open={Boolean(editContact)}
        onClose={() => setEditContact(null)}
        title={
          editContact && contacts.some((contact) => contact.id === editContact.id)
            ? 'Edit finance contact'
            : 'Add finance contact'
        }
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={() => setEditContact(null)} />
            <Button
              label="Save"
              onClick={saveContact}
              disabled={!editContact || (editContact.sourceType !== 'manual' && !editContact.sourceId)}
            />
          </Stack>
        }
      >
        {editContact ? (
          <FormSection columns={1}>
            <FormField label="Source" required>
              <Select
                value={getFinanceContactSourceValue(editContact)}
                onChange={(value) => handleSourceChange(String(value))}
                options={[
                  { value: '', label: 'Select contact source' },
                  ...sourceOptions.map((option) => ({ value: option.value, label: option.label })),
                ]}
                placeholder="Select contact source"
                fullWidth
              />
            </FormField>
            <FormField label="Contact person" required>
              <Input
                value={editContact.contactPerson}
                onChange={(value) => setEditContact({ ...editContact, contactPerson: value })}
                placeholder="Enter contact person name"
                fullWidth
              />
            </FormField>
            <FormField label="Email address" required>
              <Input
                value={editContact.email}
                onChange={(value) => setEditContact({ ...editContact, email: value })}
                placeholder="Enter email address"
                fullWidth
              />
            </FormField>
            <FormField label="Phone number" required>
              <Input
                value={editContact.phone}
                onChange={(value) => setEditContact({ ...editContact, phone: value })}
                placeholder="Enter phone number"
                fullWidth
              />
            </FormField>
          </FormSection>
        ) : null}
      </Modal>
    </Stack>
  )
}
