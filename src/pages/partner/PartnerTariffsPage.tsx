import { LockRounded, PaymentsRounded } from '@mui/icons-material'
import {
  Alert,
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

import { MetricCard } from '../../components/MetricCard'
import { SectionCard } from '../../components/SectionCard'
import {
  getProcessingById,
  partners,
  tariffLog,
  tariffRates,
} from '../../data/mockData'

const partner = partners[0]
const partnerRates = tariffRates.filter((rate) => rate.partnerId === partner.id)

export const PartnerTariffsPage = () => (
  <Stack className="autocassa-fade-up" spacing={3}>
    <Alert icon={<LockRounded />} severity="warning" sx={{ borderRadius: '20px' }}>
      Тарифы доступны партнёру только для просмотра. Управление курсами и процессингами
      находится в контуре владельца.
    </Alert>

    <Grid container spacing={2.2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Активные связки по Orbit Traffic"
          icon={<PaymentsRounded />}
          label="Тарифных связок"
          value={partnerRates.length.toString()}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Основная ставка по RUB и KZT"
          icon={<PaymentsRounded />}
          label="Средний фиксированный курс"
          tone="success"
          value="97.6%"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Период между оплатой и расчётом с партнёром"
          icon={<PaymentsRounded />}
          label="Расчётное окно"
          tone="warning"
          value="T+0 / T+1"
        />
      </Grid>
    </Grid>

    <SectionCard
      eyebrow="Партнёр"
      title="Тарифы по связке валюта + процессинг"
      subtitle="В демонстрации показаны согласованные фиксированные курсы для доступа партнёра."
      action={<Chip label={partner.commissionNote} />}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Валюта</TableCell>
              <TableCell>Процессинг</TableCell>
              <TableCell>Фиксированный курс</TableCell>
              <TableCell>Окно расчёта</TableCell>
              <TableCell>Обновлено</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partnerRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>
                  <Typography fontWeight={800}>{rate.currency}</Typography>
                </TableCell>
                <TableCell>{getProcessingById(rate.processingId).title}</TableCell>
                <TableCell>{rate.fixedRate}</TableCell>
                <TableCell>{rate.settlementWindow}</TableCell>
                <TableCell>
                  {rate.updatedAt} • {rate.updatedBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack mt={2.5} spacing={1.2}>
        <Typography fontWeight={800}>Последние изменения тарифов</Typography>
        {tariffLog
          .filter((item) => item.partnerId === partner.id)
          .map((item) => (
            <Stack
              direction="row"
              justifyContent="space-between"
              key={item.id}
              spacing={2}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(15,23,42,0.06)',
                borderRadius: '16px',
                p: 1.5,
              }}
            >
              <Typography>{item.summary}</Typography>
              <Typography color="text.secondary" variant="body2">
                {item.changedAt}
              </Typography>
            </Stack>
          ))}
      </Stack>
    </SectionCard>
  </Stack>
)
