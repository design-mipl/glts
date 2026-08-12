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
            ? { xs: 3, sm: 4, md: 5, lg: 6, xl: 8 }
            : { xs: 3, sm: 4, md: 5, lg: 6 },
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
