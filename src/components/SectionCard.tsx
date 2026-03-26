import { type PropsWithChildren, type ReactNode } from 'react'

import { Card, CardContent, Stack, Typography } from '@mui/material'

interface SectionCardProps extends PropsWithChildren {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export const SectionCard = ({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  className,
}: SectionCardProps) => (
  <Card className={className}>
    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack
        alignItems={{ xs: 'flex-start', md: 'flex-start' }}
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack minWidth={0} spacing={0.75}>
          {eyebrow ? (
            <Typography
              color="primary.main"
              fontSize={12}
              fontWeight={800}
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Typography variant="h3">{title}</Typography>
          {subtitle ? (
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: '100%',
                overflow: { lg: 'hidden' },
                textOverflow: { lg: 'ellipsis' },
                whiteSpace: { xs: 'normal', lg: 'nowrap' },
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        {action}
      </Stack>

      <Stack mt={3}>{children}</Stack>
    </CardContent>
  </Card>
)
