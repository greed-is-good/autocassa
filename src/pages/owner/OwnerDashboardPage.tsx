import {
  AccountBalanceWalletRounded,
  ErrorRounded,
  RocketLaunchRounded,
  TaskAltRounded,
} from '@mui/icons-material'
import {
  Alert,
  ButtonBase,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePrototype } from '../../app/PrototypeContext'
import { MetricCard } from '../../components/MetricCard'
import { SectionCard } from '../../components/SectionCard'
import {
  formatAmount,
  getClubById,
  getPartnerById,
  integrationAlerts,
  ownerAlerts,
  ownerQuickLinks,
} from '../../data/mockData'
import { StatusChip } from '../../components/StatusChip'

export const OwnerDashboardPage = () => {
  const navigate = useNavigate()
  const { allOperations, setDetailTab, setSelectedOperationId } = usePrototype()

  const metrics = useMemo(() => {
    const totalAmount = allOperations.reduce(
      (accumulator, operation) => accumulator + operation.amount,
      0,
    )
    const successful = allOperations.filter(
      (operation) => operation.creditStatus === 'Зачислено',
    ).length
    const exceptions = allOperations.filter(
      (operation) =>
        operation.creditStatus === 'Ошибка зачисления' ||
        operation.creditStatus === 'Требует ручной обработки',
    ).length

    return {
      totalAmount: `${formatAmount(totalAmount, 'RUB')} RUB`,
      successful,
      exceptions,
    }
  }, [allOperations])

  const manualItems = allOperations.filter(
    (operation) =>
      operation.creditStatus === 'Ошибка зачисления' ||
      operation.creditStatus === 'Требует ручной обработки',
  )

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Все операции внутри демонстрационного контура"
            icon={<AccountBalanceWalletRounded />}
            label="Операций в системе"
            value={allOperations.length.toString()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Совокупный объём платежей по моковым данным"
            icon={<RocketLaunchRounded />}
            label="Сумма пополнений"
            tone="brand"
            value={metrics.totalAmount}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Подтверждённые клубами зачисления"
            icon={<TaskAltRounded />}
            label="Успешные зачисления"
            tone="success"
            value={metrics.successful.toString()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Ошибки API и ручная обработка"
            icon={<ErrorRounded />}
            label="Исключения"
            tone="danger"
            value={metrics.exceptions.toString()}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Stack spacing={3}>
            <SectionCard
              eyebrow="Владелец"
              title="Быстрые переходы"
              subtitle="Главный экран работает как операционная панель: отсюда можно сразу переходить к платежам, интеграциям и партнёрам."
            >
              <Grid container spacing={1.5}>
                {ownerQuickLinks.map((item) => (
                  <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                    <ButtonBase
                      onClick={() => navigate(item.path)}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.72)',
                        border: '1px solid rgba(15,23,42,0.08)',
                        borderRadius: '18px',
                        justifyContent: 'flex-start',
                        p: 2,
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <Stack spacing={0.4}>
                        <Typography fontWeight={800}>{item.label}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {item.counter}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  </Grid>
                ))}
              </Grid>
            </SectionCard>

            <SectionCard
              title="Последние операции"
              subtitle="Сводка по самым свежим операциям и их состояниям."
            >
              <Stack spacing={1.2}>
                {allOperations.slice(0, 5).map((operation) => {
                  const club = getClubById(operation.clubId)
                  const partner = getPartnerById(operation.partnerId)

                  return (
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      key={operation.id}
                      spacing={2}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.72)',
                        border: '1px solid rgba(15,23,42,0.06)',
                        borderRadius: '18px',
                        p: 1.75,
                      }}
                    >
                      <Stack spacing={0.45}>
                        <Typography fontWeight={800}>{operation.id}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {club.title} • {partner.title} • {operation.accountId}
                        </Typography>
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        <StatusChip status={operation.paymentStatus} />
                        <StatusChip status={operation.creditStatus} />
                      </Stack>
                    </Stack>
                  )
                })}
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={3}>
            <SectionCard
              title="Ошибки интеграций"
              subtitle="Сигналы по API клубов и состоянию процессингов."
              action={<Chip color="warning" label="Требуют внимания" />}
            >
              <Stack spacing={1.25}>
                {integrationAlerts.map((item) => (
                  <Alert key={item.id} severity={item.severity} sx={{ borderRadius: '18px' }}>
                    <Typography fontWeight={800}>{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <Typography color="text.secondary" mt={0.5} variant="body2">
                      {item.meta}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </SectionCard>

            <SectionCard
              title="Требуют ручной обработки"
              subtitle="Кейсы, по которым оператор должен принять решение."
            >
              <Stack spacing={1.2}>
                {manualItems.map((operation) => (
                  <ButtonBase
                    key={operation.id}
                    onClick={() => {
                      setSelectedOperationId(operation.id)
                      setDetailTab('summary')
                      navigate('/owner/payments')
                    }}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.72)',
                      border: '1px solid rgba(15,23,42,0.06)',
                      borderRadius: '16px',
                      justifyContent: 'flex-start',
                      p: 1.5,
                      textAlign: 'left',
                    }}
                  >
                    <Stack spacing={0.6}>
                      <Typography fontWeight={800}>{operation.id}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {operation.issueNote}
                      </Typography>
                      <StatusChip status={operation.creditStatus} />
                    </Stack>
                  </ButtonBase>
                ))}
              </Stack>
            </SectionCard>

            <SectionCard title="Операционные алерты" subtitle="Сводка по проблемным событиям в текущем окне.">
              <Stack spacing={1.25}>
                {ownerAlerts.map((item) => (
                  <Alert key={item.id} severity={item.severity} sx={{ borderRadius: '18px' }}>
                    <Typography fontWeight={800}>{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <Typography color="text.secondary" mt={0.5} variant="body2">
                      {item.meta}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
