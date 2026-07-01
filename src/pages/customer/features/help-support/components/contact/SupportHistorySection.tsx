import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { MessageSquare, Search, User } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/design-system/UIComponents'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_SUPPORT_CATEGORIES } from '../../data/portalSupportCategories'
import {
  getSupportTicketStatusTone,
  SUPPORT_TICKET_DATE_RANGE_OPTIONS,
  SUPPORT_TICKET_STATUS_FILTER_OPTIONS,
  SUPPORT_TICKET_STATUS_LABELS,
} from '../../config/supportTicketStatusConfig'
import type { SupportTicketsApi } from '../../hooks/useSupportTickets'
import type { SupportTicket } from '../../types/supportTicket'

interface SupportHistorySectionProps {
  ticketsApi: SupportTicketsApi
  onViewConversation: (ticketId: string) => void
}

function formatTicketDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getCategoryLabel(categoryId: string) {
  return PORTAL_SUPPORT_CATEGORIES.find(c => c.id === categoryId)?.name ?? categoryId
}

function matchesDateRange(updatedAt: string, range: string): boolean {
  if (range === 'all') return true
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return new Date(updatedAt) >= cutoff
}

export function SupportHistorySection({ ticketsApi, onViewConversation }: SupportHistorySectionProps) {
  const colors = usePublicBrandColors()
  const { tickets } = ticketsApi

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tickets.filter(ticket => {
      if (status !== 'all' && ticket.status !== status) return false
      if (category !== 'all' && ticket.category !== category) return false
      if (!matchesDateRange(ticket.updatedAt, dateRange)) return false
      if (!query) return true
      return (
        ticket.ticketNumber.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.subCategory.toLowerCase().includes(query) ||
        getCategoryLabel(ticket.category).toLowerCase().includes(query)
      )
    })
  }, [tickets, search, status, category, dateRange])

  const categoryFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'All categories' },
      ...PORTAL_SUPPORT_CATEGORIES.map(c => ({ value: c.id, label: c.name })),
    ],
    [],
  )

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 160px 180px 160px' },
          gap: 1.5,
          alignItems: 'end',
        }}
      >
        <FormField label="Search ticket">
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Ticket number, subject, or category..."
            startAdornment={<Search size={16} />}
          />
        </FormField>
        <FormField label="Status">
          <Select value={status} onChange={v => setStatus(String(v))} options={SUPPORT_TICKET_STATUS_FILTER_OPTIONS} />
        </FormField>
        <FormField label="Category">
          <Select value={category} onChange={v => setCategory(String(v))} options={categoryFilterOptions} />
        </FormField>
        <FormField label="Date range">
          <Select
            value={dateRange}
            onChange={v => setDateRange(String(v))}
            options={SUPPORT_TICKET_DATE_RANGE_OPTIONS}
          />
        </FormField>
      </Box>

      <Stack spacing={1.5}>
        {filteredTickets.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              border: `1px dashed ${colors.border}`,
              borderRadius: BORDER_RADIUS.lg,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
              No tickets match your filters
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.textSecondary }}>
              Try adjusting filters or raise a new support request.
            </Typography>
          </Box>
        ) : (
          filteredTickets.map(ticket => (
            <SupportTicketCard key={ticket.id} ticket={ticket} onViewConversation={onViewConversation} />
          ))
        )}
      </Stack>
    </Stack>
  )
}

function SupportTicketCard({
  ticket,
  onViewConversation,
}: {
  ticket: SupportTicket
  onViewConversation: (id: string) => void
}) {
  const colors = usePublicBrandColors()
  const statusTone = getSupportTicketStatusTone(ticket.status)

  return (
    <Box
      sx={{
        p: 2,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.white,
        boxShadow: publicShadows.card,
        transition: 'box-shadow 150ms, border-color 150ms, transform 150ms',
        '&:hover': {
          borderColor: 'rgba(59, 130, 246, 0.35)',
          boxShadow: '0 6px 20px rgba(15, 38, 92, 0.08)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{ mb: 0.75 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: colors.textMuted, letterSpacing: '0.02em' }}>
              {ticket.ticketNumber}
            </Typography>
            <CustomerStatusChip label={SUPPORT_TICKET_STATUS_LABELS[ticket.status]} tone={statusTone} />
          </Stack>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: colors.navy, lineHeight: 1.35 }}>
            {ticket.subject}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1.25 }}>
            <MetaItem label="Category" value={getCategoryLabel(ticket.category)} />
            {ticket.subCategory ? <MetaItem label="Sub category" value={ticket.subCategory} /> : null}
            {ticket.assignedExecutive ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <User size={13} color={colors.textMuted} />
                <MetaItem label="Assigned" value={ticket.assignedExecutive} />
              </Stack>
            ) : null}
            <MetaItem label="Created" value={formatTicketDate(ticket.createdAt)} />
            <MetaItem label="Updated" value={formatTicketDate(ticket.updatedAt)} />
          </Stack>
        </Box>
        <Box sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', md: 'center' } }}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<MessageSquare size={14} />}
            onClick={() => onViewConversation(ticket.id)}
            fullWidth
          >
            View conversation
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  const colors = usePublicBrandColors()
  return (
    <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
      <Box component="span" sx={{ fontWeight: 700, color: colors.textMuted, mr: 0.5 }}>
        {label}:
      </Box>
      {value}
    </Typography>
  )
}
