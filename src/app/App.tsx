import {
  AddCardRounded,
  AdminPanelSettingsRounded,
  ApartmentRounded,
  BarChartRounded,
  ChevronRightRounded,
  CurrencyExchangeRounded,
  GroupsRounded,
  HandshakeRounded,
  MenuRounded,
  PersonOutlineRounded,
  ReceiptLongRounded,
  SpaceDashboardRounded,
  TuneRounded,
} from '@mui/icons-material'
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { ChatWidget } from '../components/ChatWidget'
import { ModalHub } from '../components/ModalHub'
import { RoleSwitcher } from '../components/RoleSwitcher'
import { SidebarNav } from '../components/SidebarNav'
import { OwnerClubsPage } from '../pages/owner/OwnerClubsPage'
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage'
import { OwnerPartnersPage } from '../pages/owner/OwnerPartnersPage'
import { OwnerPaymentsPage } from '../pages/owner/OwnerPaymentsPage'
import { OwnerProcessingsPage } from '../pages/owner/OwnerProcessingsPage'
import { PartnerOverviewPage } from '../pages/partner/PartnerOverviewPage'
import { PartnerReportsPage } from '../pages/partner/PartnerReportsPage'
import { PartnerTariffsPage } from '../pages/partner/PartnerTariffsPage'
import { PlayerTopUpPage } from '../pages/player/PlayerTopUpPage'
import type { Role } from '../types'
import { PrototypeProvider } from './PrototypeContext'

const navigationByRole = {
  player: {
    defaultPath: '/player/topup',
    title: 'Игрок',
    subtitle: 'Пополнение и статус операции',
    items: [
      {
        label: 'Пополнение',
        path: '/player/topup',
        description: 'Форма пополнения и статус операции',
        icon: AddCardRounded,
      },
    ],
  },
  partner: {
    defaultPath: '/partner/overview',
    title: 'Партнёр',
    subtitle: 'Свой контур операций, комиссии и отчётность',
    items: [
      {
        label: 'Обзор',
        path: '/partner/overview',
        description: 'Сводка и платежи',
        icon: SpaceDashboardRounded,
      },
      {
        label: 'Комиссии',
        path: '/partner/tariffs',
        description: 'Комиссии по процессингам',
        icon: TuneRounded,
      },
      {
        label: 'Отчётность',
        path: '/partner/reports',
        description: 'Сверка и отчёты',
        icon: BarChartRounded,
      },
    ],
  },
  owner: {
    defaultPath: '/owner/dashboard',
    title: 'Владелец',
    subtitle: 'Платежи, клубы, процессинги и партнёры',
    items: [
      {
        label: 'Дашборд',
        path: '/owner/dashboard',
        description: 'Операционная сводка',
        icon: SpaceDashboardRounded,
      },
      {
        label: 'Платежи',
        path: '/owner/payments',
        description: 'Журнал операций и исключения',
        icon: ReceiptLongRounded,
      },
      {
        label: 'Клубы',
        path: '/owner/clubs',
        description: 'Выбор клуба и настройка цены фишки',
        icon: ApartmentRounded,
      },
      {
        label: 'Процессинги',
        path: '/owner/processings',
        description: 'Валюты и режимы подтверждения',
        icon: CurrencyExchangeRounded,
      },
      {
        label: 'Партнёры',
        path: '/owner/partners',
        description: 'Партнёры и комиссии',
        icon: GroupsRounded,
      },
    ],
  },
} as const

const DESKTOP_SIDEBAR_WIDTH = 296
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 92

const roleMetaByRole: Record<
  Role,
  { label: string; icon: typeof PersonOutlineRounded }
> = {
  player: {
    label: 'Игрок',
    icon: PersonOutlineRounded,
  },
  partner: {
    label: 'Партнёр',
    icon: HandshakeRounded,
  },
  owner: {
    label: 'Владелец',
    icon: AdminPanelSettingsRounded,
  },
}

const resolveRole = (pathname: string): Role => {
  if (pathname.startsWith('/partner')) {
    return 'partner'
  }

  if (pathname.startsWith('/owner')) {
    return 'owner'
  }

  return 'player'
}

