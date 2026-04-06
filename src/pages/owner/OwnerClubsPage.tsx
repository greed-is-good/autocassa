import { CheckCircleRounded, LinkRounded } from '@mui/icons-material'
import {
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { SectionCard } from '../../components/SectionCard'
import { chipPriceRules, clubs, processings } from '../../data/mockData'

const checkColor = {
  Успешно: 'success',
  'С предупреждением': 'warning',
  Ошибка: 'error',
} as const

const currencies = ['RUB', 'KZT', 'USDT'] as const

export const OwnerClubsPage = () => {
  const [priceRules, setPriceRules] = useState(chipPriceRules)
  const [draftPrices, setDraftPrices] = useState<Record<string, string>>({})

  const rulesByKey = useMemo(() => {
    const entries = priceRules.map((rule) => [
      `${rule.clubId}-${rule.processingId}-${rule.currency}`,
      rule,
    ] as const)
    return new Map(entries)
  }, [priceRules])

  const getRule = (clubId: string, processingId: string, currency: (typeof currencies)[number]) =>
    rulesByKey.get(`${clubId}-${processingId}-${currency}`)

  const commitRule = (
    clubId: string,
    processingId: string,
    currency: (typeof currencies)[number],
    rawValue: string,
  ) => {
    const normalized = rawValue.trim().replace(',', '.')

    if (!normalized) {
      setPriceRules((previous) =>
        previous.filter(
          (rule) =>
            !(
              rule.clubId === clubId &&
              rule.processingId === processingId &&
              rule.currency === currency
            ),
        ),
      )
      return
    }

    const parsed = Number(normalized)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return
    }

    const now = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    const updatedBy = 'Настройка владельца'

    setPriceRules((previous) => {
      const existingIndex = previous.findIndex(
        (rule) =>
          rule.clubId === clubId &&
          rule.processingId === processingId &&
          rule.currency === currency,
      )

      if (existingIndex === -1) {
        return [
          ...previous,
          {
            id: `chip-${clubId}-${processingId}-${currency}`.toLowerCase(),
            clubId,
            currency,
            processingId,
            pricePerChip: parsed,
            updatedAt: now,
            updatedBy,
          },
        ]
      }

      return previous.map((rule) =>
        rule.clubId === clubId &&
        rule.processingId === processingId &&
        rule.currency === currency
          ? { ...rule, pricePerChip: parsed, updatedAt: now, updatedBy }
          : rule,
      )
    })
  }

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
    <SectionCard
      eyebrow="Владелец"
      title="Клубы и интеграции"
      subtitle="Статусы API и базовые параметры клубов"
    >
      <Grid container spacing={2}>
        {clubs.map((club) => (
          <Grid key={club.id} size={{ xs: 12, md: 6 }}>
            <Stack
              spacing={1.2}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(15,23,42,0.06)',
                borderRadius: '22px',
                p: 2.2,
              }}
            >
              <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1.5}>
                <Stack spacing={0.4}>
                  <Typography fontWeight={800}>{club.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    ID клуба: {club.clubNumber}
                  </Typography>
                </Stack>
                <Chip color={club.apiStatus === 'API подключено' ? 'success' : 'default'} label={club.apiStatus} />
              </Stack>
              <Typography color="text.secondary" variant="body2">
                Endpoint: {club.endpoint}
              </Typography>
              <Chip
                color={checkColor[club.lastCheckStatus]}
                icon={<CheckCircleRounded />}
                label={`Проверка: ${club.lastCheckStatus}`}
                sx={{ width: 'fit-content' }}
              />
              <Typography variant="body2">{club.lastCheckNote}</Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </SectionCard>

    <SectionCard title="Реестр интеграций" subtitle="Табличный реестр подключений">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Приложение</TableCell>
              <TableCell>ID клуба</TableCell>
              <TableCell>Статус API</TableCell>
              <TableCell>Базовый endpoint</TableCell>
              <TableCell>Последняя проверка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell>
                  <Typography fontWeight={800}>{club.title}</Typography>
                </TableCell>
                <TableCell>{club.clubNumber}</TableCell>
                <TableCell>
                  <Chip color={club.apiStatus === 'API подключено' ? 'success' : 'default'} label={club.apiStatus} size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <LinkRounded fontSize="small" />
                    <Typography variant="body2">{club.endpoint}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {club.lastCheckStatus} • {club.lastCheckAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionCard>

    <SectionCard title="Стоимость 1 фишки" subtitle="Матрица клуб + процессинг + валюта">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Приложение</TableCell>
              <TableCell>ID клуба</TableCell>
              <TableCell>Процессинг</TableCell>
              {currencies.map((currency) => (
                <TableCell key={currency} align="right">
                  {currency}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => {
              const clubProcessings = processings.filter((processing) =>
                currencies.some((currency) => getRule(club.id, processing.id, currency)),
              )

              return clubProcessings.map((processing, index) => (
                <TableRow key={`${club.id}-${processing.id}`}>
                  {index === 0 ? (
                    <>
                      <TableCell rowSpan={clubProcessings.length}>
                        <Typography fontWeight={800}>{club.title}</Typography>
                      </TableCell>
                      <TableCell rowSpan={clubProcessings.length}>{club.clubNumber}</TableCell>
                    </>
                  ) : null}
                  <TableCell>
                    <Stack spacing={0.2}>
                      <Typography fontWeight={700}>{processing.title}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {processing.code} • {processing.status}
                      </Typography>
                    </Stack>
                  </TableCell>
                  {currencies.map((currency) => {
                    const isSupported = processing.currencies.includes(currency)
                    const rule = isSupported ? getRule(club.id, processing.id, currency) : undefined
                    const cellKey = `${club.id}-${processing.id}-${currency}`
                    const draftValue = draftPrices[cellKey]
                    const value = draftValue ?? (rule ? String(rule.pricePerChip) : '')
                    return (
                      <TableCell key={`${club.id}-${processing.id}-${currency}`} align="right">
                        {isSupported ? (
                          <TextField
                            inputProps={{
                              min: 0,
                              step: currency === 'USDT' ? 0.0001 : 0.01,
                            }}
                            onBlur={() => {
                              commitRule(club.id, processing.id, currency, value)
                              setDraftPrices((previous) => {
                                const next = { ...previous }
                                delete next[cellKey]
                                return next
                              })
                            }}
                            onChange={(event) =>
                              setDraftPrices((previous) => ({
                                ...previous,
                                [cellKey]: event.target.value,
                              }))
                            }
                            placeholder="—"
                            size="small"
                            sx={{ maxWidth: 120 }}
                            type="number"
                            value={value}
                            variant="standard"
                          />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack mt={2} spacing={0.5}>
        <Typography fontWeight={800}>Всего правил: {priceRules.length}</Typography>
        <Typography color="text.secondary" variant="body2">
          Источник расчёта фишек для player flow
        </Typography>
      </Stack>
    </SectionCard>
  </Stack>
  )
}
