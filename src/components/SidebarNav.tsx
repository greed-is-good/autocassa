import type { SvgIconComponent } from '@mui/icons-material'
import { AccountBalanceWalletRounded } from '@mui/icons-material'
import {
  alpha,
  Box,
  ButtonBase,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  description: string
  badge?: string
  icon: SvgIconComponent
}

interface SidebarNavProps {
  title: string
  subtitle: string
  items: readonly NavItem[]
  collapsed?: boolean
  onNavigate?: () => void
}

export const SidebarNav = ({
  title,
  subtitle,
  items,
  collapsed = false,
  onNavigate,
}: SidebarNavProps) => {
  return (
    <Stack
      spacing={2}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(15,23,42,0.08)',
        borderRadius: '26px',
        height: '100%',
        overflow: 'hidden',
        p: collapsed ? 1.5 : 2,
        transition: 'padding 220ms ease',
      }}
    >
      <Stack
        alignItems={collapsed ? 'center' : 'flex-start'}
        direction={collapsed ? 'column' : 'row'}
        spacing={collapsed ? 1 : 1.25}
      >
        <Box
          sx={{
            alignItems: 'center',
            background:
              'linear-gradient(135deg, rgba(31,115,242,0.14), rgba(31,115,242,0.04))',
            border: '1px solid rgba(31,115,242,0.12)',
            borderRadius: '18px',
            color: 'primary.main',
            display: 'inline-flex',
            flexShrink: 0,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
        >
          <AccountBalanceWalletRounded />
        </Box>

        {!collapsed ? (
          <Stack minWidth={0} spacing={0.15}>
            <Typography
              color="text.secondary"
              fontSize={11}
              fontWeight={800}
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              Автокасса
            </Typography>
            <Typography variant="h3">{title}</Typography>
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          </Stack>
        ) : null}
      </Stack>

      <Stack flexGrow={1} spacing={1.1}>
        {items.map((item) => (
          <Tooltip
            arrow
            disableHoverListener={!collapsed}
            key={item.path}
            placement="right"
            title={item.label}
          >
            <ButtonBase
              component={NavLink}
              key={item.path}
              onClick={onNavigate}
              sx={(theme) => ({
                '&.active': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.22),
                  color: theme.palette.primary.main,
                },
                alignItems: 'center',
                border: '1px solid rgba(15,23,42,0.08)',
                borderRadius: '18px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                minHeight: 52,
                px: collapsed ? 0 : 1.5,
                py: 1.2,
                textAlign: 'left',
                transition:
                  'background-color 160ms ease, border-color 160ms ease, color 160ms ease, padding 220ms ease',
                width: '100%',
              })}
              to={item.path}
            >
              <Stack
                alignItems="center"
                direction="row"
                justifyContent={collapsed ? 'center' : 'space-between'}
                spacing={collapsed ? 0 : 1}
                width="100%"
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent={collapsed ? 'center' : 'flex-start'}
                  minWidth={0}
                  spacing={1.25}
                >
                  <item.icon fontSize="small" />
                  {!collapsed ? (
                    <Typography fontWeight={800} noWrap>
                      {item.label}
                    </Typography>
                  ) : null}
                </Stack>

                {!collapsed && item.badge ? <Chip label={item.badge} size="small" /> : null}
              </Stack>
            </ButtonBase>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  )
}
