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
        px: { xs: 2.5, sm: 3, md: 4 },
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
