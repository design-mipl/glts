import type { AdminPermissionModule, AdminPermissionTab } from '@/shared/types/adminPermission'

/** Default tab when a submodule has no listing tabs in the product UI. */
export const DEFAULT_LISTING_TAB: AdminPermissionTab = { id: 'listing', label: 'Listing' }

const APPLICATION_LISTING_TABS: AdminPermissionTab[] = [
  { id: 'all', label: 'All applications' },
  { id: 'draft', label: 'Draft' },
  { id: 'verification_pending', label: 'Verification Pending' },
  { id: 'online_submission_pending', label: 'Submission Pending' },
  { id: 'pending_payment', label: 'Pending Payment' },
  { id: 'vfs_submission_pending', label: 'Embassy/VFS Submission Pending' },
  { id: 'collection_pending', label: 'Collection Pending' },
  { id: 'collected', label: 'Collected' },
  { id: 'dispatched', label: 'Dispatched' },
]

const ASSIGNMENT_LISTING_TABS: AdminPermissionTab[] = [
  { id: 'pending_assignment', label: 'Pending assignment' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'carry_forward', label: 'Carry forward' },
  { id: 'completed', label: 'Completed' },
]

/**
 * Static permission tree aligned with admin side navigation.
 * Hierarchy: Module → Submodule → listing Tabs.
 * Tools are intentionally excluded.
 */
export const ADMIN_PERMISSION_MODULES: AdminPermissionModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    submodules: [
      { id: 'super_admin', label: 'Super Admin', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'admin', label: 'Admin', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'operations', label: 'Operations', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'documentation', label: 'Documentation', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'accounts', label: 'Accounts', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'ground_operations', label: 'Ground Ops', tabs: [DEFAULT_LISTING_TAB] },
    ],
  },
  {
    id: 'client_management',
    label: 'Client Management',
    submodules: [
      {
        id: 'lead_management',
        label: 'Lead Management',
        tabs: [
          { id: 'all', label: 'All Inquiries' },
          { id: 'new', label: 'New' },
          { id: 'active', label: 'Active' },
          { id: 'converted', label: 'Converted' },
          { id: 'lost', label: 'Lost' },
          { id: 'on_hold', label: 'On Hold' },
        ],
      },
      { id: 'quotations', label: 'Quotations', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'agreements', label: 'Agreements', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'client_accounts', label: 'Client Accounts', tabs: [DEFAULT_LISTING_TAB] },
    ],
  },
  {
    id: 'application_management',
    label: 'Application management',
    submodules: [
      { id: 'marine_applications', label: 'Marine applications', tabs: APPLICATION_LISTING_TABS },
      { id: 'corporate_applications', label: 'Corporate applications', tabs: APPLICATION_LISTING_TABS },
      { id: 'retail_applications', label: 'Retail applications', tabs: APPLICATION_LISTING_TABS },
      { id: 'b2b_agents_applications', label: 'B2B agents applications', tabs: APPLICATION_LISTING_TABS },
    ],
  },
  {
    id: 'assignment_priority',
    label: 'Assignment & Priority Management',
    submodules: [
      { id: 'marine_assignment', label: 'Marine assignment', tabs: ASSIGNMENT_LISTING_TABS },
      { id: 'corporate_assignment', label: 'Corporate assignment', tabs: ASSIGNMENT_LISTING_TABS },
      { id: 'retail_assignment', label: 'Retail assignment', tabs: ASSIGNMENT_LISTING_TABS },
      { id: 'b2b_assignment', label: 'B2B assignment', tabs: ASSIGNMENT_LISTING_TABS },
    ],
  },
  {
    id: 'finance',
    label: 'Finance Operations',
    submodules: [
      {
        id: 'expenses',
        label: 'Expense management',
        tabs: [
          { id: 'marine', label: 'Marine' },
          { id: 'retail', label: 'Retail' },
          { id: 'corporate', label: 'Corporate' },
          { id: 'b2bAgents', label: 'B2B Agents' },
        ],
      },
      {
        id: 'invoices',
        label: 'Billing & invoice',
        tabs: [
          { id: 'draft', label: 'Draft' },
          { id: 'submitted', label: 'Invoiced' },
          { id: 'shared', label: 'Shared' },
          { id: 'paid', label: 'Paid' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'cancelled', label: 'Cancelled' },
          { id: 'credit_notes', label: 'Credit Notes' },
        ],
      },
      { id: 'vendor_billing', label: 'Vendor billing', tabs: [DEFAULT_LISTING_TAB] },
      {
        id: 'fund_allocation',
        label: 'Fund allocation',
        tabs: [
          { id: 'pending_allocation', label: 'Pending allocation' },
          { id: 'allocated', label: 'Allocated' },
          { id: 'claim_sheets', label: 'Claim sheets' },
        ],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support tickets',
    submodules: [
      {
        id: 'tickets',
        label: 'Support tickets',
        tabs: [
          { id: 'all', label: 'All' },
          { id: 'open', label: 'Open' },
          { id: 'active', label: 'Active' },
          { id: 'waiting', label: 'Waiting' },
          { id: 'resolved', label: 'Resolved' },
          { id: 'closed', label: 'Closed' },
        ],
      },
    ],
  },
  {
    id: 'ground_operations',
    label: 'Ground operations',
    submodules: [
      { id: 'case_handling', label: 'Operations Desk', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'logistics', label: 'Tracking & logistics', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'funds', label: 'Fund utilization', tabs: [DEFAULT_LISTING_TAB] },
    ],
  },
  {
    id: 'user_management',
    label: 'User management',
    submodules: [
      { id: 'departments', label: 'Department', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'teams', label: 'Team', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'users', label: 'User & permission', tabs: [DEFAULT_LISTING_TAB] },
    ],
  },
  {
    id: 'masters',
    label: 'Masters',
    submodules: [
      { id: 'country', label: 'Country', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'country_groups', label: 'Country Group Master', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'jurisdiction', label: 'Jurisdiction Master', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'card_master', label: 'Card Master', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'organization_location', label: 'Organization & Location Master', tabs: [DEFAULT_LISTING_TAB] },
      {
        id: 'documents',
        label: 'Document master',
        tabs: [
          { id: 'documents', label: 'Document Master' },
          { id: 'client', label: 'Client Document Master' },
        ],
      },
      { id: 'services', label: 'GLTS Fee Master', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'sac_codes', label: 'SAC Code Master', tabs: [DEFAULT_LISTING_TAB] },
      {
        id: 'tax',
        label: 'GST & TDS Master',
        tabs: [
          { id: 'gst', label: 'GST Rates' },
          { id: 'tds', label: 'TDS Sections' },
        ],
      },
      { id: 'workflows', label: 'Workflow Master', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'sla', label: 'SLA Master', tabs: [DEFAULT_LISTING_TAB] },
      { id: 'vendors', label: 'Vendor Master', tabs: [DEFAULT_LISTING_TAB] },
    ],
  },
]
