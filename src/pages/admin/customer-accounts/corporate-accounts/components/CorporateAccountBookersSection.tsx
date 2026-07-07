import { useState } from 'react'
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import type { BookerUser } from '@/shared/types/bookerUser'
import { agreementEmbeddedTableSx } from '../../agreements/components/agreementFormLayout'
import { CorporateAccountBookerDrawer } from './CorporateAccountBookerDrawer'

interface CorporateAccountBookersSectionProps {
  data: CorporateAccountFormData
  corporateAccountId?: string
  onChange: (next: CorporateAccountFormData) => void
}

export function CorporateAccountBookersSection({
  data,
  corporateAccountId,
  onChange,
}: CorporateAccountBookersSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editBooker, setEditBooker] = useState<BookerUser>()

  const bookers = data.bookerIds.map((id) => bookerManagementService.getById(id)).filter(Boolean) as BookerUser[]

  const openCreate = () => {
    setEditBooker(undefined)
    setDrawerOpen(true)
  }

  const handleSaved = (record: BookerUser) => {
    if (!data.bookerIds.includes(record.id)) {
      onChange({ ...data, bookerIds: [...data.bookerIds, record.id] })
      if (corporateAccountId) corporateAccountService.addBookerId(corporateAccountId, record.id)
    }
  }

  return (
    <>
      <AdminOverlayFormSection
        title="Bookers"
        description="Add portal bookers who can create and manage visa applications for this corporate account."
        columns={1}
        fieldColumnsFrom="xs"
        headerAction={
          <Button label="Add booker" size="sm" startIcon={<Plus size={14} />} onClick={openCreate} />
        }
      >
        <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>
          <Box sx={agreementEmbeddedTableSx}>
            {bookers.length === 0 ? (
              <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  No bookers added yet. Bookers can submit applications on behalf of this corporate account.
                </Typography>
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookers.map((booker) => (
                    <TableRow key={booker.id}>
                      <TableCell>{booker.fullName}</TableCell>
                      <TableCell>{booker.email}</TableCell>
                      <TableCell>{booker.mobile || '—'}</TableCell>
                      <TableCell>
                        <Badge
                          label={booker.status === 'active' ? 'Active' : 'Inactive'}
                          color={booker.status === 'active' ? 'success' : 'neutral'}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditBooker(booker)
                            setDrawerOpen(true)
                          }}
                        >
                          <Pencil size={14} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            onChange({ ...data, bookerIds: data.bookerIds.filter((id) => id !== booker.id) })
                          }
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Box>
      </AdminOverlayFormSection>

      <CorporateAccountBookerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        corporateAccountId={corporateAccountId}
        companyName={data.companyName}
        initial={editBooker}
        onSaved={handleSaved}
      />
    </>
  )
}
