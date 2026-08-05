import { Container, type ContainerProps } from '@mui/material'
import { publicLayout } from '../theme/publicSiteTokens'

interface PublicContainerProps extends ContainerProps {
  variant?: 'standard' | 'hero'
}

export function PublicContainer({
  variant = 'standard',
  children,
  sx,
  ...props
}: PublicContainerProps) {
  const maxWidth = variant === 'hero' ? publicLayout.containerHero : publicLayout.containerStandard

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth,
        px:
          variant === 'hero'
            ? { xs: 2, sm: 2.5, md: 2.5, lg: 3, xl: 3.5 }
            : { xs: 2.5, sm: 3, md: 4 },
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
