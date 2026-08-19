import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import RouteFallback from '@/components/RouteFallback'

type ModuleWithNamedExport = Record<string, ComponentType<object>>

export function lazyNamed(
  factory: () => Promise<ModuleWithNamedExport>,
  exportName: string,
): LazyExoticComponent<ComponentType<object>> {
  return lazy(async () => {
    const module = await factory()
    const component = module[exportName]
    if (!component) {
      throw new Error(`lazyNamed: "${exportName}" was not exported from ${factory.toString()}`)
    }
    return { default: component }
  })
}

export function lazyDefault(
  factory: () => Promise<{ default: ComponentType<object> }>,
): LazyExoticComponent<ComponentType<object>> {
  return lazy(factory)
}

export function LazyRouteBoundary({
  children,
  label = 'Loading…',
}: {
  children: ReactNode
  label?: string
}) {
  return <Suspense fallback={<RouteFallback label={label} />}>{children}</Suspense>
}
