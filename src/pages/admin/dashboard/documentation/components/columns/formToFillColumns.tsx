import { RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { FormToFillRow } from '../../data/documentationDashboardMock'

export interface FormToFillColumnHandlers {
  onOpen: (row: FormToFillRow) => void
}

export function buildFormToFillColumns({
  onOpen,
}: FormToFillColumnHandlers): Column<FormToFillRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'visaType', label: 'Visa Type', widthSize: adminListingColumnWidthSize('service') },
    { key: 'formStatus', label: 'Form Status', widthSize: adminListingColumnWidthSize('status') },
    { key: 'dueTime', label: 'Due Time', widthSize: adminListingColumnWidthSize('sla') },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions row={row} actions={[{ label: 'Open', onClick: () => onOpen(row) }]} />
      ),
    },
  ]
}
