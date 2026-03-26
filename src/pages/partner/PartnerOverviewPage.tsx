import {
  ErrorOutlineRounded,
  PaymentsRounded,
  TaskAltRounded,
  TrendingUpRounded,
} from '@mui/icons-material'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { usePrototype } from '../../app/PrototypeContext'
import { MetricCard } from '../../components/MetricCard'
import { OperationsTable } from '../../components/OperationsTable'
import { SectionCard } from '../../components/SectionCard'
import { formatAmount, getClubById, partners } from '../../data/mockData'

const partner = partners[0]

export const PartnerOverviewPage = () => {
  const { allOperations } = usePrototype()
  const [dateFilter, setDateFilter] = useState('all')
  const [clubFilter, setClubFilter] = useState('all')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const partnerOperations = useMemo(
    () =>
      allOperations.filter((operation) => operation.partnerId === partner.id).filter((operation) => {
        const matchesDate =
          dateFilter === 'all' || operation.createdAt.startsWith(dateFilter)
        const matchesClub = clubFilter === 'all' || operation.clubId === clubFilter
        const matchesCurrency =
          currencyFilter === 'all' || operation.currency === currencyFilter
        const matchesStatus =
          statusFilter === 'all' ||
          operation.paymentStatus === statusFilter ||
          operation.creditStatus === statusFilter

        return matchesDate && matchesClub && matchesCurrency && matchesStatus
      }),
    [allOperations, clubFilter, currencyFilter, dateFilter, statusFilter],
  )

  const metrics = useMemo(() => {
    const totalAmount = partnerOperations.reduce(
      (accumulator, operation) => accumulator + operation.amount,
      0,
    )

    return {
      operations: partnerOperations.length.toString(),
      amount: `${formatAmount(totalAmount, 'RUB')} RUB`,
      success: partnerOperations
        .filter((operation) => operation.creditStatus === 'Зачислено')
        .length.toString(),
      errors: partnerOperations
        .filter(
          (operation) =>
            operation.creditStatus === 'Ошибка зачисления' ||
            operation.creditStatus === 'Требует ручной обработки',
        )
        .length.toString(),
    }
  }, [partnerOperations])

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Только свой контур"
            icon={<PaymentsRounded />}
            label="Количество операций"
            value={metrics.operations}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="По текущему фильтру"
            icon={<TrendingUpRounded />}
            label="Сумма пополнений"
            tone="brand"
            value={metrics.amount}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Зачислено"
            icon={<TaskAltRounded />}
            label="Успешные зачисления"
            tone="success"
            value={metrics.success}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 3 }}>
          <MetricCard
            hint="Ошибки и ручная обработка"
            icon={<ErrorOutlineRounded />}
            label="Операции с ошибками"
            tone="danger"
            value={metrics.errors}
          />
        </Grid>
      </Grid>

      <SectionCard
        eyebrow="Партнёр"
        title="Платежи партнёра"
        subtitle="Только свои операции"
      >
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Дата</InputLabel>
                <Select
                  label="Дата"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                >
                  <MenuItem value="all">Все даты</MenuItem>
                  <MenuItem value="25.03.2026">25.03.2026</MenuItem>
                  <MenuItem value="24.03.2026">24.03.2026</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Клуб</InputLabel>
                <Select
                  label="Клуб"
                  value={clubFilter}
                  onChange={(event) => setClubFilter(event.target.value)}
                >
                  <MenuItem value="all">Все клубы</MenuItem>
                  {partner.allowedClubIds.map((clubId) => (
                    <MenuItem key={clubId} value={clubId}>
                      {getClubById(clubId).title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Валюта</InputLabel>
                <Select
                  label="Валюта"
                  value={currencyFilter}
                  onChange={(event) => setCurrencyFilter(event.target.value)}
                >
                  <MenuItem value="all">Все валюты</MenuItem>
                  {partner.allowedCurrencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  label="Статус"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value="Ожидает оплаты">Ожидает оплаты</MenuItem>
                  <MenuItem value="Оплачен">Оплачен</MenuItem>
                  <MenuItem value="Зачислено">Зачислено</MenuItem>
                  <MenuItem value="Ошибка зачисления">Ошибка зачисления</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <OperationsTable operations={partnerOperations} />
        </Stack>
      </SectionCard>
    </Stack>
  )
}
