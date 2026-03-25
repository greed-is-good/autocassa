import {
  AutoAwesomeRounded,
  LanguageRounded,
  LockOpenRounded,
} from '@mui/icons-material'
import {
  Box,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { ChatWidget } from '../components/ChatWidget'
import { ModalHub } from '../components/ModalHub'
import { RoleSwitcher } from '../components/RoleSwitcher'
import { SidebarNav } from '../components/SidebarNav'
import type { Role } from '../types'
import { PrototypeProvider } from './PrototypeContext'
import { PartnerOverviewPage } from '../pages/partner/PartnerOverviewPage'
import { PartnerReportsPage } from '../pages/partner/PartnerReportsPage'
import { PartnerTariffsPage } from '../pages/partner/PartnerTariffsPage'
import { OwnerClubsPage } from '../pages/owner/OwnerClubsPage'
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage'
import { OwnerPartnersPage } from '../pages/owner/OwnerPartnersPage'
import { OwnerPaymentsPage } from '../pages/owner/OwnerPaymentsPage'
import { OwnerProcessingsPage } from '../pages/owner/OwnerProcessingsPage'
import { PlayerHistoryPage } from '../pages/player/PlayerHistoryPage'
import { PlayerStatusPage } from '../pages/player/PlayerStatusPage'
import { PlayerTopUpPage } from '../pages/player/PlayerTopUpPage'

const navigationByRole = {
  player: {
    defaultPath: '/player/topup',
    title: 'Контур игрока',
    subtitle:
      'Минимальный путь без регистрации: пополнение, ссылка на оплату, статус платежа, чат с администратором.',
    items: [
      {
        label: 'Пополнение',
        path: '/player/topup',
        description: 'Быстрая форма пополнения с автоматическим выбором процессинга.',
      },
      {
        label: 'Статус',
        path: '/player/status',
        description: 'Рабочий экран после оплаты со статус-линией и исключениями MVP.',
      },
      {
        label: 'История',
        path: '/player/history',
        description: 'Mock-история операций без полноценного кабинета игрока.',
      },
    ],
  },
  partner: {
    defaultPath: '/partner/overview',
    title: 'Контур партнёра',
    subtitle:
      'Отдельная область с собственными операциями, тарифами и отчётностью без доступа к системным настройкам.',
    items: [
      {
        label: 'Обзор',
        path: '/partner/overview',
        description: 'Сводка метрик и таблица только по своим платежам.',
      },
      {
        label: 'Тарифы',
        path: '/partner/tariffs',
        description: 'Фиксированные курсы по связке валюта + процессинг.',
      },
      {
        label: 'Отчётность',
        path: '/partner/reports',
        description: 'Ежедневная сверка и отчётные таблицы для партнёра.',
      },
    ],
  },
  owner: {
    defaultPath: '/owner/dashboard',
    title: 'Контур владельца',
    subtitle:
      'Полноценная операционная панель: управление клубами, партнёрами, процессингами, тарифами и исключениями.',
    items: [
      {
        label: 'Дашборд',
        path: '/owner/dashboard',
        description: 'Сводные метрики, алерты и быстрые переходы.',
      },
      {
        label: 'Платежи',
        path: '/owner/payments',
        description: 'Рабочий инструмент для ручной обработки и повторных зачислений.',
      },
      {
        label: 'Клубы',
        path: '/owner/clubs',
        description: 'Реестр приложений и статус подключения API.',
      },
      {
        label: 'Процессинги',
        path: '/owner/processings',
        description: 'Связки валют и процессингов с логикой MVP.',
      },
      {
        label: 'Партнёры',
        path: '/owner/partners',
        description: 'Карточки партнёров, тарифы и журнал изменений.',
      },
    ],
  },
} as const

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
  const location = useLocation()
  const navigate = useNavigate()
  const role = resolveRole(location.pathname)
  const roleConfig = navigationByRole[role]
  const activeItem =
    roleConfig.items.find((item) => item.path === location.pathname) ?? roleConfig.items[0]

  return (
    <Box pb={6} pt={3}>
      <Container maxWidth={false} sx={{ maxWidth: 1680 }}>
        <Stack spacing={3}>
          <Box
            className="autocassa-panel autocassa-fade-up"
            sx={{
              overflow: 'hidden',
              position: 'relative',
              px: { xs: 2.5, md: 4 },
              py: { xs: 2.5, md: 3.5 },
            }}
          >
            <Box
              sx={{
                background:
                  'radial-gradient(circle at right top, rgba(255,122,26,0.26), transparent 28%), radial-gradient(circle at left top, rgba(31,115,242,0.32), transparent 34%)',
                inset: 0,
                position: 'absolute',
              }}
            />
            <Stack position="relative" spacing={3}>
              <Stack
                alignItems={{ xs: 'flex-start', lg: 'center' }}
                direction={{ xs: 'column', lg: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={0.8}>
                  <Typography color="primary.main" fontWeight={800}>
                    Автокасса / Demo Prototype
                  </Typography>
                  <Typography variant="h1">Кликабельный mock-интерфейс MVP</Typography>
                  <Typography color="text.secondary" maxWidth={900}>
                    Роли переключаются без авторизации, все данные и ответы моковые, а
                    сценарии собраны так, будто систему уже можно согласовывать с
                    заказчиком по логике и UX.
                  </Typography>
                </Stack>
                <RoleSwitcher
                  role={role}
                  onChange={(nextRole) => navigate(navigationByRole[nextRole].defaultPath)}
                />
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Chip icon={<LockOpenRounded />} label="Без реальной авторизации" />
                <Chip icon={<LanguageRounded />} label="Русский интерфейс" />
                <Chip icon={<AutoAwesomeRounded />} label="Моковые данные и состояния" />
                <Chip color="primary" label={`Сейчас открыт: ${activeItem.label}`} />
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 3 }}>
              <SidebarNav
                items={roleConfig.items}
                subtitle={roleConfig.subtitle}
                title={roleConfig.title}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 9 }}>
              <Outlet />
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <ChatWidget />
      <ModalHub />
    </Box>
  )
}

export const App = () => (
  <PrototypeProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<DemoShell />}>
          <Route element={<Navigate replace to="/player/topup" />} index />

          <Route element={<PlayerTopUpPage />} path="/player/topup" />
          <Route element={<PlayerStatusPage />} path="/player/status" />
          <Route element={<PlayerHistoryPage />} path="/player/history" />

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
    </BrowserRouter>
  </PrototypeProvider>
)
