import { Box, Stack, Typography } from '@mui/material'

import type { TimelineItem } from '../types'

const stateStyles = {
  done: {
    bg: '#1f8f66',
    border: '#1f8f66',
    line: 'rgba(31,143,102,0.22)',
  },
  active: {
    bg: '#1f73f2',
    border: '#1f73f2',
    line: 'rgba(31,115,242,0.22)',
  },
  pending: {
    bg: '#ffffff',
    border: 'rgba(96,112,138,0.26)',
    line: 'rgba(96,112,138,0.18)',
  },
  error: {
    bg: '#c2410c',
    border: '#c2410c',
    line: 'rgba(194,65,12,0.22)',
  },
}

interface OperationTimelineProps {
  items: TimelineItem[]
}

export const OperationTimeline = ({ items }: OperationTimelineProps) => (
  <Stack spacing={2.25}>
    {items.map((item, index) => {
      const style = stateStyles[item.state]
      const isLast = index === items.length - 1

      return (
        <Stack alignItems="flex-start" direction="row" key={item.label} spacing={2}>
          <Stack alignItems="center" sx={{ minWidth: 22 }}>
            <Box
              sx={{
                backgroundColor: style.bg,
                border: `2px solid ${style.border}`,
                borderRadius: '999px',
                height: 14,
                mt: 0.6,
                width: 14,
              }}
            />
            {!isLast ? (
              <Box
                sx={{
                  backgroundColor: style.line,
                  borderRadius: '999px',
                  flexGrow: 1,
                  mt: 0.8,
                  minHeight: 34,
                  width: 2,
                }}
              />
            ) : null}
          </Stack>
          <Stack pb={isLast ? 0 : 0.5} spacing={0.4}>
            <Typography fontWeight={700}>{item.label}</Typography>
            <Typography color="text.secondary" variant="body2">
              {item.time}
            </Typography>
          </Stack>
        </Stack>
      )
    })}
  </Stack>
)
