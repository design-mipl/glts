import type {
  EnquiryActivityLog,
  EnquiryAssignment,
  EnquiryConversionValidation,
  EnquiryFollowup,
  EnquiryFormData,
  EnquiryListingFilters,
  EnquiryPriority,
  EnquiryRecord,
  EnquiryStatus,
} from '../types/enquiry'

function nowIso() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function daysFromToday(days: number) {
  const value = new Date()
  value.setDate(value.getDate() + days)
  return value.toISOString()
}

const statusFlow: Record<EnquiryStatus, EnquiryStatus[]> = {
  new: ['under_discussion', 'on_hold', 'rejected'],
  under_discussion: ['requirement_gathering', 'pending_customer_response', 'on_hold'],
  requirement_gathering: ['internal_review', 'pending_customer_response', 'on_hold'],
  pending_customer_response: ['under_discussion', 'internal_review', 'closed'],
  internal_review: ['quotation_in_progress', 'on_hold', 'rejected'],
  quotation_in_progress: ['converted', 'on_hold'],
  converted: [],
  on_hold: ['under_discussion', 'closed'],
  closed: [],
  rejected: [],
}

function makeActivity(
  type: EnquiryActivityLog['type'],
  title: string,
  description: string,
  actor: string,
): EnquiryActivityLog {
  return {
    id: id('act'),
    type,
    title,
    description,
    actor,
    timestamp: nowIso(),
  }
}

let enquiryStore: EnquiryRecord[] = [
  {
    id: 'ENQ-24001',
    enquiryDate: daysFromToday(-5),
    createdBy: 'Neha Arora',
    status: 'under_discussion',
    customer: {
      companyOrCustomerName: 'Apex Marine Logistics',
      customerType: 'marine',
      contactPersonName: 'Rohit Menon',
      contactNumber: '+91 9988776655',
      emailAddress: 'rohit@apexmarine.com',
      alternateContactNumber: '+91 9988776644',
      companyWebsite: 'https://apexmarine.example',
      companyAddress: 'Mumbai Port Road, Mumbai',
    },
    visaRequirement: {
      countries: ['Singapore', 'UAE'],
      visaType: 'Crew Movement Visa',
      purposeOfVisit: 'Crew joining and vessel handover',
      numberOfApplicants: 24,
      marineRequirement: true,
      tentativeTravelDate: daysFromToday(9),
      expectedProcessingTimeline: 'Within 10 business days',
      urgencyLevel: 'high',
    },
    operationalRequirements: {
      bulkUploadRequired: true,
      documentPickupRequired: true,
      groundOperationsRequired: true,
      biometricsAssistanceRequired: false,
      courierSupportRequired: true,
      dedicatedSpocRequired: true,
    },
    salesDetails: {
      inquirySource: 'referral',
      assignedSalesPerson: 'Pooja Sharma',
      assignedOperationsTeam: 'Marine Ops',
      branch: 'Mumbai',
      priorityLevel: 'high',
    },
    notes: {
      initialDiscussionNotes: 'Customer wants bundled crew processing support.',
      customerExpectations: 'Single SPOC, daily follow-up updates.',
      specialInstructions: 'Prioritize senior officers first.',
      internalNotes: 'Potential high-value annual account.',
    },
    attachments: [],
    followups: [
      {
        id: id('fup'),
        followupType: 'call',
        followupDate: daysFromToday(1),
        followupTime: '11:30',
        discussionSummary: 'Requirement clarification call scheduled',
        nextAction: 'Collect passport sample set',
        assignedUser: 'Karan S',
        reminderRequired: true,
        followupStatus: 'scheduled',
        createdAt: daysFromToday(-1),
        createdBy: 'Pooja Sharma',
      },
    ],
    activities: [
      makeActivity('created', 'Enquiry created', 'Initial enquiry captured from referral', 'Neha Arora'),
    ],
    assignment: {
      assignedTeam: 'Marine Ops',
      assignedUser: 'Karan S',
      branch: 'Mumbai',
      priority: 'high',
      slaTarget: daysFromToday(3),
      assignmentNotes: 'Handle with marine specialist support.',
      ownershipHistory: [],
    },
    lastActivity: daysFromToday(-1),
    nextFollowupDate: daysFromToday(1),
  },
]

