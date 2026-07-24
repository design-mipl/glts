import { Box, Stack, Typography } from '@mui/material'
import { CalendarClock, Eye, PencilLine, RefreshCcw, UserCog } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions, Tooltip } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import {
  enquiryCustomerTypeColor,
  enquiryInquirySourceColor,
  formatEnquiryCustomerType,
  formatEnquiryInquirySource,
} from '../config/enquiryFormConfig'
import {
  formatEnquiryDate,
  getEnquiryContactDetails,
  getEnquiryVisaListingFields,
} from '../utils/enquiryListingUtils'
import {
  enquiryStatusColor,
  enquiryStatusLabel,
} from '../config/enquiryStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: EnquiryRecord) => void
  onOpenEdit: (row: EnquiryRecord) => void
  onOpenAssignment: (row: EnquiryRecord) => void
  onOpenStatus: (row: EnquiryRecord) => void
  onOpenFollowup: (row: EnquiryRecord) => void
}

function CountryRequirementsTooltipContent({ row }: { row: EnquiryRecord }) {
  const { items } = getEnquiryVisaListingFields(row)

  return (
    <Stack spacing={1} sx={{ py: 0.25 }}>
      {items.map((item, index) => {
        const country = item.country.trim() || '—'
        const visaType = item.visaType.trim() || '—'
        const purpose = item.purposeOfVisit.trim()
        return (
          <Box key={item.id || `${country}-${index}`}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.35 }}>
              {country}
              <Typography component="span" sx={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>
                {' · '}
                {visaType}
              </Typography>
            </Typography>
            {purpose ? (
              <Typography sx={{ fontSize: 11, opacity: 0.8, lineHeight: 1.35, mt: 0.25 }}>
                {purpose}
              </Typography>
            ) : null}
          </Box>
        )
      })}
    </Stack>
  )
}

function CountryRequirementsSummary({ row }: { row: EnquiryRecord }) {
  const { items, firstSummary, firstPurpose, remainingCount } = getEnquiryVisaListingFields(row)

  if (!items.length) {
    return (
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        —
      </Typography>
    )
  }

  const summary = (
    <Box
      sx={{
        minWidth: 0,
        cursor: 'default',
        '&:hover': { opacity: 0.9 },
      }}
    >
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{
          fontSize: 13,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {firstSummary}
      </Typography>
      {firstPurpose ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            fontSize: 11,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {firstPurpose}
        </Typography>
      ) : null}
      {remainingCount > 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
          +{remainingCount} more
        </Typography>
      ) : null}
    </Box>
  )

  return (
    <Tooltip
      content={<CountryRequirementsTooltipContent row={row} />}
      placement="top-start"
      maxWidth={320}
      delay={250}
    >
      {summary}
    </Tooltip>
  )
}

export function buildEnquiryColumns({
  onOpenDetail,
  onOpenEdit,
  onOpenAssignment,
  onOpenStatus,
  onOpenFollowup,
}: ColumnHandlers): Column<EnquiryRecord>[] {
  return [
    {
      key: 'id',
      label: 'Enquiry',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {row.id}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
            {formatEnquiryDate(row.enquiryDate)}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'companyOrCustomerName',
      label: 'Company / Customer',
      widthSize: adminListingColumnWidthSize('company'),
      searchable: true,
      render: (_, row) => row.customer.companyOrCustomerName,
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      widthSize: adminListingColumnWidthSize('country'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={formatEnquiryCustomerType(row.customer.customerType)}
          color={enquiryCustomerTypeColor[row.customer.customerType]}
          size="sm"
        />
      ),
    },
    {
      key: 'contactPerson',
      label: 'Contact person',
      widthSize: 'md',
      searchable: true,
      render: (_, row) => {
        const { phone, landline, email } = getEnquiryContactDetails(row.customer)
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              {row.customer.contactPersonName}
            </Typography>
            {phone ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
                {phone}
              </Typography>
            ) : null}
            {landline ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
                {landline}
              </Typography>
            ) : null}
            {email ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
                {email}
              </Typography>
            ) : null}
          </Box>
        )
      },
    },
    {
      key: 'inquirySource',
      label: 'Enquiry Source',
      widthSize: adminListingColumnWidthSize('country'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={formatEnquiryInquirySource(row.salesDetails.inquirySource)}
          color={enquiryInquirySourceColor[row.salesDetails.inquirySource]}
          size="sm"
        />
      ),
    },
    {
      key: 'countryRequirements',
      label: 'Country Requirements',
      widthSize: 'lg',
      render: (_, row) => <CountryRequirementsSummary row={row} />,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge label={enquiryStatusLabel[row.status]} color={enquiryStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'Open Detail', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit Enquiry', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
          { label: 'Assign Team', icon: <UserCog size={14} />, onClick: () => onOpenAssignment(row) },
          { label: 'Update Status', icon: <RefreshCcw size={14} />, onClick: () => onOpenStatus(row) },
          { label: 'Add Follow-up', icon: <CalendarClock size={14} />, onClick: () => onOpenFollowup(row) },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
