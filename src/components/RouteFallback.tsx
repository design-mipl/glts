import { GLTSLoader } from '@/components/GLTSLoader'

export default function RouteFallback({ label = 'Loading…' }: { label?: string }) {
  return <GLTSLoader variant="fullscreen" label={label} />
}
