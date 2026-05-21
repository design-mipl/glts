import { Outlet } from 'react-router-dom'

/** Stable layout shell — must not suspend so child route changes keep working. */
export default function BillingsLayout() {
  return <Outlet />
}
