import { Container, type ContainerProps } from '@mui/material'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'

interface PublicContainerProps extends ContainerProps {
  variant?: 'standard' | 'hero'
}

export function PublicContainer({
  variant = 'standard',
  children,
  sx,
  ...props
}: PublicContainerProps) {
  const contentWidth = variant === 'hero' ? ds.container.heroMax : ds.container.max
  const gutters = {
    xs: `${ds.container.gutterMobile}px`,
    lg: `${ds.container.gutterTablet}px`,
    desktop: `${ds.container.gutterLaptop}px`,
    desktopLg: `${ds.container.gutterDesktop}px`,
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: {
          xs: contentWidth + 2 * ds.container.gutterMobile,
          lg: contentWidth + 2 * ds.container.gutterTablet,
          desktop: contentWidth + 2 * ds.container.gutterLaptop,
          desktopLg: contentWidth + 2 * ds.container.gutterDesktop,
        },
        px: gutters,
        mx: 'auto',
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  )
}
