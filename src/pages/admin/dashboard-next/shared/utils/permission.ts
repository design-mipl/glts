/** Hide a widget when permission is explicitly false; treat undefined as allowed. */
export function isDashboardPermissionGranted(permission?: boolean): boolean {
  return permission !== false
}
