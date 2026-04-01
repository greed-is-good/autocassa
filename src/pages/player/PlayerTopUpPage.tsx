import {
  CampaignRounded,
  ChatRounded,
  CloseRounded,
  DescriptionRounded,
  LinkRounded,
  PaymentsRounded,
  RefreshRounded,
  ScheduleRounded,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef } from 'react'

import { usePrototype } from '../../app/PrototypeContext'
import { CurrencySvgIcon } from '../../components/CurrencySvgIcon'
import { OperationTimeline } from '../../components/OperationTimeline'
import { SectionCard } from '../../components/SectionCard'
import { StatusChip } from '../../components/StatusChip'
import {
  calculateChipAmount,
  clubs,
  formatAmount,
  formatChipAmount,
  getClubById,
  getCurrencyAvailability,
  getPlayerPartner,
  getProcessingById,
  playerScenarioMeta,
} from '../../data/mockData'
import type { Currency, PaymentScenario } from '../../types'

const scenariosByMode: Record<'auto' | 'receipt_review', PaymentScenario[]> = {
  auto: [
    'awaiting',
    'expired',
    'payment_error',
    'processing',
    'credit_error',
    'manual',
    'success',
  ],
  receipt_review: [
    'receipt_upload',
    'receipt_review',
    'processing',
    'credit_error',
    'manual',
    'success',
  ],
}

const formatReceiptSize = (size: number) =>
  `${Math.max(1, Math.round(size / 1024))} KB`

