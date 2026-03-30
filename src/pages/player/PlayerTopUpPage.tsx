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
import { useMemo, useRef } from 'react'

import { usePrototype } from '../../app/PrototypeContext'
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
  auto: ['awaiting', 'expired', 'payment_error', 'processing', 'credit_error', 'manual', 'success'],
  receipt_review: ['receipt_upload', 'receipt_review', 'processing', 'credit_error', 'manual', 'success'],
}

const formatReceiptSize = (size: number) => `${Math.max(1, Math.round(size / 1024))} KB`

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
    currencyOptions.find((item) => item.currency === playerDraft.currency) ?? currencyOptions[0]
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

  const selectClub = (clubId: string) => {
    const club = clubs.find((item) => item.id === clubId)

    if (!club) return

    const nextCurrency =
      getCurrencyAvailability(club.id, partner.id).find((item) => item.enabled)?.currency ??
      playerDraft.currency

    setPlayerDraft((previous) => ({
      ...previous,
      clubId: club.id,
      clubNumber: club.clubNumber,
      currency: nextCurrency,
    }))

    if (playerOperationCreated) resetPlayerOperation()
  }

  const selectCurrency = (currency: Currency) => {
    setPlayerDraft((previous) => ({ ...previous, currency }))
    if (playerOperationCreated) resetPlayerOperation()
  }

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
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

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      {!playerPromoDismissed ? (
        <Box className="autocassa-panel" sx={{ background: 'linear-gradient(135deg, #0b3d91, #1f73f2)', color: 'white', p: 2.25 }}>
          <Stack alignItems={{ xs: 'flex-start', md: 'center' }} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
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

      <SectionCard eyebrow="Игрок" title="Пополнение баланса">
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {appCards.map(({ club, enabled, reason }) => (
              <Grid key={club.id} size={{ xs: 12, md: 6, xl: 3 }}>
                <ButtonBase
                  disabled={!enabled || playerOperationCreated}
                  onClick={() => selectClub(club.id)}
                  sx={{
                    backgroundColor: club.id === playerDraft.clubId ? 'rgba(31,115,242,0.08)' : 'rgba(255,255,255,0.72)',
                    border: '1px solid',
                    borderColor: club.id === playerDraft.clubId ? 'primary.main' : 'rgba(15,23,42,0.08)',
                    borderRadius: '20px',
                    justifyContent: 'flex-start',
                    opacity: enabled ? 1 : 0.58,
                    p: 2,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" width="100%">
                    <Stack direction="row" spacing={1.25}>
                      <Box sx={{ alignItems: 'center', backgroundColor: club.id === playerDraft.clubId ? 'primary.main' : 'rgba(15,23,42,0.08)', borderRadius: '14px', color: club.id === playerDraft.clubId ? 'white' : 'text.primary', display: 'flex', fontWeight: 800, height: 44, justifyContent: 'center', width: 44 }}>
                        {club.iconKey}
                      </Box>
                      <Stack spacing={0.2}>
                        <Typography fontWeight={800}>{club.title}</Typography>
                        <Typography color="text.secondary" variant="body2">{club.clubNumber}</Typography>
                      </Stack>
                    </Stack>
                    <Stack alignItems="flex-end" spacing={0.3}>
                      {club.id === playerDraft.clubId ? <Chip color="primary" label="Выбрано" size="small" /> : null}
                      {!enabled && reason ? <Typography color="text.secondary" variant="caption">{reason}</Typography> : null}
                    </Stack>
                  </Stack>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                disabled={playerOperationCreated}
                error={!isClubNumberValid}
                fullWidth
                helperText={!isClubNumberValid ? 'Клуб не подключен к системе' : ' '}
                label="Номер клуба"
                value={playerDraft.clubNumber}
                onChange={(event) => setPlayerDraft((previous) => ({ ...previous, clubNumber: event.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                disabled={playerOperationCreated}
                fullWidth
                label="Номер аккаунта"
                value={playerDraft.accountId}
                onChange={(event) => setPlayerDraft((previous) => ({ ...previous, accountId: event.target.value }))}
              />
            </Grid>
          </Grid>

          <Stack spacing={1}>
            <Typography fontWeight={800}>Валюта операции</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={1.2}>
              {currencyOptions.map((option) => (
                <ButtonBase
                  disabled={!option.enabled || playerOperationCreated}
                  key={option.currency}
                  onClick={() => selectCurrency(option.currency)}
                  sx={{
                    backgroundColor: option.currency === playerDraft.currency ? 'rgba(31,115,242,0.08)' : 'rgba(255,255,255,0.72)',
                    border: '1px solid',
                    borderColor: option.currency === playerDraft.currency ? 'primary.main' : 'rgba(15,23,42,0.08)',
                    borderRadius: '18px',
                    justifyContent: 'space-between',
                    opacity: option.enabled ? 1 : 0.52,
                    px: 1.75,
                    py: 1.25,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Stack spacing={0.2}>
                    <Typography fontWeight={800}>{option.currency}</Typography>
                    <Typography color="text.secondary" variant="caption">{option.enabled ? getProcessingById(option.binding.processingId).title : option.reason}</Typography>
                  </Stack>
                  {option.currency === playerDraft.currency ? <Chip color="primary" label="Активно" size="small" /> : null}
                </ButtonBase>
              ))}
            </Stack>
          </Stack>

          <TextField
            disabled={playerOperationCreated}
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

          <Box sx={{ backgroundColor: 'rgba(31,115,242,0.06)', border: '1px solid rgba(31,115,242,0.12)', borderRadius: '20px', p: 2 }}>
            <Stack alignItems={{ xs: 'flex-start', md: 'center' }} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
              <Typography fontWeight={800}>
                Будет зачислено {formatChipAmount(chipAmount)} фишек
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {selectedProcessing.confirmationMode === 'receipt_review' ? 'Оплата по реквизитам + PDF-чек' : selectedProcessing.title}
              </Typography>
            </Stack>
          </Box>

          <FormControlLabel control={<Checkbox checked={playerDraft.acceptResponsibility} disabled={playerOperationCreated} onChange={(event) => setPlayerDraft((previous) => ({ ...previous, acceptResponsibility: event.target.checked }))} />} label="Я несу ответственность за корректность введённых данных" />
          <FormControlLabel control={<Checkbox checked={playerDraft.acceptTerms} disabled={playerOperationCreated} onChange={(event) => setPlayerDraft((previous) => ({ ...previous, acceptTerms: event.target.checked }))} />} label="Я согласен с условиями сервиса" />

          <Stack alignItems={{ xs: 'stretch', md: 'center' }} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
            <Button disabled={!canContinue || playerOperationCreated} onClick={startPlayerOperation} size="large" startIcon={<PaymentsRounded />} variant="contained">
              Перейти к оплате
            </Button>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
              <Button onClick={() => setChatOpen(true)} startIcon={<ChatRounded />} variant="outlined">
                Связаться с администратором
              </Button>
              {playerOperationCreated ? (
                <Button onClick={resetPlayerOperation} startIcon={<RefreshRounded />} variant="outlined">
                  Новая операция
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </SectionCard>

      {playerOperationCreated ? (
        <SectionCard title={`Операция ${currentPlayerOperation.id}`}>
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="body2">Демо-сценарии</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {scenariosByMode[selectedProcessing.confirmationMode].map((scenario) => (
                  <Button key={scenario} color="inherit" onClick={() => setStatusScenario(scenario)} size="small" sx={{ backgroundColor: scenario === statusScenario ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.78)', border: '1px solid rgba(15,23,42,0.08)' }} variant={scenario === statusScenario ? 'contained' : 'text'}>
                    {playerScenarioMeta[scenario].title}
                  </Button>
                ))}
              </Stack>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, xl: 7 }}>
                <SectionCard title={selectedProcessing.confirmationMode === 'receipt_review' ? 'Оплата по реквизитам' : 'Оплата'} action={<StatusChip status={currentPlayerOperation.paymentStatus} />}>
                  <Stack spacing={1.75}>
                    <Typography fontWeight={800}>
                      {formatAmount(currentPlayerOperation.amount, currentPlayerOperation.currency)} {currentPlayerOperation.currency} • {formatChipAmount(currentPlayerOperation.chipAmount)} фишек
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {selectedClub.title} • {currentPlayerOperation.accountId} • {selectedProcessing.title}
                    </Typography>

                    {selectedProcessing.confirmationMode === 'auto' ? (
                      <>
                        <Alert icon={<LinkRounded />} severity="info" sx={{ borderRadius: '18px' }}>
                          Ссылка активна {currentPlayerOperation.linkExpiresIn}
                        </Alert>
                        <Button onClick={() => window.open(currentPlayerOperation.paymentLink, '_blank')} startIcon={<LinkRounded />} variant="contained">
                          Открыть оплату
                        </Button>
                      </>
                    ) : (
                      <>
                        <Alert icon={<DescriptionRounded />} severity="warning" sx={{ borderRadius: '18px' }}>
                          {selectedProcessing.reviewEtaLabel}
                        </Alert>
                        <Grid container spacing={1.2}>
                          {selectedProcessing.bankDetails?.map((item) => (
                            <Grid key={item.label} size={{ xs: 12, md: 6 }}>
                              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.72)', border: '1px solid rgba(15,23,42,0.06)', borderRadius: '16px', p: 1.5 }}>
                                <Typography color="text.secondary" variant="body2">{item.label}</Typography>
                                <Typography fontWeight={800}>{item.value}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                        <input accept="application/pdf,.pdf" hidden ref={receiptInputRef} type="file" onChange={handleReceiptChange} />
                        <Button onClick={() => receiptInputRef.current?.click()} startIcon={<DescriptionRounded />} variant="contained">
                          {playerReceiptAttachment ? 'Заменить PDF-чек' : 'Прикрепить PDF-чек'}
                        </Button>
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
                <SectionCard title="Статус операции" action={<Chip icon={<ScheduleRounded />} label={`Ссылка: ${currentPlayerOperation.linkExpiresIn}`} variant="outlined" />}>
                  <Stack spacing={2}>
                    <Typography variant="h3">{currentPlayerOperation.id}</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      <StatusChip status={currentPlayerOperation.paymentStatus} />
                      <StatusChip status={currentPlayerOperation.creditStatus} />
                      {currentPlayerOperation.receiptRequired ? (
                        <Chip
                          color={currentPlayerOperation.receiptStatus === 'approved' ? 'success' : currentPlayerOperation.receiptStatus === 'under_review' ? 'info' : 'warning'}
                          label={currentPlayerOperation.receiptStatus === 'approved' ? 'Чек подтверждён' : currentPlayerOperation.receiptStatus === 'under_review' ? 'Чек на сверке' : 'Ожидает чек'}
                          size="small"
                        />
                      ) : null}
                    </Stack>
                    <Box sx={{ backgroundColor: 'rgba(31,115,242,0.06)', borderRadius: '18px', p: 1.6 }}>
                      <Typography fontWeight={800}>{playerScenarioMeta[statusScenario].title}</Typography>
                      <Typography color="text.secondary" variant="body2">{playerScenarioMeta[statusScenario].description}</Typography>
                    </Box>
                    {currentPlayerOperation.issueNote ? <Alert severity="warning" sx={{ borderRadius: '18px' }}>{currentPlayerOperation.issueNote}</Alert> : null}
                    <OperationTimeline items={currentPlayerOperation.timeline} />
                  </Stack>
                </SectionCard>
              </Grid>
            </Grid>
          </Stack>
        </SectionCard>
      ) : null}
    </Stack>
  )
}
