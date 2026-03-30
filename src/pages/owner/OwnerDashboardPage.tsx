import {
  AccountBalanceWalletRounded,
  DescriptionRounded,
  TaskAltRounded,
} from '@mui/icons-material'
import {
  ButtonBase,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  getProcessingById,
  ownerQuickLinks,
} from '../../data/mockData'
import { StatusChip } from '../../components/StatusChip'

const CURRENT_MONTH = '.03.2026'

export const OwnerDashboardPage = () => {
  const navigate = useNavigate()
  const { allOperations, setDetailTab, setSelectedOperationId } = usePrototype()

  const monthOperations = useMemo(
    () => allOperations.filter((operation) => operation.createdAt.includes(CURRENT_MONTH)),
    [allOperations],
  )

  const processingTotals = useMemo(() => {
    const grouped = new Map<string, { title: string; total: number; currency: string }>()
    monthOperations.forEach((operation) => {
      const key = `${operation.processingId}-${operation.currency}`
      const bucket = grouped.get(key) ?? {
        title: getProcessingById(operation.processingId).title,
        total: 0,
        currency: operation.currency,
      }
      bucket.total += operation.amount
      grouped.set(key, bucket)
    })
    return Array.from(grouped.values())
  }, [monthOperations])

  const currencyTotals = useMemo(() => {
    const grouped = new Map<string, number>()
    monthOperations.forEach((operation) => {
      grouped.set(operation.currency, (grouped.get(operation.currency) ?? 0) + operation.amount)
    })
    return Array.from(grouped.entries())
  }, [monthOperations])

  const successfulWithReceipt = useMemo(
    () =>
      monthOperations.filter(
        (operation) =>
          operation.creditStatus === 'Зачислено' && !!operation.receiptAttachment,
      ).length,
    [monthOperations],
  )

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            hint="Март 2026"
            icon={<AccountBalanceWalletRounded />}
            label="Всего пополнений за месяц"
            value={monthOperations.length.toString()}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            hint="Подтверждено клубами"
            icon={<TaskAltRounded />}
            label="Успешные зачисления"
            tone="success"
            value={
              monthOperations
                .filter((operation) => operation.creditStatus === 'Зачислено')
                .length.toString()
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            hint="Receipt review"
            icon={<DescriptionRounded />}
            label="Успешные операции с чеком"
            tone="brand"
            value={successfulWithReceipt.toString()}
          />
        </Grid>
      </Grid>

      <SectionCard eyebrow="Владелец" title="Быстрые переходы" subtitle="Основные разделы системы">
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard title="Суммы по процессингам" subtitle="Разбивка по маршрутам и валютам">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Процессинг</TableCell>
                    <TableCell>Валюта</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processingTotals.map((item) => (
                    <TableRow key={`${item.title}-${item.currency}`}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.currency}</TableCell>
                      <TableCell align="right">
                        {formatAmount(item.total, item.currency as 'RUB' | 'KZT' | 'USDT')}{' '}
                        {item.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard title="Суммы по валютам" subtitle="Сводка по валютным потокам">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Валюта</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currencyTotals.map(([currency, total]) => (
                    <TableRow key={currency}>
                      <TableCell>{currency}</TableCell>
                      <TableCell align="right">
                        {formatAmount(total, currency as 'RUB' | 'KZT' | 'USDT')} {currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard title="Последние операции" subtitle="Журнал последних событий">
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
