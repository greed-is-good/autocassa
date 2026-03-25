import {
  alpha,
  Box,
  ButtonBase,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  description: string
  badge?: string
}

interface SidebarNavProps {
  title: string
  subtitle: string
  items: readonly NavItem[]
}

export const SidebarNav = ({ title, subtitle, items }: SidebarNavProps) => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Stack
      spacing={2}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.76)',
        border: '1px solid rgba(15,23,42,0.08)',
        borderRadius: '26px',
        height: 'fit-content',
        p: 2,
        position: { lg: 'sticky' },
        top: { lg: 110 },
      }}
    >
      <Stack spacing={0.75}>
        <Typography variant="h3">{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {subtitle}
        </Typography>
      </Stack>

      <Stack direction={isDesktop ? 'column' : 'row'} spacing={1.1}>
        {items.map((item) => (
          <ButtonBase
            component={NavLink}
            key={item.path}
            sx={{
              '&.active': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderColor: alpha(theme.palette.primary.main, 0.22),
              },
              alignItems: 'stretch',
              border: '1px solid rgba(15,23,42,0.08)',
              borderRadius: '18px',
              flex: isDesktop ? '0 0 auto' : '1 1 0',
              justifyContent: 'flex-start',
              p: 1.5,
              textAlign: 'left',
            }}
            to={item.path}
          >
            <Stack spacing={0.5} width="100%">
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={1}
              >
                <Typography fontWeight={800}>{item.label}</Typography>
                {item.badge ? <Chip label={item.badge} size="small" /> : null}
              </Stack>
              <Box minHeight={36}>
                <Typography color="text.secondary" variant="body2">
                  {item.description}
                </Typography>
              </Box>
            </Stack>
          </ButtonBase>
        ))}
      </Stack>
    </Stack>
  )
}
