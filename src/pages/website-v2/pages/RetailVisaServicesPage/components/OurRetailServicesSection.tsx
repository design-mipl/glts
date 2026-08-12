import { useMemo } from 'react'
import {
  AdditionalServicesSection,
  type AdditionalServiceItem,
} from '../../../components/AdditionalServicesSection'
import { retailServices } from '../retailPageData'

/**
 * Retail services showcase — same expand/slider interaction as Additional Services
 * (featured panel + icon collapsed cards), with retail-specific copy and imagery.
 */
export function OurRetailServicesSection() {
  const services = useMemo<AdditionalServiceItem[]>(
    () =>
      retailServices.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        ctaLabel: 'Learn More',
        href: service.href,
        image: {
          src: service.image.src,
          fallback: service.image.fallback,
          alt: service.image.alt,
          objectPosition: service.image.objectPosition,
        },
      })),
    [],
  )

  return (
    <AdditionalServicesSection
      id="our-retail-services"
      sectionLabel="Retail Services"
      heading="Our Retail Services"
      description="Complete visa support for tourists, families, students, and individual travelers—from category selection through embassy-ready submission."
      services={services}
    />
  )
}
