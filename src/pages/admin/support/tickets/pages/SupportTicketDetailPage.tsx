import { useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BaseCard, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicketStatus } from '@/shared/types/supportTicket'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { AssignTicketModal } from '../components/AssignTicketModal'
import { ConversationTab } from '../components/detail/ConversationTab'
import { OverviewTab } from '../components/detail/OverviewTab'
import { SupportTicketDetailSummary } from '../components/SupportTicketDetailSummary'
import { UpdateStatusModal } from '../components/UpdateStatusModal'
import { useSupportTicketDetailState } from '../hooks/useSupportTicketDetailState'

const TICKET_LISTING_PATH = '/admin/support/tickets'
const ADMIN_ACTOR = 'Support Admin'

export function SupportTicketDetailPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const listingHref = getListingReturnHref(location, TICKET_LISTING_PATH)
  const { ticketId } = useParams<{ ticketId: string }>()
  const { loading, ticket, reload } = useSupportTicketDetailState(ticketId)

  const initialTab = searchParams.get('tab') === 'conversation' ? 'conversation' : 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [assignOpen, setAssignOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [assignee, setAssignee] = useState('')
  const [statusValue, setStatusValue] = useState<SupportTicketStatus>('assigned')

  const tabs = useMemo(
    () => [
      { label: 'Overview', value: 'overview' },
      {
        label: 'Conversation',
        value: 'conversation',
        badge: ticket?.conversation.filter((e) => e.type === 'message').length ?? 0,
      },
    ],
    [ticket],
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!ticket) {
    return (
      <EmptyState
        variant="no-data"
        title="Ticket not found"
        description="This support ticket may have been removed or the link is incorrect."
        action={{
          label: 'Back to tickets',
          onClick: () => navigate(listingHref),
        }}
      />
    )
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Support tickets', href: listingHref },
          { label: ticket.ticketNumber },
        ]}
        summary={
          <SupportTicketDetailSummary
            ticket={ticket}
            onAssign={() => {
              setAssignee(ticket.assignedExecutive ?? '')
              setAssignOpen(true)
            }}
            onUpdateStatus={() => {
              const allowed = supportTicketService.getAllowedStatusTransitions(ticket.status)
              setStatusValue(allowed[0] ?? ticket.status)
              setStatusOpen(true)
            }}
            onResolve={() => {
              supportTicketService.resolve(
                ticket.id,
                'Your request has been resolved. Please confirm if this closes your issue.',
                ADMIN_ACTOR,
              )
              reload()
              setActiveTab('conversation')
              showToast({
                title: 'Ticket resolved',
                description: 'Customer can confirm or reopen from the portal.',
                variant: 'success',
              })
            }}
            onFocusConversation={() => {
              setActiveTab('conversation')
              setSearchParams({ tab: 'conversation' }, { replace: true })
            }}
          />
        }
      >
        <BaseCard sx={{ p: 0, overflow: 'hidden' }}>
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={(value) => {
              setActiveTab(value)
              if (value === 'conversation') {
                setSearchParams({ tab: 'conversation' }, { replace: true })
              } else {
                setSearchParams({}, { replace: true })
              }
            }}
            variant="underline"
            size="sm"
          />
          <Box sx={{ p: 2 }}>
            {activeTab === 'overview' ? <OverviewTab ticket={ticket} /> : null}
            {activeTab === 'conversation' ? (
              <ConversationTab
                ticket={ticket}
                onReply={(message) => {
                  supportTicketService.addReply(ticket.id, {
                    message,
                    sender: 'support',
                    authorName: ticket.assignedExecutive || ADMIN_ACTOR,
                  })
                  reload()
                  showToast({ title: 'Reply sent', variant: 'success' })
                }}
                onAskCustomer={(message) => {
                  supportTicketService.setWaitingForCustomer(
                    ticket.id,
                    message,
                    ticket.assignedExecutive || ADMIN_ACTOR,
                  )
                  reload()
                  showToast({
                    title: 'Waiting for customer',
                    description: 'Ticket marked waiting for customer response.',
                    variant: 'success',
                  })
                }}
              />
            ) : null}
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <AssignTicketModal
        open={assignOpen}
        value={assignee}
        onClose={() => setAssignOpen(false)}
        onChange={setAssignee}
        onSubmit={() => {
          if (!assignee.trim()) return
          supportTicketService.assign(ticket.id, assignee.trim())
          setAssignOpen(false)
          reload()
          showToast({ title: 'Ticket assigned', variant: 'success' })
        }}
      />

      <UpdateStatusModal
        open={statusOpen}
        currentStatus={ticket.status}
        value={statusValue}
        onClose={() => setStatusOpen(false)}
        onChange={setStatusValue}
        onSubmit={() => {
          supportTicketService.updateStatus(ticket.id, statusValue)
          setStatusOpen(false)
          reload()
          showToast({ title: 'Status updated', variant: 'success' })
        }}
      />
    </>
  )
}
