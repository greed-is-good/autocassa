import { useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { SectionCard } from '../../components/SectionCard'
import {
  chipPriceRules,
  clubs,
  formatChipAmount,
  getBindingByCurrency,
} from '../../data/mockData'
import type { Currency } from '../../types'

const currencies: Currency[] = ['RUB', 'KZT', 'USDT']

const pricePlaceholders: Record<Currency, string> = {
  RUB: '0.10',
  KZT: '0.55',
  USDT: '0.0010',
}

const getRuleKey = (clubId: string, currency: Currency) => `${clubId}:${currency}`

const buildInitialDraftPrices = () =>
  clubs.reduce<Record<string, string>>((accumulator, club) => {
    currencies.forEach((currency) => {
      const binding = getBindingByCurrency(currency)
      const rule = chipPriceRules.find(
        (item) =>
          item.clubId === club.id &&
          item.currency === currency &&
          item.processingId === binding.processingId,
      )

      accumulator[getRuleKey(club.id, currency)] = rule ? String(rule.pricePerChip) : ''
    })

    return accumulator
  }, {})

const parseChipPrice = (value: string) => {
  const normalized = value.replace(',', '.').trim()

  if (!normalized) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const formatChipPrice = (value: number, currency: Currency) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: currency === 'USDT' ? 4 : 2,
    minimumFractionDigits: currency === 'USDT' ? 4 : 2,
  }).format(value)

