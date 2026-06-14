import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, FormField, Input } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { agreementEmbeddedTableSx } from '../../agreements/components/agreementFormLayout'

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
    <AdminOverlayFormSection
      title="Additional admins"
      description="Optional administrators with scoped portal access."
      columns={1}
      fieldColumnsFrom="xs"
      headerAction={
        <Button label="Add admin" size="sm" startIcon={<Plus size={14} />} onClick={addAdmin} />
      }
    >
      <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>
        {data.admins.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No additional admins added. Super admin is configured in the previous step.
          </Typography>
        ) : (
          <Box sx={agreementEmbeddedTableSx}>
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
          </Box>
        )}
      </Box>
    </AdminOverlayFormSection>
  )
}
