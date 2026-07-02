import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { FilePlus2 } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BaseCard, Button, EmptyState, Tabs } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { vendorService } from '@/shared/services/vendorService'
import { vendorBillingService } from '@/shared/services/vendorBillingService'
import type { Vendor } from '@/shared/types/vendor'
import type { VendorBillingSummaryRow } from '@/shared/types/vendorBilling'
import { VendorBillingDetailSummary } from '../components/detail/VendorBillingDetailSummary'
import { VendorBillingAwaitingInvoiceTab, type VendorBillingAwaitingInvoiceTabHandle } from '../components/detail/VendorBillingAwaitingInvoiceTab'
import { VendorBillingBillsTab } from '../components/detail/VendorBillingBillsTab'
import { VendorBillingPaymentsTab } from '../components/detail/VendorBillingPaymentsTab'
import { VendorBillingLedgerTab } from '../components/detail/VendorBillingLedgerTab'
import {
  VENDOR_BILLING_BASE_PATH,
  VENDOR_BILLING_DETAIL_TABS,
  type VendorBillingDetailTab,
} from '../config/vendorBillingStatusConfig'

function isValidTab(value: string | null): value is VendorBillingDetailTab {
  return VENDOR_BILLING_DETAIL_TABS.some(tab => tab.value === value)
}

export function VendorBillingDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState<Vendor>()
  const [summary, setSummary] = useState<VendorBillingSummaryRow>()
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([])
  const awaitingTabRef = useRef<VendorBillingAwaitingInvoiceTabHandle>(null)

  const activeTab = useMemo(() => {
    const param = searchParams.get('tab')
    return isValidTab(param) ? param : 'awaiting-invoice'
  }, [searchParams])

  const reload = useCallback(() => {
    if (!vendorId) return
    setVendor(vendorService.getById(vendorId))
    setSummary(vendorBillingService.getVendorSummary(vendorId))
    setLoading(false)
  }, [vendorId])

  useEffect(() => {
    reload()
  }, [reload])

  const handleTabChange = useCallback(
    (tab: string) => {
      setSearchParams({ tab })
      if (tab !== 'awaiting-invoice') {
        setSelectedChargeIds([])
      }
    },
    [setSearchParams],
  )

  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedChargeIds(ids)
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!vendor) {
    return (
      <EmptyState
        variant="no-data"
        title="Vendor not found"
        action={{ label: 'Back to vendor billing', onClick: () => navigate(VENDOR_BILLING_BASE_PATH) }}
      />
    )
  }

  return (
    <AdminDetailShell
      breadcrumbs={[
        { label: 'Finance', href: VENDOR_BILLING_BASE_PATH },
        { label: 'Vendor billing', href: VENDOR_BILLING_BASE_PATH },
        { label: vendor.vendorName },
      ]}
      summary={<VendorBillingDetailSummary vendor={vendor} summary={summary} />}
    >
      <BaseCard>
        <Box
          sx={{
            px: 2.5,
            py: 1,
            minHeight: 52,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              minHeight: 36,
            }}
          >
            <Tabs
              items={VENDOR_BILLING_DETAIL_TABS.map(tab => ({
                label: tab.label,
                value: tab.value,
              }))}
              value={activeTab}
              onChange={handleTabChange}
              variant="underline"
              size="sm"
              scrollable
              sx={{
                width: '100%',
                minHeight: 36,
                borderBottom: 'none',
              }}
            />
          </Box>
          {activeTab === 'awaiting-invoice' ? (
            <Box
              sx={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                height: 36,
              }}
            >
              <Button
                label="Create vendor bill"
                startIcon={<FilePlus2 size={16} />}
                onClick={() => awaitingTabRef.current?.openCreateModal()}
                disabled={selectedChargeIds.length === 0}
              />
            </Box>
          ) : null}
        </Box>
        <Box sx={{ p: 2.5 }}>
          {activeTab === 'awaiting-invoice' ? (
            <VendorBillingAwaitingInvoiceTab
              ref={awaitingTabRef}
              vendorId={vendor.id}
              vendorName={vendor.vendorName}
              onBillCreated={reload}
              onSelectionChange={handleSelectionChange}
            />
          ) : null}
          {activeTab === 'bills' ? (
            <VendorBillingBillsTab
              vendorId={vendor.id}
              onBillUpdated={reload}
              onBillFullyPaid={() => setSearchParams({ tab: 'payments' })}
            />
          ) : null}
          {activeTab === 'payments' ? <VendorBillingPaymentsTab vendorId={vendor.id} /> : null}
          {activeTab === 'ledger' ? <VendorBillingLedgerTab vendorId={vendor.id} /> : null}
        </Box>
      </BaseCard>
    </AdminDetailShell>
  )
}
