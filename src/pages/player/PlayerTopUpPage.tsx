import {
  ChatRounded,
  KeyboardArrowRightRounded,
  MonetizationOnRounded,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { usePrototype } from '../../app/PrototypeContext'
import {
  clubs,
  currencyBindings,
  getBindingByCurrency,
  getClubById,
  getProcessingById,
} from '../../data/mockData'
import type { Currency } from '../../types'
import { SectionCard } from '../../components/SectionCard'

export const PlayerTopUpPage = () => {
  const navigate = useNavigate()
  const { playerDraft, setPlayerDraft, setStatusScenario, setChatOpen } =
    usePrototype()

  const selectedClub = getClubById(playerDraft.clubId)
  const selectedBinding = getBindingByCurrency(playerDraft.currency)
  const selectedProcessing = getProcessingById(selectedBinding.processingId)

  const handleCurrencyChange = (currency: Currency) => {
    setPlayerDraft((previous) => ({ ...previous, currency }))
  }

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <SectionCard
        eyebrow="Игрок"
        title="Пополнение баланса"
        subtitle="Максимально простой сценарий MVP: игрок выбирает клуб, вводит номер аккаунта и сумму, а процессинг подбирается системой автоматически по валюте."
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={2.5}>
              <Alert
                icon={<MonetizationOnRounded />}
                severity="info"
                sx={{ borderRadius: '18px' }}
              >
                Процессинг не выбирается вручную. Для каждой валюты на MVP уже
                закреплён один маршрут оплаты.
              </Alert>

              <TextField
                fullWidth
                label="Приложение / клуб"
                select
                value={playerDraft.clubId}
                onChange={(event) => {
                  const nextClub = clubs.find((club) => club.id === event.target.value)
                  if (!nextClub) {
                    return
                  }

                  setPlayerDraft((previous) => ({
                    ...previous,
                    clubId: nextClub.id,
                    clubNumber: nextClub.clubNumber,
                  }))
                }}
              >
                {clubs.map((club) => (
                  <MenuItem
                    disabled={club.apiStatus === 'Вне MVP'}
                    key={club.id}
                    value={club.id}
                  >
                    {club.title} • {club.appName}
                    {club.apiStatus === 'Вне MVP' ? ' • вне MVP' : ''}
                  </MenuItem>
                ))}
              </TextField>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
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
                <Grid size={{ xs: 12, md: 6 }}>
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

              <Stack spacing={1.4}>
                <Typography fontWeight={800}>Валюта оплаты</Typography>
                <Grid container spacing={1.5}>
                  {currencyBindings.map((binding) => {
                    const processing = getProcessingById(binding.processingId)
                    const isActive = binding.currency === playerDraft.currency

                    return (
                      <Grid key={binding.currency} size={{ xs: 12, md: 4 }}>
                        <Card
                          sx={{
                            borderColor: isActive
                              ? 'primary.main'
                              : 'rgba(15,23,42,0.08)',
                            boxShadow: isActive
                              ? '0 18px 40px rgba(31,115,242,0.14)'
                              : undefined,
                          }}
                        >
                          <CardActionArea onClick={() => handleCurrencyChange(binding.currency)}>
                            <Stack p={2.2} spacing={1.2}>
                              <Stack
                                alignItems="center"
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography variant="h3">{binding.currency}</Typography>
                                {isActive ? (
                                  <Chip color="primary" label="Выбрано" size="small" />
                                ) : null}
                              </Stack>
                              <Typography color="text.secondary" variant="body2">
                                {binding.rateLabel}
                              </Typography>
                              <Divider />
                              <Typography fontWeight={700}>{processing.title}</Typography>
                              <Typography color="text.secondary" variant="body2">
                                {binding.systemNote}
                              </Typography>
                            </Stack>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              </Stack>

              <Box
                sx={{
                  alignItems: 'center',
                  background:
                    'linear-gradient(135deg, rgba(31,115,242,0.12), rgba(255,122,26,0.08))',
                  border: '1px solid rgba(31,115,242,0.08)',
                  borderRadius: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  justifyContent: 'space-between',
                  p: 2,
                }}
              >
                <Stack spacing={0.5}>
                  <Typography fontWeight={800}>
                    Нужна помощь по оплате или идентификатору аккаунта?
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Открой чат с администратором прямо из формы пополнения.
                  </Typography>
                </Stack>
                <Button
                  color="secondary"
                  onClick={() => setChatOpen(true)}
                  startIcon={<ChatRounded />}
                  variant="contained"
                >
                  Связаться с администратором
                </Button>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={2.5}>
              <SectionCard
                className="h-full"
                title="Детали операции"
                subtitle="Система заранее знает, какой процессинг использовать для выбранной валюты."
                action={<Chip color="primary" label="Готово к оплате" />}
              >
                <Stack spacing={2}>
                  {[
                    ['Выбранный клуб', `${selectedClub.title} • ${selectedClub.appName}`],
                    ['Номер клуба', playerDraft.clubNumber],
                    ['Номер аккаунта', playerDraft.accountId],
                    [
                      'Сумма',
                      `${playerDraft.amount || '0'} ${playerDraft.currency}`,
                    ],
                    ['Валюта', playerDraft.currency],
                    ['Применяемый процессинг', selectedProcessing.title],
                    ['Курс / условия', selectedBinding.payoutWindow],
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

                  <Divider />

                  <Alert severity="success" sx={{ borderRadius: '18px' }}>
                    После перехода к оплате игрок получает ссылку и дальше работает только
                    со статусом операции.
                  </Alert>
                </Stack>
              </SectionCard>

              <Button
                endIcon={<KeyboardArrowRightRounded />}
                onClick={() => {
                  setStatusScenario('awaiting')
                  navigate('/player/status')
                }}
                size="large"
                variant="contained"
              >
                Перейти к оплате
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </SectionCard>
    </Stack>
  )
}
