import {
  AccessTimeRounded,
  ChatRounded,
  CheckCircleRounded,
  ContentCopyRounded,
  LinkRounded,
  OpenInNewRounded,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'

import { usePrototype } from '../../app/PrototypeContext'
import { OperationTimeline } from '../../components/OperationTimeline'
import { SectionCard } from '../../components/SectionCard'
import { StatusChip } from '../../components/StatusChip'
import {
  formatAmount,
  getClubById,
  getProcessingById,
  playerScenarioMeta,
} from '../../data/mockData'
import type { PaymentScenario } from '../../types'

const scenarios: PaymentScenario[] = [
  'awaiting',
  'expired',
  'payment_error',
  'processing',
  'credit_error',
  'manual',
  'success',
]

export const PlayerStatusPage = () => {
  const {
    currentPlayerOperation,
    openModal,
    setChatOpen,
    setStatusScenario,
    statusScenario,
  } = usePrototype()

  const club = getClubById(currentPlayerOperation.clubId)
  const processing = getProcessingById(currentPlayerOperation.processingId)
  const scenarioMeta = playerScenarioMeta[statusScenario]

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <SectionCard
        eyebrow="Игрок"
        title="Ожидание оплаты / Статус платежа"
        subtitle="Главный рабочий экран после создания операции: отслеживание оплаты, статуса зачисления и связи с администратором."
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={2.5}>
              <Box
                sx={{
                  alignItems: 'center',
                  background:
                    'linear-gradient(135deg, rgba(31,115,242,0.12), rgba(255,255,255,0.8))',
                  border: '1px solid rgba(31,115,242,0.12)',
                  borderRadius: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'space-between',
                  p: 2.5,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="h3">{currentPlayerOperation.id}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <StatusChip status={currentPlayerOperation.paymentStatus} />
                    <StatusChip status={currentPlayerOperation.creditStatus} />
                  </Stack>
                </Stack>
                <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={1}>
                  <Chip
                    icon={<AccessTimeRounded />}
                    label={`Ссылка активна: ${currentPlayerOperation.linkExpiresIn}`}
                    variant="outlined"
                  />
                  <Typography color="text.secondary" variant="body2">
                    {scenarioMeta.description}
                  </Typography>
                </Stack>
              </Box>

              <Alert
                severity={scenarioMeta.highlight}
                sx={{ borderRadius: '20px' }}
                action={
                  <Button
                    color="inherit"
                    onClick={() => {
                      if (statusScenario === 'expired') {
                        openModal({
                          type: 'paymentExpired',
                          operationId: currentPlayerOperation.id,
                        })
                        return
                      }

                      if (statusScenario === 'success') {
                        openModal({
                          type: 'paymentSuccess',
                          operationId: currentPlayerOperation.id,
                        })
                        return
                      }

                      if (statusScenario === 'credit_error') {
                        openModal({
                          type: 'accrualError',
                          operationId: currentPlayerOperation.id,
                        })
                        return
                      }

                      if (statusScenario === 'manual') {
                        openModal({
                          type: 'manualAdjustment',
                          operationId: currentPlayerOperation.id,
                        })
                        return
                      }

                      setChatOpen(true)
                    }}
                  >
                    Показать окно
                  </Button>
                }
              >
                <Typography fontWeight={800}>{scenarioMeta.title}</Typography>
              </Alert>

              <SectionCard
                title="Карточка операции"
                subtitle="Игрок видит только необходимые данные по конкретному пополнению."
                action={
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Скопировать ссылку">
                      <IconButton>
                        <ContentCopyRounded />
                      </IconButton>
                    </Tooltip>
                    <Button startIcon={<OpenInNewRounded />} variant="contained">
                      {scenarioMeta.actionLabel}
                    </Button>
                  </Stack>
                }
              >
                <Grid container spacing={2}>
                  {[
                    ['Клуб', `${club.title} • ${club.appName}`],
                    ['Номер аккаунта', currentPlayerOperation.accountId],
                    ['Сумма', `${formatAmount(currentPlayerOperation.amount, currentPlayerOperation.currency)} ${currentPlayerOperation.currency}`],
                    ['Процессинг', processing.title],
                    ['Ссылка на оплату', currentPlayerOperation.paymentLink],
                    ['Таймер жизни ссылки', currentPlayerOperation.linkExpiresIn],
                  ].map(([label, value]) => (
                    <Grid key={label} size={{ xs: 12, md: 6 }}>
                      <Stack
                        spacing={0.4}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.72)',
                          border: '1px solid rgba(15,23,42,0.06)',
                          borderRadius: '18px',
                          p: 1.75,
                        }}
                      >
                        <Typography color="text.secondary" variant="body2">
                          {label}
                        </Typography>
                        <Typography fontWeight={800}>{value}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </SectionCard>

              {currentPlayerOperation.issueNote ? (
                <Alert severity="warning" sx={{ borderRadius: '18px' }}>
                  {currentPlayerOperation.issueNote}
                </Alert>
              ) : null}

              <SectionCard
                title="Статус-линия операции"
                subtitle="Одна и та же зона экрана подходит для демонстрации успешного сценария и исключений MVP."
              >
                <OperationTimeline items={currentPlayerOperation.timeline} />
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2.5}>
              <SectionCard
                title="Демо-состояния"
                subtitle="Можно быстро переключать альтернативные статусы без повторного создания операции."
              >
                <Stack spacing={1.2}>
                  {scenarios.map((scenario) => {
                    const item = playerScenarioMeta[scenario]
                    const isActive = scenario === statusScenario

                    return (
                      <Button
                        color={isActive ? 'primary' : 'inherit'}
                        key={scenario}
                        onClick={() => setStatusScenario(scenario)}
                        sx={{ justifyContent: 'space-between', py: 1.3 }}
                        variant={isActive ? 'contained' : 'outlined'}
                      >
                        <Stack alignItems="flex-start" spacing={0.3}>
                          <Typography fontWeight={800}>{item.title}</Typography>
                          <Typography
                            color={isActive ? 'rgba(255,255,255,0.84)' : 'text.secondary'}
                            variant="body2"
                          >
                            {item.paymentStatus} / {item.creditStatus}
                          </Typography>
                        </Stack>
                      </Button>
                    )
                  })}
                </Stack>
              </SectionCard>

              <SectionCard title="Поддержка по операции" subtitle="Чат можно открыть даже если оплата ещё не завершена.">
                <Stack spacing={1.5}>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <Chip icon={<LinkRounded />} label={processing.code} />
                    <Chip icon={<CheckCircleRounded />} label={club.title} variant="outlined" />
                  </Stack>
                  <Divider />
                  <Button
                    color="secondary"
                    onClick={() => setChatOpen(true)}
                    startIcon={<ChatRounded />}
                    variant="contained"
                  >
                    Открыть чат с администратором
                  </Button>
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>
        </Grid>
      </SectionCard>
    </Stack>
  )
}