export const PlayerTopUpPage = () => {
  const receiptInputRef = useRef<HTMLInputElement | null>(null)
  const {
    currentPlayerOperation,
    dismissPlayerPromo,
    playerDraft,
    playerOperationCreated,
    playerPromoDismissed,
    playerReceiptAttachment,
    resetPlayerOperation,
    setChatOpen,
    setPlayerDraft,
    setStatusScenario,
    startPlayerOperation,
    statusScenario,
    uploadPlayerReceipt,
  } = usePrototype()

  const partner = getPlayerPartner()
  const selectedClub = getClubById(playerDraft.clubId)
  const currencyOptions = getCurrencyAvailability(selectedClub.id, partner.id)
  const selectedCurrency =
    currencyOptions.find((item) => item.currency === playerDraft.currency) ??
    currencyOptions[0]
  const selectedProcessing = getProcessingById(selectedCurrency.binding.processingId)
  const chipAmount = calculateChipAmount(
    Number(playerDraft.amount) || 0,
    playerDraft.clubId,
    playerDraft.currency,
  )

  const appCards = useMemo(
    () =>
      clubs.map((club) => {
        if (club.apiStatus === 'Вне MVP') {
          return { club, enabled: false, reason: 'Вне MVP' }
        }

        if (!partner.allowedClubIds.includes(club.id)) {
          return { club, enabled: false, reason: 'Недоступно партнёру' }
        }

        return { club, enabled: true }
      }),
    [partner.allowedClubIds],
  )

  const isClubNumberValid =
    selectedClub.apiStatus === 'API подключено' &&
    partner.allowedClubIds.includes(selectedClub.id) &&
    playerDraft.clubNumber.trim() === selectedClub.clubNumber

  const canContinue =
    isClubNumberValid &&
    playerDraft.accountId.trim().length > 0 &&
    Number(playerDraft.amount) > 0 &&
    !!selectedCurrency.enabled &&
    playerDraft.acceptResponsibility &&
    playerDraft.acceptTerms

  useEffect(() => {
    if (!playerOperationCreated || typeof window === 'undefined') {
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [playerOperationCreated])

  const selectClub = (clubId: string) => {
    const club = clubs.find((item) => item.id === clubId)

    if (!club) {
      return
    }

    const nextCurrency =
      getCurrencyAvailability(club.id, partner.id).find((item) => item.enabled)
        ?.currency ?? playerDraft.currency

    setPlayerDraft((previous) => ({
      ...previous,
      clubId: club.id,
      clubNumber: club.clubNumber,
      currency: nextCurrency,
    }))
  }

  const selectCurrency = (currency: Currency) => {
    setPlayerDraft((previous) => ({ ...previous, currency }))
  }

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      event.target.value = ''
      return
    }

    uploadPlayerReceipt({
      id: `receipt-${Date.now()}`,
      name: file.name,
      size: formatReceiptSize(file.size),
      uploadedAt: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })

    event.target.value = ''
  }

  if (playerOperationCreated) {
    return (
      <Stack className="autocassa-fade-up" spacing={3}>
        <SectionCard
          eyebrow="Игрок"
          title={`Операция ${currentPlayerOperation.id}`}
          action={
            <Button
              onClick={resetPlayerOperation}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Новая операция
            </Button>
          }
        >
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="body2">
                Демо-сценарии
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {scenariosByMode[selectedProcessing.confirmationMode].map((scenario) => (
                  <Button
                    color="inherit"
                    key={scenario}
                    onClick={() => setStatusScenario(scenario)}
                    size="small"
                    sx={{
                      backgroundColor:
                        scenario === statusScenario
                          ? 'rgba(15,23,42,0.08)'
                          : 'rgba(255,255,255,0.78)',
                      border: '1px solid rgba(15,23,42,0.08)',
                    }}
                    variant={scenario === statusScenario ? 'contained' : 'text'}
                  >
                    {playerScenarioMeta[scenario].title}
                  </Button>
                ))}
              </Stack>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, xl: 7 }}>
                <SectionCard
                  title={
                    selectedProcessing.confirmationMode === 'receipt_review'
                      ? 'Оплата по реквизитам'
                      : 'Оплата'
                  }
                  action={<StatusChip status={currentPlayerOperation.paymentStatus} />}
                >
                  <Stack spacing={1.75}>
                    <Typography fontWeight={800}>
                      {formatAmount(
                        currentPlayerOperation.amount,
                        currentPlayerOperation.currency,
                      )}{' '}
                      {currentPlayerOperation.currency} •{' '}
                      {formatChipAmount(currentPlayerOperation.chipAmount)} фишек
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {selectedClub.title} • {currentPlayerOperation.accountId} •{' '}
                      {selectedProcessing.title}
                    </Typography>

                    {selectedProcessing.confirmationMode === 'auto' ? (
                      <>
                        <Alert
                          icon={<LinkRounded />}
                          severity="info"
                          sx={{ borderRadius: '18px' }}
                        >
                          Ссылка активна {currentPlayerOperation.linkExpiresIn}
                        </Alert>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                          <Button
                            onClick={() =>
                              window.open(currentPlayerOperation.paymentLink, '_blank')
                            }
                            startIcon={<LinkRounded />}
                            variant="contained"
                          >
                            Открыть оплату
                          </Button>
                          <Button
                            onClick={() => setChatOpen(true)}
                            startIcon={<ChatRounded />}
                            variant="outlined"
                          >
                            Поддержка
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Alert
                          icon={<DescriptionRounded />}
                          severity="warning"
                          sx={{ borderRadius: '18px' }}
                        >
                          {selectedProcessing.reviewEtaLabel}
                        </Alert>
                        <Grid container spacing={1.2}>
                          {selectedProcessing.bankDetails?.map((item) => (
                            <Grid key={item.label} size={{ xs: 12, md: 6 }}>
                              <Box
                                sx={{
                                  backgroundColor: 'rgba(255,255,255,0.72)',
                                  border: '1px solid rgba(15,23,42,0.06)',
                                  borderRadius: '16px',
                                  p: 1.5,
                                }}
                              >
                                <Typography color="text.secondary" variant="body2">
                                  {item.label}
                                </Typography>
                                <Typography fontWeight={800}>{item.value}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                        <input
                          accept="application/pdf,.pdf"
                          hidden
                          ref={receiptInputRef}
                          type="file"
                          onChange={handleReceiptChange}
                        />
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                          <Button
                            onClick={() => receiptInputRef.current?.click()}
                            startIcon={<DescriptionRounded />}
                            variant="contained"
                          >
                            {playerReceiptAttachment
                              ? 'Заменить PDF-чек'
                              : 'Прикрепить PDF-чек'}
                          </Button>
                          <Button
                            onClick={() => setChatOpen(true)}
                            startIcon={<ChatRounded />}
                            variant="outlined"
                          >
                            Поддержка
                          </Button>
                        </Stack>
                        {playerReceiptAttachment ? (
                          <Typography color="text.secondary" variant="body2">
                            {playerReceiptAttachment.name} • {playerReceiptAttachment.size}
                          </Typography>
                        ) : null}
                      </>
                    )}
                  </Stack>
                </SectionCard>
              </Grid>

              <Grid size={{ xs: 12, xl: 5 }}>
                <SectionCard
                  title="Статус операции"
                  action={
                    <Chip
                      icon={<ScheduleRounded />}
                      label={`Ссылка: ${currentPlayerOperation.linkExpiresIn}`}
                      variant="outlined"
                    />
                  }
                >
                  <Stack spacing={2}>
                    <Typography variant="h3">{currentPlayerOperation.id}</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      <StatusChip status={currentPlayerOperation.paymentStatus} />
                      <StatusChip status={currentPlayerOperation.creditStatus} />
                      {currentPlayerOperation.receiptRequired ? (
                        <Chip
                          color={
                            currentPlayerOperation.receiptStatus === 'approved'
                              ? 'success'
                              : currentPlayerOperation.receiptStatus === 'under_review'
                                ? 'info'
                                : 'warning'
                          }
                          label={
                            currentPlayerOperation.receiptStatus === 'approved'
                              ? 'Чек подтверждён'
                              : currentPlayerOperation.receiptStatus === 'under_review'
                                ? 'Чек на сверке'
                                : 'Ожидает чек'
                          }
                          size="small"
                        />
                      ) : null}
                    </Stack>

                    <Box
                      sx={{
                        backgroundColor: 'rgba(31,115,242,0.06)',
                        borderRadius: '18px',
                        p: 1.6,
                      }}
                    >
                      <Typography fontWeight={800}>
                        {playerScenarioMeta[statusScenario].title}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {playerScenarioMeta[statusScenario].description}
                      </Typography>
                    </Box>

                    {currentPlayerOperation.issueNote ? (
                      <Alert severity="warning" sx={{ borderRadius: '18px' }}>
                        {currentPlayerOperation.issueNote}
                      </Alert>
                    ) : null}

                    <OperationTimeline items={currentPlayerOperation.timeline} />
                  </Stack>
                </SectionCard>
              </Grid>
            </Grid>
          </Stack>
        </SectionCard>
      </Stack>
    )
  }

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      {!playerPromoDismissed ? (
        <Box
          className="autocassa-panel"
          sx={{
            background: 'linear-gradient(135deg, #0b3d91, #1f73f2)',
            color: 'white',
            p: 2.25,
          }}
        >
          <Stack
            alignItems={{ xs: 'flex-start', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={1.25}>
              <CampaignRounded />
              <Stack spacing={0.25}>
                <Typography fontWeight={800}>Пополнение баланса 24/7</Typography>
                <Typography sx={{ opacity: 0.88 }} variant="body2">
                  Состояние операции и черновик формы сохраняются после перезагрузки
                </Typography>
              </Stack>
            </Stack>
            <IconButton onClick={dismissPlayerPromo} sx={{ color: 'white' }}>
              <CloseRounded />
            </IconButton>
          </Stack>
        </Box>
      ) : null}

      <ButtonBase
        disableRipple
        onClick={() => setChatOpen(true)}
        sx={{
          backgroundColor: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(15,23,42,0.08)',
          borderRadius: '16px',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          p: 1,
          textAlign: 'left',
          width: '100%',
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(31,115,242,0.08)',
                borderRadius: '10px',
                color: 'primary.main',
                display: 'flex',
                height: 32,
                justifyContent: 'center',
                width: 32,
                flexShrink: 0,
              }}
            >
              <ChatRounded fontSize="small" />
            </Box>
            <Stack spacing={0.15} sx={{ minWidth: 0 }}>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Box
                  sx={{
                    backgroundColor: '#16a34a',
                    borderRadius: '999px',
                    height: 8,
                    position: 'relative',
                    width: 8,
                    '&::after': {
                      animation: 'autocassa-chat-pulse 1.8s ease-out infinite',
                      backgroundColor: 'rgba(22,163,74,0.24)',
                      borderRadius: '999px',
                      content: '""',
                      inset: -4,
                      position: 'absolute',
                    },
                    '@keyframes autocassa-chat-pulse': {
                      '0%': {
                        opacity: 0.9,
                        transform: 'scale(0.7)',
                      },
                      '70%': {
                        opacity: 0,
                        transform: 'scale(1.8)',
                      },
                      '100%': {
                        opacity: 0,
                        transform: 'scale(1.8)',
                      },
                    },
                  }}
                />
                <Typography color="success.main" fontWeight={800} variant="caption">
                  Администратор онлайн
                </Typography>
              </Stack>
              <Typography fontWeight={800} noWrap variant="body2">
                Приветствуем, администратор на связи
              </Typography>
            </Stack>
          </Stack>
          <Chip
            color="success"
            label="Чат"
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          />
        </Stack>
      </ButtonBase>

      <SectionCard eyebrow="Игрок" title="Пополнение баланса">
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.25,
            }}
          >
            {appCards.map(({ club, enabled, reason }) => (
              <Box key={club.id} sx={{ width: { xs: 92, sm: 100 } }}>
                <ButtonBase
                  disabled={!enabled}
                  onClick={() => selectClub(club.id)}
                  sx={{
                    alignItems: 'flex-start',
                    backgroundColor:
                      club.id === playerDraft.clubId
                        ? 'rgba(31,115,242,0.08)'
                        : 'rgba(255,255,255,0.72)',
                    border: '1px solid',
                    borderColor:
                      club.id === playerDraft.clubId
                        ? 'primary.main'
                        : 'rgba(15,23,42,0.08)',
                    borderRadius: '16px',
                    height: '100%',
                    justifyContent: 'flex-start',
                    opacity: enabled ? 1 : 0.58,
                    p: 1,
                    textAlign: 'left',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    minHeight: { xs: 92, sm: 100 },
                  }}
                >
                  <Stack
                    justifyContent="space-between"
                    spacing={0.75}
                    sx={{ height: '100%' }}
                    width="100%"
                  >
                    <Stack alignItems="flex-start" direction="row" justifyContent="space-between">
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor:
                            club.id === playerDraft.clubId
                              ? 'primary.main'
                              : 'rgba(15,23,42,0.08)',
                          borderRadius: '10px',
                          color: club.id === playerDraft.clubId ? 'white' : 'text.primary',
                          display: 'flex',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          height: 30,
                          justifyContent: 'center',
                          width: 30,
                        }}
                      >
                        {club.iconKey}
                      </Box>
                      {club.id === playerDraft.clubId ? (
                        <Box
                          sx={{
                            backgroundColor: 'primary.main',
                            borderRadius: '999px',
                            height: 8,
                            width: 8,
                            mt: 0.5,
                          }}
                        />
                      ) : null}
                    </Stack>
                    <Stack spacing={0.15}>
                      <Typography
                        fontWeight={800}
                        sx={{ fontSize: '0.78rem', lineHeight: 1.15 }}
                      >
                        {club.title}
                      </Typography>
                      {!enabled && reason ? (
                        <Typography color="text.secondary" sx={{ lineHeight: 1.1 }} variant="caption">
                          {reason}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                </ButtonBase>
              </Box>
            ))}
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                error={!isClubNumberValid}
                fullWidth
                helperText={isClubNumberValid ? ' ' : 'Клуб не подключен к системе'}
                label="Номер клуба"
                value={playerDraft.clubNumber}
                onChange={(event) =>
                  setPlayerDraft((previous) => ({
                    ...previous,
                    clubNumber: event.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Номер аккаунта"
                value={playerDraft.accountId}
                onChange={(event) =>
                  setPlayerDraft((previous) => ({
                    ...previous,
                    accountId: event.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>

          <Stack spacing={1}>
            <Typography fontWeight={800}>Валюта операции</Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {currencyOptions.map((option) => (
                <Box key={option.currency} sx={{ width: { xs: 80, sm: 88 } }}>
                  <ButtonBase
                    disableRipple
                    disabled={!option.enabled}
                    onClick={() => selectCurrency(option.currency)}
                    sx={{
                      alignItems: 'stretch',
                      backgroundColor:
                        option.currency === playerDraft.currency
                          ? 'rgba(31,115,242,0.08)'
                          : 'rgba(255,255,255,0.72)',
                      border: '1px solid',
                      borderColor:
                        option.currency === playerDraft.currency
                          ? 'primary.main'
                          : 'rgba(15,23,42,0.08)',
                      borderRadius: '16px',
                      height: '100%',
                      justifyContent: 'center',
                      aspectRatio: '1 / 1',
                      minHeight: { xs: 80, sm: 88 },
                      opacity: option.enabled ? 1 : 0.52,
                      p: 0.9,
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    <Stack alignItems="center" justifyContent="center" spacing={0.4} width="100%">
                      <CurrencySvgIcon
                        currency={option.currency}
                        muted={!option.enabled}
                        size={26}
                      />
                      <Typography fontWeight={800} variant="body2">
                        {option.currency}
                      </Typography>
                      {option.currency === playerDraft.currency ? (
                        <Box
                          sx={{
                            backgroundColor: 'primary.main',
                            borderRadius: '999px',
                            height: 6,
                            width: 6,
                          }}
                        />
                      ) : option.enabled ? null : (
                        <Typography color="text.secondary" variant="caption">
                          Выкл
                        </Typography>
                      )}
                    </Stack>
                  </ButtonBase>
                </Box>
              ))}
            </Box>
            <Typography color="text.secondary" variant="caption">
              {selectedProcessing.confirmationMode === 'receipt_review'
                ? 'Оплата по реквизитам и PDF-чек'
                : `Процессинг: ${selectedProcessing.title}`}
            </Typography>
          </Stack>

          <TextField
            fullWidth
            label="Сумма пополнения"
            value={playerDraft.amount}
            onChange={(event) =>
              setPlayerDraft((previous) => ({
                ...previous,
                amount: event.target.value.replace(/[^\d.]/g, ''),
              }))
            }
          />

          <Box
            sx={{
              backgroundColor: 'rgba(31,115,242,0.06)',
              border: '1px solid rgba(31,115,242,0.12)',
              borderRadius: '20px',
              p: 2,
            }}
          >
            <Stack
              alignItems={{ xs: 'flex-start', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Typography fontWeight={800}>
                Будет зачислено {formatChipAmount(chipAmount)} фишек
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {selectedProcessing.confirmationMode === 'receipt_review'
                  ? 'Оплата по реквизитам + PDF-чек'
                  : selectedProcessing.title}
              </Typography>
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={playerDraft.acceptResponsibility}
                onChange={(event) =>
                  setPlayerDraft((previous) => ({
                    ...previous,
                    acceptResponsibility: event.target.checked,
                  }))
                }
              />
            }
            label="Я несу ответственность за корректность введённых данных"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={playerDraft.acceptTerms}
                onChange={(event) =>
                  setPlayerDraft((previous) => ({
                    ...previous,
                    acceptTerms: event.target.checked,
                  }))
                }
              />
            }
            label="Я согласен с условиями сервиса"
          />

          <Stack
            alignItems={{ xs: 'stretch', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Button
              disabled={!canContinue}
              onClick={startPlayerOperation}
              size="large"
              startIcon={<PaymentsRounded />}
              variant="contained"
            >
              Перейти к оплате
            </Button>
            <Button
              onClick={() => setChatOpen(true)}
              startIcon={<ChatRounded />}
              variant="outlined"
            >
              Связаться с администратором
            </Button>
          </Stack>
        </Stack>
      </SectionCard>
    </Stack>
  )
}
