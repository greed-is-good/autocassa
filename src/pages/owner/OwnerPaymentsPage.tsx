import {
  AccountTreeRounded,
  AutorenewRounded,
  DescriptionRounded,
  ErrorOutlineRounded,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { usePrototype } from '../../app/PrototypeContext'
import { EmptyState } from '../../components/EmptyState'
import { OperationTimeline } from '../../components/OperationTimeline'
import { OperationsTable } from '../../components/OperationsTable'
import { SectionCard } from '../../components/SectionCard'
import { StatusChip } from '../../components/StatusChip'
import {
  formatChipAmount,
  getClubById,
  getPartnerById,
  getProcessingById,
  clubs,
  partners,
  processings,
} from '../../data/mockData'

export const OwnerPaymentsPage = () => {
  const {
    allOperations,
    detailTab,
    openModal,
    selectedOperationId,
    setDetailTab,
    setSelectedOperationId,
  } = usePrototype()

  const [partnerFilter, setPartnerFilter] = useState('all')
  const [clubFilter, setClubFilter] = useState('all')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  const [processingFilter, setProcessingFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [creditFilter, setCreditFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')

  const filteredOperations = useMemo(
    () =>
      allOperations.filter((operation) => {
        const matchesPartner =
          partnerFilter === 'all' || operation.partnerId === partnerFilter
        const matchesClub = clubFilter === 'all' || operation.clubId === clubFilter
        const matchesCurrency =
          currencyFilter === 'all' || operation.currency === currencyFilter
        const matchesProcessing =
          processingFilter === 'all' || operation.processingId === processingFilter
        const matchesPayment =
          paymentFilter === 'all' || operation.paymentStatus === paymentFilter
        const matchesCredit =
          creditFilter === 'all' || operation.creditStatus === creditFilter
        const matchesPeriod =
          periodFilter === 'all' || operation.createdAt.startsWith(periodFilter)

        return (
          matchesPartner &&
          matchesClub &&
          matchesCurrency &&
          matchesProcessing &&
          matchesPayment &&
          matchesCredit &&
          matchesPeriod
        )
      }),
    [
      allOperations,
      clubFilter,
      creditFilter,
      currencyFilter,
      partnerFilter,
      paymentFilter,
      periodFilter,
      processingFilter,
    ],
  )

  const selectedOperation =
    filteredOperations.find((operation) => operation.id === selectedOperationId) ??
    filteredOperations[0]

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <SectionCard eyebrow="Владелец" title="Платежи" subtitle="Операции, фильтры и исключения">
            <Stack spacing={2.5}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, md: 4, xl: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Партнёр</InputLabel>
                    <Select label="Партнёр" value={partnerFilter} onChange={(event) => setPartnerFilter(event.target.value)}>
                      <MenuItem value="all">Все партнёры</MenuItem>
                      {partners.map((partner) => (
                        <MenuItem key={partner.id} value={partner.id}>
                          {partner.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4, xl: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Клуб</InputLabel>
                    <Select label="Клуб" value={clubFilter} onChange={(event) => setClubFilter(event.target.value)}>
                      <MenuItem value="all">Все клубы</MenuItem>
                      {clubs.map((club) => (
                        <MenuItem key={club.id} value={club.id}>
                          {club.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4, xl: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Валюта</InputLabel>
                    <Select label="Валюта" value={currencyFilter} onChange={(event) => setCurrencyFilter(event.target.value)}>
                      <MenuItem value="all">Все</MenuItem>
                      <MenuItem value="RUB">RUB</MenuItem>
                      <MenuItem value="KZT">KZT</MenuItem>
                      <MenuItem value="USDT">USDT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4, xl: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Процессинг</InputLabel>
                    <Select label="Процессинг" value={processingFilter} onChange={(event) => setProcessingFilter(event.target.value)}>
                      <MenuItem value="all">Все процессинги</MenuItem>
                      {processings.map((processing) => (
                        <MenuItem key={processing.id} value={processing.id}>
                          {processing.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4, xl: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Статус оплаты</InputLabel>
                    <Select label="Статус оплаты" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
                      <MenuItem value="all">Все</MenuItem>
                      <MenuItem value="Создан">Создан</MenuItem>
                      <MenuItem value="Ожидает оплаты">Ожидает оплаты</MenuItem>
                      <MenuItem value="Оплачен">Оплачен</MenuItem>
                      <MenuItem value="Истёк">Истёк</MenuItem>
                      <MenuItem value="Отменён">Отменён</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4, xl: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Статус зачисления</InputLabel>
                    <Select label="Статус зачисления" value={creditFilter} onChange={(event) => setCreditFilter(event.target.value)}>
                      <MenuItem value="all">Все</MenuItem>
                      <MenuItem value="Не отправлено">Не отправлено</MenuItem>
                      <MenuItem value="Отправлено в клуб">Отправлено в клуб</MenuItem>
                      <MenuItem value="Зачислено">Зачислено</MenuItem>
                      <MenuItem value="Ошибка зачисления">Ошибка зачисления</MenuItem>
                      <MenuItem value="Требует ручной обработки">Требует ручной обработки</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4, xl: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Период</InputLabel>
                    <Select label="Период" value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)}>
                      <MenuItem value="all">Все даты</MenuItem>
                      <MenuItem value="25.03.2026">25.03.2026</MenuItem>
                      <MenuItem value="24.03.2026">24.03.2026</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {filteredOperations.length > 0 ? (
                <OperationsTable
                  onRetry={(operationId) => openModal({ type: 'retryAccrual', operationId })}
                  onSelect={setSelectedOperationId}
                  onSendManual={(operationId) => openModal({ type: 'manualAdjustment', operationId })}
                  onShowHistory={(operationId) => {
                    setSelectedOperationId(operationId)
                    setDetailTab('history')
                  }}
                  onShowSummary={(operationId) => {
                    setSelectedOperationId(operationId)
                    setDetailTab('summary')
                  }}
                  operations={filteredOperations}
                  selectedId={selectedOperation?.id}
                  showActions
                  showPartner
                />
              ) : (
                <EmptyState
                  description="Попробуйте изменить фильтры"
                  icon={<ErrorOutlineRounded />}
                  title="Нет операций по выбранным фильтрам"
                />
              )}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <SectionCard
            title="Детали операции"
            subtitle="Карточка выбранной операции"
            action={
              selectedOperation ? (
                <Button onClick={() => setDetailTab(detailTab === 'summary' ? 'history' : 'summary')} variant="outlined">
                  {detailTab === 'summary' ? 'История статусов' : 'Сводка'}
                </Button>
              ) : null
            }
          >
            {selectedOperation ? (
              <Stack spacing={2}>
                <Stack spacing={0.6}>
                  <Typography variant="h3">{selectedOperation.id}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <StatusChip status={selectedOperation.paymentStatus} />
                    <StatusChip status={selectedOperation.creditStatus} />
                  </Stack>
                </Stack>

                {detailTab === 'summary' ? (
                  <Stack spacing={1.35}>
                    {[
                      ['Партнёр', getPartnerById(selectedOperation.partnerId).title],
                      ['Клуб', getClubById(selectedOperation.clubId).title],
                      ['Процессинг', getProcessingById(selectedOperation.processingId).title],
                      ['Фишки', formatChipAmount(selectedOperation.chipAmount)],
                      ['Режим', selectedOperation.confirmationMode === 'receipt_review' ? 'По реквизитам + PDF-чек' : 'По ссылке'],
                      ['API request ID', selectedOperation.apiRequestId ?? 'ещё не создан'],
                      ['Аккаунт', selectedOperation.accountId],
                    ].map(([label, value]) => (
                      <Stack direction="row" justifyContent="space-between" key={label} spacing={2}>
                        <Typography color="text.secondary">{label}</Typography>
                        <Typography fontWeight={800} textAlign="right">
                          {value}
                        </Typography>
                      </Stack>
                    ))}

                    <Divider />

                    {selectedOperation.receiptAttachment ? (
                      <Box sx={{ backgroundColor: 'rgba(31,115,242,0.06)', borderRadius: '18px', p: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                          <Stack spacing={0.25}>
                            <Typography fontWeight={800}>{selectedOperation.receiptAttachment.name}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {selectedOperation.receiptAttachment.size} • {selectedOperation.receiptAttachment.uploadedAt}
                            </Typography>
                          </Stack>
                          <Chip color="success" icon={<DescriptionRounded />} label="Чек" size="small" />
                        </Stack>
                      </Box>
                    ) : null}

                    {selectedOperation.issueNote ? (
                      <Alert
                        action={
                          <Button color="inherit" onClick={() => openModal({ type: 'accrualError', operationId: selectedOperation.id })}>
                            Детали
                          </Button>
                        }
                        severity="warning"
                        sx={{ borderRadius: '18px' }}
                      >
                        {selectedOperation.issueNote}
                      </Alert>
                    ) : null}

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      <Button color="warning" onClick={() => openModal({ type: 'manualAdjustment', operationId: selectedOperation.id })} startIcon={<AccountTreeRounded />} variant="contained">
                        Ручная обработка
                      </Button>
                      <Button color="success" onClick={() => openModal({ type: 'retryAccrual', operationId: selectedOperation.id })} startIcon={<AutorenewRounded />} variant="outlined">
                        Повторить зачисление
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <OperationTimeline items={selectedOperation.timeline} />
                )}
              </Stack>
            ) : (
              <EmptyState
                description="Выберите строку в таблице слева"
                icon={<AccountTreeRounded />}
                title="Операция не выбрана"
              />
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  )
}