function applyListingFilters(items: EnquiryRecord[], filters?: EnquiryListingFilters) {
  if (!filters) return items

  return items.filter((item) => {
    if (filters.customerType && item.customer.customerType !== filters.customerType) return false
    if (filters.countryRequirement && !item.visaRequirement.countries.includes(filters.countryRequirement)) return false
    if (filters.visaType && item.visaRequirement.visaType !== filters.visaType) return false
    if (filters.priority && item.salesDetails.priorityLevel !== filters.priority) return false
    if (filters.assignedTeam && item.assignment.assignedTeam !== filters.assignedTeam) return false
    if (filters.assignedUser && item.assignment.assignedUser !== filters.assignedUser) return false
    if (filters.enquiryStatus && item.status !== filters.enquiryStatus) return false
    if (typeof filters.marineRequirement === 'boolean' && item.visaRequirement.marineRequirement !== filters.marineRequirement) return false
    if (filters.inquirySource && item.salesDetails.inquirySource !== filters.inquirySource) return false
    return true
  })
}

export const enquiryService = {
  list(filters?: EnquiryListingFilters) {
    return Promise.resolve(applyListingFilters(enquiryStore, filters))
  },

  getById(enquiryId: string) {
    return Promise.resolve(enquiryStore.find((item) => item.id === enquiryId))
  },

  create(payload: EnquiryFormData, createdBy = 'System User') {
    const record: EnquiryRecord = {
      id: `ENQ-${Date.now().toString().slice(-5)}`,
      enquiryDate: nowIso(),
      createdBy,
      status: payload.status ?? 'new',
      customer: payload.customer,
      visaRequirement: payload.visaRequirement,
      operationalRequirements: payload.operationalRequirements,
      salesDetails: payload.salesDetails,
      notes: payload.notes,
      attachments: payload.attachments ?? [],
      followups: payload.followups ?? [],
      activities: [makeActivity('created', 'Enquiry created', 'New enquiry was submitted', createdBy)],
      assignment: {
        assignedTeam: payload.assignment?.assignedTeam,
        assignedUser: payload.assignment?.assignedUser,
        branch: payload.assignment?.branch,
        priority: payload.assignment?.priority ?? payload.salesDetails.priorityLevel,
        slaTarget: payload.assignment?.slaTarget,
        assignmentNotes: payload.assignment?.assignmentNotes,
        ownershipHistory: [],
      },
      lastActivity: nowIso(),
      nextFollowupDate: payload.followups?.[0]?.followupDate,
    }
    enquiryStore = [record, ...enquiryStore]
    return Promise.resolve(record)
  },

  update(enquiryId: string, patch: Partial<EnquiryFormData>) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)
    Object.assign(target, patch)
    target.lastActivity = nowIso()
    target.activities.unshift(makeActivity('note_added', 'Enquiry updated', 'Core enquiry fields were updated', 'System User'))
    return Promise.resolve(target)
  },

  updateStatus(enquiryId: string, nextStatus: EnquiryStatus, actor: string, reason?: string) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve({ ok: false, message: 'Enquiry not found' })
    if (!statusFlow[target.status].includes(nextStatus) && target.status !== nextStatus) {
      return Promise.resolve({ ok: false, message: 'Invalid status transition' })
    }
    const previousStatus = target.status
    target.status = nextStatus
    target.lastActivity = nowIso()
    target.activities.unshift(
      makeActivity(
        'status_updated',
        'Status updated',
        `Status changed from ${previousStatus} to ${nextStatus}${reason ? `: ${reason}` : ''}`,
        actor,
      ),
    )
    return Promise.resolve({ ok: true, enquiry: target })
  },

  assignOwner(enquiryId: string, assignmentPatch: Partial<EnquiryAssignment>, actor: string) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)

    target.assignment.ownershipHistory.unshift({
      changedAt: nowIso(),
      changedBy: actor,
      fromTeam: target.assignment.assignedTeam,
      toTeam: assignmentPatch.assignedTeam ?? target.assignment.assignedTeam,
      fromUser: target.assignment.assignedUser,
      toUser: assignmentPatch.assignedUser ?? target.assignment.assignedUser,
      notes: assignmentPatch.assignmentNotes,
    })
    target.assignment = {
      ...target.assignment,
      ...assignmentPatch,
    }
    target.activities.unshift(
      makeActivity(
        'assignment_updated',
        'Assignment updated',
        `Assigned to ${target.assignment.assignedTeam ?? 'Unassigned'} / ${target.assignment.assignedUser ?? 'Unassigned'}`,
        actor,
      ),
    )
    target.lastActivity = nowIso()
    return Promise.resolve(target)
  },

  addFollowup(enquiryId: string, followup: Omit<EnquiryFollowup, 'id' | 'createdAt'>, actor: string) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)

    const created: EnquiryFollowup = {
      ...followup,
      id: id('fup'),
      createdAt: nowIso(),
    }
    target.followups.unshift(created)
    target.nextFollowupDate = created.followupDate
    target.lastActivity = nowIso()
    target.activities.unshift(
      makeActivity('followup_added', 'Follow-up added', `${created.followupType} follow-up scheduled`, actor),
    )
    return Promise.resolve(created)
  },

  completeFollowup(enquiryId: string, followupId: string, actor: string) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)
    const followup = target.followups.find((entry) => entry.id === followupId)
    if (!followup) return Promise.resolve(undefined)
    followup.followupStatus = 'completed'
    target.activities.unshift(makeActivity('followup_completed', 'Follow-up completed', followup.nextAction, actor))
    target.lastActivity = nowIso()
    return Promise.resolve(followup)
  },

  addNote(enquiryId: string, note: string, actor: string) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)
    target.notes.internalNotes = [target.notes.internalNotes, note].filter(Boolean).join('\n')
    target.activities.unshift(makeActivity('note_added', 'Internal note added', note, actor))
    target.lastActivity = nowIso()
    return Promise.resolve(target)
  },

  uploadAttachment(enquiryId: string, fileName: string, actor: string) {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve(undefined)
    const attachment = {
      id: id('att'),
      fileName,
      fileType: fileName.split('.').pop() ?? 'file',
      fileSizeKb: 320,
      uploadedAt: nowIso(),
      uploadedBy: actor,
      version: 1,
    }
    target.attachments.unshift(attachment)
    target.activities.unshift(
      makeActivity('attachment_uploaded', 'Attachment uploaded', `${fileName} uploaded`, actor),
    )
    target.lastActivity = nowIso()
    return Promise.resolve(attachment)
  },

  validateConversion(enquiryId: string): Promise<EnquiryConversionValidation> {
    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return Promise.resolve({ isValid: false, issues: ['Enquiry not found'] })

    const issues: string[] = []
    if (!target.customer.companyOrCustomerName) issues.push('Customer / Company name is mandatory')
    if (!target.visaRequirement.countries.length) issues.push('At least one country requirement is mandatory')
    if (!target.visaRequirement.visaType) issues.push('Visa type is mandatory')
    if (!target.customer.contactNumber && !target.customer.emailAddress) issues.push('Contact information is mandatory')
    if (!target.followups.some((entry) => entry.followupStatus === 'completed')) issues.push('At least one follow-up must be completed')
    if (target.status !== 'internal_review' && target.status !== 'quotation_in_progress') {
      issues.push('Enquiry should be in internal review before conversion')
    }
    return Promise.resolve({ isValid: issues.length === 0, issues })
  },

  async convertToQuotation(enquiryId: string, actor: string) {
    const validation = await this.validateConversion(enquiryId)
    if (!validation.isValid) return { ok: false, validation, quotationId: undefined }

    const target = enquiryStore.find((item) => item.id === enquiryId)
    if (!target) return { ok: false, validation: { isValid: false, issues: ['Enquiry not found'] } }

    target.status = 'converted'
    target.lastActivity = nowIso()
    target.activities.unshift(
      makeActivity('converted_to_quotation', 'Converted to quotation', 'Quotation record generated', actor),
    )

    return {
      ok: true,
      validation,
      quotationId: `QT-${enquiryId.replace('ENQ-', '')}`,
    }
  },

  getStatusOptions() {
    return Promise.resolve(Object.keys(statusFlow) as EnquiryStatus[])
  },

  getPriorityOptions(): Promise<EnquiryPriority[]> {
    return Promise.resolve(['low', 'medium', 'high', 'critical'])
  },
}
