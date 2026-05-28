import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Tabs, Badge, BaseCard, useToast } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { enquiryService } from '@/shared/services/enquiryService'
import {
  enquiryPriorityColor,
  enquiryPriorityLabel,
  enquiryStatusColor,
  enquiryStatusLabel,
} from '../config/enquiryStatusConfig'
import { AddFollowupModal, type FollowupModalValue } from '../components/AddFollowupModal'
import { AssignmentModal, type AssignmentModalValue } from '../components/AssignmentModal'
import { ConvertToQuotationDialog } from '../components/ConvertToQuotationDialog'
import { EnquiryQuickActions } from '../components/EnquiryQuickActions'
import { StatusUpdateModal } from '../components/StatusUpdateModal'
import { ActivityTimelineTab } from '../components/detail/ActivityTimelineTab'
import { AssignmentOwnershipTab } from '../components/detail/AssignmentOwnershipTab'
import { AttachmentsTab } from '../components/detail/AttachmentsTab'
import { FollowupsTab } from '../components/detail/FollowupsTab'
import { InternalNotesTab } from '../components/detail/InternalNotesTab'
import { OverviewTab } from '../components/detail/OverviewTab'
import { useEnquiryDetailState } from '../hooks/useEnquiryDetailState'

const initialAssignment: AssignmentModalValue = {
  assignedTeam: '',
  assignedUser: '',
  branch: '',
  priority: 'medium',
  slaTarget: '',
  assignmentNotes: '',
}

const initialFollowup: FollowupModalValue = {
  followupType: 'call',
  followupDate: '',
  followupTime: '10:00',
  discussionSummary: '',
  nextAction: '',
  assignedUser: '',
  reminderRequired: true,
  followupStatus: 'scheduled',
}