export const OwnerClubsPage = () => {
  const fallbackClub = clubs[0]
  const [selectedClubId, setSelectedClubId] = useState(fallbackClub?.id ?? '')
  const [priceRules, setPriceRules] = useState(chipPriceRules)
  const [draftPrices, setDraftPrices] = useState<Record<string, string>>(
    () => buildInitialDraftPrices(),
  )
  const [savedAtByClubId, setSavedAtByClubId] = useState<Record<string, string>>({})
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const activeRulesByKey = useMemo(() => {
    const entries = priceRules.map((rule) => [
      `${rule.clubId}:${rule.currency}:${rule.processingId}`,
      rule,
    ] as const)

    return new Map(entries)
  }, [priceRules])

  if (!fallbackClub) {
    return (
      <Stack className="autocassa-fade-up" spacing={3}>
        <SectionCard
          eyebrow="Владелец"
          title="Настройки клубов"
          subtitle="Клубы пока не добавлены"
        >
          <Alert severity="warning">
            Для настройки стоимости 1 фишки сначала нужно добавить хотя бы один клуб.
          </Alert>
        </SectionCard>
      </Stack>
    )
  }

  const selectedClub =
    clubs.find((club) => club.id === selectedClubId) ?? fallbackClub

  const selectedClubRules = currencies.map((currency) => {
    const binding = getBindingByCurrency(currency)
    const persistedRule =
      activeRulesByKey.get(
        `${selectedClub.id}:${currency}:${binding.processingId}`,
      ) ?? null
    const key = getRuleKey(selectedClub.id, currency)
    const draftValue =
      draftPrices[key] ?? (persistedRule ? String(persistedRule.pricePerChip) : '')
    const parsedValue = parseChipPrice(draftValue)

    return {
      currency,
      binding,
      draftValue,
      parsedValue,
      persistedRule,
    }
  })

  const configuredCount = selectedClubRules.filter(
    (rule) => rule.parsedValue !== null,
  ).length

  const handlePriceChange = (currency: Currency, value: string) => {
    setDraftPrices((current) => ({
      ...current,
      [getRuleKey(selectedClub.id, currency)]: value,
    }))
    setSaveNotice(null)
  }

  const handleSave = () => {
    const savedAt = new Date().toLocaleString('ru-RU')
    const updatedBy = 'Настройка владельца'

    setPriceRules((current) => {
      const next = [...current]

      selectedClubRules.forEach((rule) => {
        const existingIndex = next.findIndex(
          (item) =>
            item.clubId === selectedClub.id &&
            item.currency === rule.currency &&
            item.processingId === rule.binding.processingId,
        )

        if (rule.parsedValue === null) {
          if (existingIndex !== -1) {
            next.splice(existingIndex, 1)
          }
          return
        }

        if (existingIndex === -1) {
          next.push({
            id: `chip-${selectedClub.id}-${rule.binding.processingId}-${rule.currency}`.toLowerCase(),
            clubId: selectedClub.id,
            currency: rule.currency,
            processingId: rule.binding.processingId,
            pricePerChip: rule.parsedValue,
            updatedAt: savedAt,
            updatedBy,
          })
          return
        }

        next[existingIndex] = {
          ...next[existingIndex],
          pricePerChip: rule.parsedValue,
          updatedAt: savedAt,
          updatedBy,
        }
      })

      return next
    })

    setSavedAtByClubId((current) => ({
      ...current,
      [selectedClub.id]: savedAt,
    }))
    setSaveNotice(`Настройки клуба «${selectedClub.title}» обновлены в демо.`)
  }

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <SectionCard
        eyebrow="Владелец"
        title="Настройки клубов"
        subtitle="Выберите клуб и настройте стоимость 1 фишки для нужных валют"
      >
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <FormControl fullWidth>
                <InputLabel>Клуб</InputLabel>
                <Select
                  label="Клуб"
                  value={selectedClub.id}
                  onChange={(event) => {
                    setSelectedClubId(event.target.value)
                    setSaveNotice(null)
                  }}
                >
                  {clubs.map((club) => (
                    <MenuItem key={club.id} value={club.id}>
                      {club.title} • {club.clubNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack
                spacing={1}
                sx={{
                  backgroundColor: 'rgba(31,115,242,0.06)',
                  border: '1px solid rgba(31,115,242,0.12)',
                  borderRadius: '22px',
                  p: 2.2,
                }}
              >
                <Stack
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Stack spacing={0.3}>
                    <Typography fontWeight={800} variant="h3">
                      {selectedClub.title}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      ID клуба: {selectedClub.clubNumber}
                    </Typography>
                  </Stack>
                  <Chip
                    color={configuredCount > 0 ? 'success' : 'default'}
                    label={`${configuredCount} из ${currencies.length} валют настроено`}
                  />
                </Stack>

                <Typography color="text.secondary" variant="body2">
                  На экране остаются только настройки цены фишки: выбираете клуб и
                  задаёте стоимость 1 фишки по валютам, которые используются в
                  пополнениях.
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {saveNotice ? (
            <Alert severity="success">{saveNotice}</Alert>
          ) : (
            <Alert severity="info">
              Цена фишки участвует в расчёте по формуле: сумма пополнения /
              стоимость 1 фишки = количество фишек игроку.
            </Alert>
          )}

          <Grid container spacing={2}>
            {selectedClubRules.map((rule) => (
              <Grid key={`${selectedClub.id}-${rule.currency}`} size={{ xs: 12, md: 6, xl: 4 }}>
                <Stack
                  spacing={1.5}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.74)',
                    border: '1px solid rgba(15,23,42,0.06)',
                    borderRadius: '22px',
                    p: 2.2,
                    height: '100%',
                  }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={1.5}
                  >
                    <Stack spacing={0.3}>
                      <Typography fontWeight={800}>{rule.currency}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        Стоимость 1 фишки в валюте пополнения
                      </Typography>
                    </Stack>
                    <Chip
                      color={rule.parsedValue !== null ? 'success' : 'default'}
                      label={rule.parsedValue !== null ? 'Настроено' : 'Не задано'}
                      size="small"
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Стоимость 1 фишки"
                    value={rule.draftValue}
                    onChange={(event) =>
                      handlePriceChange(rule.currency, event.target.value)
                    }
                    placeholder={pricePlaceholders[rule.currency]}
                    helperText={
                      rule.parsedValue !== null
                        ? `1 000 ${rule.currency} = ${formatChipAmount(
                            1000 / rule.parsedValue,
                          )} фишек`
                        : 'Введите положительное значение, чтобы включить расчёт'
                    }
                    inputProps={{
                      inputMode: 'decimal',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {rule.currency}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box
                    sx={{
                      backgroundColor: 'rgba(15,23,42,0.03)',
                      borderRadius: '18px',
                      p: 1.5,
                    }}
                  >
                    <Stack spacing={0.6}>
                      <Stack
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Typography color="text.secondary" variant="body2">
                          Последняя сохранённая цена
                        </Typography>
                        <Typography fontWeight={800} variant="body2">
                          {rule.persistedRule
                            ? `${formatChipPrice(
                                rule.persistedRule.pricePerChip,
                                rule.currency,
                              )} ${rule.currency}`
                            : 'Ещё не задана'}
                        </Typography>
                      </Stack>

                      <Typography color="text.secondary" variant="body2">
                        {rule.persistedRule
                          ? `${rule.persistedRule.updatedAt} • ${rule.persistedRule.updatedBy}`
                          : 'После сохранения значение начнёт участвовать в расчёте фишек для этого клуба.'}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              backgroundColor: 'rgba(15,23,42,0.03)',
              border: '1px solid rgba(15,23,42,0.06)',
              borderRadius: '22px',
              p: 2.2,
            }}
          >
            <Stack
              alignItems={{ xs: 'flex-start', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={0.4}>
                <Typography fontWeight={800}>Сохранение настроек</Typography>
                <Typography color="text.secondary" variant="body2">
                  {savedAtByClubId[selectedClub.id]
                    ? `Последнее демо-сохранение: ${savedAtByClubId[selectedClub.id]}`
                    : 'Изменения пока находятся в черновике на этом экране.'}
                </Typography>
              </Stack>

              <Button
                onClick={handleSave}
                variant="contained"
                disabled={configuredCount === 0}
              >
                Сохранить цены
              </Button>
            </Stack>
          </Box>
        </Stack>
      </SectionCard>
    </Stack>
  )
}
