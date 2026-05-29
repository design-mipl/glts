import { IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, FormField, Input } from '@/design-system/UIComponents'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

interface CorporateAccountAdminsSectionProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
}

export function CorporateAccountAdminsSection({ data, onChange }: CorporateAccountAdminsSectionProps) {
  const addAdmin = () => {
    onChange({
      ...data,
      admins: [
        ...data.admins,
        { fullName: '', phoneNumber: '', emailAddress: '', role: 'admin' },
      ],
    })
  }

  const updateAdmin = (index: number, patch: Partial<CorporateAccountFormData['admins'][0]>) => {
    onChange({
      ...data,
      admins: data.admins.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    })
  }

  const removeAdmin = (index: number) => {
    onChange({ ...data, admins: data.admins.filter((_, i) => i !== index) })
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight={600}>
          Additional admins
        </Typography>
        <Button label="Add admin" size="sm" startIcon={<Plus size={14} />} onClick={addAdmin} />
      </Stack>

      {data.admins.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No additional admins added. Super admin is configured in the previous step.
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.admins.map((admin, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormField label="">
                    <Input value={admin.fullName} onChange={(v) => updateAdmin(index, { fullName: v })} fullWidth />
                  </FormField>
                </TableCell>
                <TableCell>
                  <Input value={admin.phoneNumber} onChange={(v) => updateAdmin(index, { phoneNumber: v })} fullWidth />
                </TableCell>
                <TableCell>
                  <Input value={admin.emailAddress} onChange={(v) => updateAdmin(index, { emailAddress: v })} fullWidth />
                </TableCell>
                <TableCell>Admin</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => removeAdmin(index)}>
                    <Trash2 size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  )
}
