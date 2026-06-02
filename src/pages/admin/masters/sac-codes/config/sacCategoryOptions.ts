import { MASTER_CATEGORY_OPTIONS } from '@/shared/types/masterCommon'

export const SAC_CATEGORY_OPTIONS = MASTER_CATEGORY_OPTIONS.map((cat) => ({
  value: cat,
  label: cat,
}))
