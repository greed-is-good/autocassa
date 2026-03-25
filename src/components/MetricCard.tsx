import type { ReactNode } from 'react'

import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

interface MetricCardProps {
  label: string
  value: string
  hint: string
  icon: ReactNode
  tone?: 'brand' | 'success' | 'warning' | 'danger'
}

const toneMap = {
  brand: {
    bg: 'linear-gradient(135deg, rgba(31,115,242,0.14), rgba(31,115,242,0.02))',
    color: '#1f73f2',
  },
  success: {
    bg: 'linear-gradient(135deg, rgba(31,143,102,0.16), rgba(31,143,102,0.02))',
    color: '#1f8f66',
  },
  warning: {
    bg: 'linear-gradient(135deg, rgba(217,119,6,0.16), rgba(217,119,6,0.02))',
    color: '#d97706',
  },
  danger: {
    bg: 'linear-gradient(135deg, rgba(194,65,12,0.16), rgba(194,65,12,0.02))',
    color: '#c2410c',
  },
}

export const MetricCard = ({
  label,
  value,
  hint,
  icon,
  tone = 'brand',
}: MetricCardProps) => (
  <Card>
    <CardContent sx={{ p: 2.75 }}>
      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography color="text.secondary" fontWeight={700}>
            {label}
          </Typography>
          <Box
            sx={{
              alignItems: 'center',
              background: toneMap[tone].bg,
              borderRadius: '16px',
              color: toneMap[tone].color,
              display: 'inline-flex',
              height: 44,
              justifyContent: 'center',
              width: 44,
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Typography fontSize={30} fontWeight={800} letterSpacing="-0.04em">
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {hint}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
)
