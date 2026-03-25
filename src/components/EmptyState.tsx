import type { ReactNode } from 'react'

import { Box, Button, Stack, Typography } from '@mui/material'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon: ReactNode
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    spacing={2}
    sx={{
      backgroundColor: 'rgba(255,255,255,0.7)',
      border: '1px dashed rgba(15,23,42,0.14)',
      borderRadius: '20px',
      minHeight: 220,
      p: 4,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        alignItems: 'center',
        background:
          'linear-gradient(135deg, rgba(31,115,242,0.16), rgba(255,122,26,0.12))',
        borderRadius: '18px',
        color: 'primary.main',
        display: 'inline-flex',
        height: 56,
        justifyContent: 'center',
        width: 56,
      }}
    >
      {icon}
    </Box>
    <Stack spacing={1} maxWidth={420}>
      <Typography variant="h3">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
    {actionLabel && onAction ? (
      <Button onClick={onAction} variant="contained">
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
)