const DemoShell = () => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const location = useLocation()
  const navigate = useNavigate()
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const role = resolveRole(location.pathname)
  const roleConfig = navigationByRole[role]
  const roleMeta = roleMetaByRole[role]
  const RoleIcon = roleMeta.icon
  const activeItem =
    roleConfig.items.find((item) => item.path === location.pathname) ?? roleConfig.items[0]
  const sidebarWidth = desktopSidebarExpanded
    ? DESKTOP_SIDEBAR_WIDTH
    : DESKTOP_SIDEBAR_COLLAPSED_WIDTH

  useEffect(() => {
    if (isDesktop) {
      setMobileSidebarOpen(false)
    }
  }, [isDesktop])

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setDesktopSidebarExpanded((current) => !current)
      return
    }

    setMobileSidebarOpen((current) => !current)
  }

  const handleSidebarNavigate = () => {
    if (!isDesktop) {
      setMobileSidebarOpen(false)
    }
  }

  return (
    <Box pb={6} pt={3}>
      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={() => setMobileSidebarOpen(false)}
        open={mobileSidebarOpen}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            p: 1.5,
            width: 320,
          },
        }}
        sx={{
          display: { lg: 'none' },
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(15,23,42,0.24)',
          },
        }}
        variant="temporary"
      >
        <Box sx={{ height: '100%' }}>
          <SidebarNav
            items={roleConfig.items}
            onNavigate={handleSidebarNavigate}
            subtitle={roleConfig.subtitle}
            title={roleConfig.title}
          />
        </Box>
      </Drawer>

      <Container maxWidth={false} sx={{ maxWidth: 1680 }}>
        <Box
          sx={{
            alignItems: 'stretch',
            display: 'flex',
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              flexShrink: 0,
              transition: 'width 220ms ease',
              width: sidebarWidth,
            }}
          >
            <Box
              sx={{
                height: 'calc(100vh - 24px)',
                position: 'sticky',
                top: 0,
              }}
            >
              <SidebarNav
                collapsed={!desktopSidebarExpanded}
                items={roleConfig.items}
                subtitle={roleConfig.subtitle}
                title={roleConfig.title}
              />
            </Box>
          </Box>

          <Stack flexGrow={1} minWidth={0} spacing={2.5}>
            <Box
              className="autocassa-panel autocassa-fade-up"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.84)',
                px: { xs: 2, md: 3 },
                py: { xs: 1.75, md: 2.25 },
              }}
            >
              <Stack spacing={1.4}>
                <Stack
                  alignItems={{ xs: 'flex-start', lg: 'center' }}
                  direction={{ xs: 'column', lg: 'row' }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.4}
                  >
                    <IconButton
                      aria-label="Переключить меню"
                      onClick={handleSidebarToggle}
                      sx={{
                        border: '1px solid rgba(15,23,42,0.08)',
                        borderRadius: '14px',
                        color: 'text.primary',
                      }}
                    >
                      <MenuRounded />
                    </IconButton>

                    <Stack spacing={0.45}>
                      <Typography
                        fontSize={14}
                        fontWeight={800}
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                      >
                        Автокасса
                      </Typography>
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        spacing={1}
                        useFlexGap
                      >
                        <Stack alignItems="center" direction="row" spacing={0.75}>
                          <RoleIcon fontSize="small" />
                          <Typography fontWeight={700}>{roleMeta.label}</Typography>
                        </Stack>
                        <ChevronRightRounded sx={{ color: 'text.disabled' }} />
                        <Typography color="text.secondary" fontWeight={700}>
                          {activeItem.label}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <RoleSwitcher
                    role={role}
                    onChange={(nextRole) => navigate(navigationByRole[nextRole].defaultPath)}
                  />
                </Stack>
              </Stack>
            </Box>

            <Outlet />
          </Stack>
        </Box>
      </Container>

      <ChatWidget />
      <ModalHub />
    </Box>
  )
}

export const App = () => (
  <PrototypeProvider>
    <HashRouter>
      <Routes>
        <Route element={<DemoShell />}>
          <Route element={<Navigate replace to="/player/topup" />} index />

          <Route element={<PlayerTopUpPage />} path="/player/topup" />
          <Route element={<Navigate replace to="/player/topup" />} path="/player/status" />
          <Route element={<Navigate replace to="/player/topup" />} path="/player/history" />

          <Route element={<PartnerOverviewPage />} path="/partner/overview" />
          <Route element={<PartnerTariffsPage />} path="/partner/tariffs" />
          <Route element={<PartnerReportsPage />} path="/partner/reports" />

          <Route element={<OwnerDashboardPage />} path="/owner/dashboard" />
          <Route element={<OwnerPaymentsPage />} path="/owner/payments" />
          <Route element={<OwnerClubsPage />} path="/owner/clubs" />
          <Route element={<OwnerProcessingsPage />} path="/owner/processings" />
          <Route element={<OwnerPartnersPage />} path="/owner/partners" />
        </Route>
      </Routes>
    </HashRouter>
  </PrototypeProvider>
)
