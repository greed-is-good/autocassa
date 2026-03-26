import {
  AccountBalanceWalletRounded,
  ErrorRounded,
  RocketLaunchRounded,
  TaskAltRounded,
} from '@mui/icons-material'
import {
  ButtonBase,
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

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Всего в системе"
            icon={<AccountBalanceWalletRounded />}
            label="Операций в системе"
            value={allOperations.length.toString()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Общий объём"
            icon={<RocketLaunchRounded />}
            label="Сумма пополнений"
            tone="brand"
            value={metrics.totalAmount}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Подтверждено клубами"
            icon={<TaskAltRounded />}
            label="Успешные зачисления"
            tone="success"
            value={metrics.successful.toString()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Требуют внимания"
            icon={<ErrorRounded />}
            label="Исключения"
            tone="danger"
            value={metrics.exceptions.toString()}
          />
        </Grid>
      </Grid>

      <SectionCard
        eyebrow="Владелец"
        title="Быстрые переходы"
        subtitle="Основные разделы системы"
      >
        <Grid container spacing={1.5}>
          {ownerQuickLinks.map((item) => (
            <Grid key={item.id} size={{ xs: 12, md: 6, xl: 3 }}>
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

      <SectionCard title="Последние операции" subtitle="Последние события">
        <Stack spacing={1.2}>
          {allOperations.slice(0, 5).map((operation) => {
            const club = getClubById(operation.clubId)
            const partner = getPartnerById(operation.partnerId)

            return (
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
                  borderRadius: '18px',
                  justifyContent: 'flex-start',
                  p: 1.75,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  spacing={2}
                  width="100%"
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
              </ButtonBase>
            )
          })}
        </Stack>
      </SectionCard>
    </Stack>
  )
}
