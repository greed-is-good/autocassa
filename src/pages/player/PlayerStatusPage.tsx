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
        subtitle="Статус оплаты и зачисления"
      >
        <Stack spacing={2.5}>
          <Box
            sx={{
              backgroundColor: 'rgba(15,23,42,0.03)',
              border: '1px dashed rgba(15,23,42,0.10)',
              borderRadius: '20px',
              px: 2,
              py: 1.6,
            }}
          >
            <Stack
              alignItems={{ xs: 'flex-start', xl: 'center' }}
              direction={{ xs: 'column', xl: 'row' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Stack spacing={0.35}>
                <Typography
                  color="text.secondary"
                  fontSize={12}
                  fontWeight={800}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  Служебный режим
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Сценарии ниже только для демонстрации
                </Typography>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {scenarios.map((scenario) => {
                  const item = playerScenarioMeta[scenario]
                  const isActive = scenario === statusScenario

                  return (
                    <Button
                      color="inherit"
                      key={scenario}
                      onClick={() => setStatusScenario(scenario)}
                      size="small"
                      sx={{
                        backgroundColor: isActive
                          ? 'rgba(31,115,242,0.08)'
                          : 'rgba(255,255,255,0.7)',
                        borderColor: isActive
                          ? 'rgba(31,115,242,0.22)'
                          : 'rgba(15,23,42,0.10)',
                        color: isActive ? 'primary.main' : 'text.secondary',
                        fontWeight: 700,
                      }}
                      variant="outlined"
                    >
                      {item.title}
                    </Button>
                  )
                })}
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack spacing={2.5}>
                <SectionCard
                  title="Карточка операции"
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
                      ['Приложение', club.title],
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
                >
                  <OperationTimeline items={currentPlayerOperation.timeline} />
                </SectionCard>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={2.5}>
                <SectionCard
                  title="Статус по операции"
                  action={
                    <Chip
                      icon={<AccessTimeRounded />}
                      label={`Ссылка: ${currentPlayerOperation.linkExpiresIn}`}
                      variant="outlined"
                    />
                  }
                >
                  <Stack spacing={2}>
                    <Stack spacing={1}>
                      <Typography variant="h3">{currentPlayerOperation.id}</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        <StatusChip status={currentPlayerOperation.paymentStatus} />
                        <StatusChip status={currentPlayerOperation.creditStatus} />
                      </Stack>
                    </Stack>

                    <Stack spacing={1.1}>
                      {[
                        ['Приложение', club.title],
                        ['Процессинг', processing.code],
                        ['Статус', `${scenarioMeta.paymentStatus} / ${scenarioMeta.creditStatus}`],
                      ].map(([label, value]) => (
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          key={label}
                          spacing={2}
                        >
                          <Typography color="text.secondary">{label}</Typography>
                          <Typography fontWeight={800} textAlign="right">
                            {value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Alert
                      severity={scenarioMeta.highlight}
                      sx={{ borderRadius: '18px' }}
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
                          Подробнее
                        </Button>
                      }
                    >
                      <Typography fontWeight={800}>{scenarioMeta.title}</Typography>
                    </Alert>
                  </Stack>
                </SectionCard>

                <SectionCard title="Поддержка">
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
        </Stack>
      </SectionCard>
    </Stack>
  )
}
