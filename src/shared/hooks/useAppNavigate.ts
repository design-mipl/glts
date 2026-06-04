import { useCallback } from 'react'
import { useNavigate, type NavigateOptions } from 'react-router-dom'
import { navigateToAppPath } from '@/shared/utils/routerNavigationUtils'

/**
 * Navigate helper that resolves absolute app paths under splat parents (`/admin/*`, `/retail/*`, etc.).
 */
export function useAppNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigate(to)
        return
      }
      navigateToAppPath(navigate, to, options)
    },
    [navigate],
  )
}
