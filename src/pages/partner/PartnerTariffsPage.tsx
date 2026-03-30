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
  commissionLog,
  getProcessingById,
  partnerProcessingCommissions,
  partners,
} from '../../data/mockData'

const partner = partners[0]
const partnerCommissions = partnerProcessingCommissions.filter(
  (commission) => commission.partnerId === partner.id,
)

export const PartnerTariffsPage = () => (
  <Stack className="autocassa-fade-up" spacing={3}>
    <Alert icon={<LockRounded />} severity="warning" sx={{ borderRadius: '20px' }}>
      Партнёр видит только свой контур и не редактирует системные настройки
    </Alert>

    <Grid container spacing={2.2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Активные ставки"
          icon={<PaymentsRounded />}
          label="Комиссионных связок"
          value={partnerCommissions.length.toString()}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Среднее значение"
          icon={<PaymentsRounded />}
          label="Средняя комиссия"
          tone="success"
          value="2.5%"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Расчётный срок"
          icon={<PaymentsRounded />}
          label="Расчётное окно"
          tone="warning"
          value="T+0 / T+1"
        />
      </Grid>
    </Grid>

    <SectionCard
      eyebrow="Партнёр"
      title="Комиссии по связке валюта + процессинг"
      subtitle="Доступно только для просмотра"
      action={<Chip label={partner.commissionNote} />}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Валюта</TableCell>
              <TableCell>Процессинг</TableCell>
              <TableCell>Комиссия</TableCell>
              <TableCell>Окно расчёта</TableCell>
              <TableCell>Обновлено</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partnerCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>
                  <Typography fontWeight={800}>{commission.currency}</Typography>
                </TableCell>
                <TableCell>{getProcessingById(commission.processingId).title}</TableCell>
                <TableCell>{commission.commissionRate}</TableCell>
                <TableCell>{commission.settlementWindow}</TableCell>
                <TableCell>
                  {commission.updatedAt} • {commission.updatedBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack mt={2.5} spacing={1.2}>
        <Typography fontWeight={800}>Последние изменения</Typography>
        {commissionLog
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
