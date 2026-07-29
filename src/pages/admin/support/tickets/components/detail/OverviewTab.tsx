import { Stack, Typography } from '@mui/material'
import type { SupportTicket } from '@/shared/types/supportTicket'
import { supportTicketService } from '@/shared/services/supportTicketService'
import { formatSupportTicketDate } from '../../utils/supportTicketListingUtils'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function OverviewTab({ ticket }: { ticket: SupportTicket }) {
  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', '& > *': { minWidth: { md: 180 }, flex: { md: '1 1 180px' } } }}
      >
        <Field label="Customer" value={ticket.customerName} />
        <Field label="Email" value={ticket.customerEmail} />
        <Field label="Company" value={ticket.companyName ?? ''} />
        <Field label="Portal" value={ticket.portal === 'business' ? 'Business' : 'Retail'} />
        <Field label="Category" value={supportTicketService.getCategoryLabel(ticket.category)} />
        <Field label="Subcategory" value={ticket.subCategory} />
        <Field label="Assignee" value={ticket.assignedExecutive ?? 'Unassigned'} />
        <Field label="Channel" value={ticket.communicationChannel} />
        <Field label="Related application" value={ticket.relatedApplication} />
        <Field label="Related invoice" value={ticket.relatedInvoice} />
        <Field label="Created" value={formatSupportTicketDate(ticket.createdAt)} />
        <Field label="Updated" value={formatSupportTicketDate(ticket.updatedAt)} />
      </Stack>

      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Description
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: ticket.description || '—' }}
        />
      </Stack>

      {ticket.rating != null ? (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Customer feedback
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Rating: {ticket.rating}/5
            {ticket.feedback ? ` — ${ticket.feedback}` : ''}
          </Typography>
        </Stack>
      ) : null}

      {ticket.internalNotes ? (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Internal notes
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
            {ticket.internalNotes}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  )
}
