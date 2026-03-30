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
  Typography,
} from '@mui/material'

import { SectionCard } from '../../components/SectionCard'
import { chipPriceRules, clubs, formatAmount, getChipPriceRule } from '../../data/mockData'

const checkColor = {
  Успешно: 'success',
  'С предупреждением': 'warning',
  Ошибка: 'error',
} as const

const currencies = ['RUB', 'KZT', 'USDT'] as const

export const OwnerClubsPage = () => (
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

    <SectionCard title="Стоимость 1 фишки" subtitle="Матрица клуб + валюта">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Приложение</TableCell>
              <TableCell>ID клуба</TableCell>
              {currencies.map((currency) => (
                <TableCell key={currency} align="right">
                  {currency}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell>
                  <Typography fontWeight={800}>{club.title}</Typography>
                </TableCell>
                <TableCell>{club.clubNumber}</TableCell>
                {currencies.map((currency) => {
                  const rule = getChipPriceRule(club.id, currency)
                  return (
                    <TableCell key={`${club.id}-${currency}`} align="right">
                      {rule ? `${formatAmount(rule.pricePerChip, currency)} ${currency}` : '—'}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack mt={2} spacing={0.5}>
        <Typography fontWeight={800}>Всего правил: {chipPriceRules.length}</Typography>
        <Typography color="text.secondary" variant="body2">
          Источник расчёта фишек для player flow
        </Typography>
      </Stack>
    </SectionCard>
  </Stack>
)
