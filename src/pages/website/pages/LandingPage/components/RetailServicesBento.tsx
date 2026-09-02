import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ServiceBentoSection,
  type ServiceBentoItem,
} from '../../../components/ServiceBentoSection'
import { SiteTextLink } from '../../../components/SiteTextLink'
import { retailServices } from '../../RetailVisaServicesPage/retailPageData'

/**
 * Retail services, homepage treatment.
 *
 * The Retail page still renders these through `AdditionalServicesSection`'s expanding
 * slider, which suits a page whose subject is the service list. The homepage ran that same
 * slider twice — once here and once for additional services — so the two sections were
 * visually indistinguishable and four of five services started collapsed behind an
 * interaction. The bento shows all five at once, which is what a scrolled-past section
 * needs to do.
 */
export function RetailServicesBento() {
  const navigate = useNavigate()

  const items = useMemo<ServiceBentoItem[]>(
    () =>
      retailServices.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        href: service.href,
        image: service.image,
      })),
    [],
  )

  return (
    <ServiceBentoSection
      id="our-retail-services"
      eyebrow={`Retail services · ${String(items.length).padStart(2, '0')}`}
      title="Every kind of file we handle."
      lead="Category selection, document lists and embassy-ready submission — the same specialist review on each one."
      items={items}
      footnote="Not sure which category your trip falls under? Check the destination first — the requirement decides the category, not the other way round."
      action={<SiteTextLink onClick={() => navigate('/countries')}>Check a destination</SiteTextLink>}
    />
  )
}