export function EnquiryDetailPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { enquiryId } = useParams<{ enquiryId: string }>()
  const { loading, enquiry, reload } = useEnquiryDetailState(enquiryId)

  const [activeTab, setActiveTab] = useState('overview')
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [convertModalOpen, setConvertModalOpen] = useState(false)

  const [statusValue, setStatusValue] = useState('under_discussion')
  const [statusReason, setStatusReason] = useState('')
  const [assignmentValue, setAssignmentValue] = useState(initialAssignment)
  const [followupValue, setFollowupValue] = useState(initialFollowup)
  const [conversionIssues, setConversionIssues] = useState<string[]>([])
  const [internalNotes, setInternalNotes] = useState('')

  const tabs = useMemo(
    () => [
      { label: 'Overview', value: 'overview' },
      { label: 'Follow-ups', value: 'followups', badge: enquiry?.followups.length ?? 0 },
      { label: 'Activity Timeline', value: 'activity', badge: enquiry?.activities.length ?? 0 },
      { label: 'Attachments', value: 'attachments', badge: enquiry?.attachments.length ?? 0 },
      { label: 'Internal Notes', value: 'notes' },
      { label: 'Assignment & Ownership', value: 'assignment' },
    ],
    [enquiry],
  )

  if (loading) {
    return <Typography variant="body2">Loading enquiry workspace...</Typography>
  }

  if (!enquiry) {
    return <Typography variant="body2">Enquiry not found.</Typography>
  }

  return (
    <Stack spacing={2}>
      <AdminPageHeader
        title={enquiry.customer.companyOrCustomerName}
        description={`${enquiry.id} · Assigned Team: ${enquiry.assignment.assignedTeam ?? '--'} · Assigned User: ${enquiry.assignment.assignedUser ?? '--'}`}
        breadcrumbs={[
          { label: 'Customer & Accounts', href: '/admin/customer-accounts/enquiries' },
          { label: 'Enquiry Management', href: '/admin/customer-accounts/enquiries' },
          { label: enquiry.id },
        ]}
        actions={<Button label="Back to listing" variant="outlined" onClick={() => navigate('/admin/customer-accounts/enquiries')} />}
      />

      <BaseCard sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Next Follow-up: {enquiry.nextFollowupDate ? new Date(enquiry.nextFollowupDate).toLocaleDateString() : '--'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Badge label={enquiryStatusLabel[enquiry.status]} color={enquiryStatusColor[enquiry.status]} />
              <Badge label={enquiryPriorityLabel[enquiry.salesDetails.priorityLevel]} color={enquiryPriorityColor[enquiry.salesDetails.priorityLevel]} />
            </Stack>
          </Stack>
          <EnquiryQuickActions
            onEdit={() => navigate(`/admin/customer-accounts/enquiries/new`)}
            onAssign={() => {
              setAssignmentValue({
                assignedTeam: enquiry.assignment.assignedTeam ?? '',
                assignedUser: enquiry.assignment.assignedUser ?? '',
                branch: enquiry.assignment.branch ?? '',
                priority: enquiry.assignment.priority,
                slaTarget: enquiry.assignment.slaTarget?.slice(0, 10) ?? '',
                assignmentNotes: enquiry.assignment.assignmentNotes ?? '',
              })
              setAssignmentModalOpen(true)
            }}
            onFollowup={() => setFollowupModalOpen(true)}
            onStatus={() => {
              setStatusValue(enquiry.status)
              setStatusReason('')
              setStatusModalOpen(true)
            }}
            onConvert={async () => {
              const validation = await enquiryService.validateConversion(enquiry.id)
              setConversionIssues(validation.issues)
              setConvertModalOpen(true)
            }}
            onNotes={() => setActiveTab('notes')}
          />
        </Stack>
      </BaseCard>

      <BaseCard sx={{ p: 0, overflow: 'hidden' }}>
        <Tabs items={tabs} value={activeTab} onChange={setActiveTab} />
        <Box sx={{ p: 2 }}>
          {activeTab === 'overview' ? <OverviewTab enquiry={enquiry} /> : null}
          {activeTab === 'followups' ? (
            <FollowupsTab
              enquiry={enquiry}
              onAdd={() => setFollowupModalOpen(true)}
              onMarkComplete={async (followupId) => {
                await enquiryService.completeFollowup(enquiry.id, followupId, 'Admin User')
                await reload()
              }}
            />
          ) : null}
          {activeTab === 'activity' ? <ActivityTimelineTab enquiry={enquiry} /> : null}
          {activeTab === 'attachments' ? (
            <AttachmentsTab
              enquiry={enquiry}
              onUpload={async () => {
                await enquiryService.uploadAttachment(enquiry.id, `requirements-${Date.now()}.pdf`, 'Admin User')
                await reload()
              }}
            />
          ) : null}
          {activeTab === 'notes' ? (
            <InternalNotesTab
              value={internalNotes || enquiry.notes.internalNotes || ''}
              onChange={setInternalNotes}
              onSave={async () => {
                await enquiryService.addNote(enquiry.id, internalNotes, 'Admin User')
                setInternalNotes('')
                await reload()
              }}
            />
          ) : null}
          {activeTab === 'assignment' ? (
            <AssignmentOwnershipTab
              enquiry={enquiry}
              onEdit={() => {
                setAssignmentModalOpen(true)
              }}
            />
          ) : null}
        </Box>
      </BaseCard>

      <StatusUpdateModal
        open={statusModalOpen}
        value={statusValue}
        reason={statusReason}
        onClose={() => setStatusModalOpen(false)}
        onStatusChange={setStatusValue}
        onReasonChange={setStatusReason}
        onSubmit={async () => {
          await enquiryService.updateStatus(enquiry.id, statusValue as typeof enquiry.status, 'Admin User', statusReason)
          setStatusModalOpen(false)
          await reload()
        }}
      />

      <AssignmentModal
        open={assignmentModalOpen}
        value={assignmentValue}
        onClose={() => setAssignmentModalOpen(false)}
        onChange={setAssignmentValue}
        onSubmit={async () => {
          await enquiryService.assignOwner(
            enquiry.id,
            {
              assignedTeam: assignmentValue.assignedTeam,
              assignedUser: assignmentValue.assignedUser,
              branch: assignmentValue.branch,
              priority: assignmentValue.priority as typeof enquiry.assignment.priority,
              slaTarget: assignmentValue.slaTarget,
              assignmentNotes: assignmentValue.assignmentNotes,
            },
            'Admin User',
          )
          setAssignmentModalOpen(false)
          await reload()
        }}
      />

      <AddFollowupModal
        open={followupModalOpen}
        value={followupValue}
        onClose={() => setFollowupModalOpen(false)}
        onChange={setFollowupValue}
        onSubmit={async () => {
          await enquiryService.addFollowup(
            enquiry.id,
            {
              ...followupValue,
              followupType: followupValue.followupType as 'call',
              followupStatus: followupValue.followupStatus as 'scheduled',
              createdBy: 'Admin User',
            },
            'Admin User',
          )
          setFollowupModalOpen(false)
          setFollowupValue(initialFollowup)
          await reload()
        }}
      />

      <ConvertToQuotationDialog
        open={convertModalOpen}
        issues={conversionIssues}
        onClose={() => setConvertModalOpen(false)}
        onConfirm={async () => {
          const result = await enquiryService.convertToQuotation(enquiry.id, 'Admin User')
          if (result.ok) {
            showToast({ title: `Quotation ${result.quotationId} generated`, variant: 'success' })
            setConvertModalOpen(false)
            await reload()
            return
          }
          setConversionIssues(result.validation?.issues ?? ['Unable to convert enquiry'])
        }}
      />
    </Stack>
  )
}
