import {
  ChatRounded,
  KeyboardArrowRightRounded,
} from '@mui/icons-material'
import {
  ButtonBase,
  Box,
  Button,
  Chip,
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
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Приложение"
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
                    {club.title}
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
                <Stack spacing={1.25}>
                  {currencyBindings.map((binding) => {
                    const processing = getProcessingById(binding.processingId)
                    const isActive = binding.currency === playerDraft.currency

                    return (
                      <ButtonBase
                        key={binding.currency}
                        onClick={() => handleCurrencyChange(binding.currency)}
                        sx={{
                          backgroundColor: isActive
                            ? 'rgba(31,115,242,0.06)'
                            : 'rgba(255,255,255,0.84)',
                          border: '1px solid',
                          borderColor: isActive
                            ? 'primary.main'
                            : 'rgba(15,23,42,0.08)',
                          borderRadius: '22px',
                          justifyContent: 'flex-start',
                          px: 2.2,
                          py: 1.9,
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
                            <Stack alignItems="center" direction="row" spacing={1}>
                              <Typography variant="h3">{binding.currency}</Typography>
                              {isActive ? (
                                <Chip color="primary" label="Выбрано" size="small" />
                              ) : null}
                            </Stack>
                            <Typography color="text.secondary" variant="body2">
                              {binding.rateLabel}
                            </Typography>
                          </Stack>

                          <Stack
                            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                            spacing={0.45}
                          >
                            <Typography fontWeight={700}>{processing.title}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {binding.payoutWindow}
                            </Typography>
                          </Stack>
                        </Stack>
                      </ButtonBase>
                    )
                  })}
                </Stack>
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
                  <Typography fontWeight={800}>Нужна помощь?</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Чат доступен прямо из формы
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
                action={<Chip color="primary" label="Готово к оплате" />}
              >
                <Stack spacing={2}>
                  {[
                    ['Приложение', selectedClub.title],
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
