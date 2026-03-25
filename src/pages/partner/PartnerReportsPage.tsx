import { AssessmentRounded, CloudOffRounded, ReceiptLongRounded } from '@mui/icons-material'
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

import { EmptyState } from '../../components/EmptyState'
import { MetricCard } from '../../components/MetricCard'
import { SectionCard } from '../../components/SectionCard'
import { partnerReports } from '../../data/mockData'

export const PartnerReportsPage = () => (
  <Stack className="autocassa-fade-up" spacing={3}>
    <Grid container spacing={2.2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Объём операций по текущему расчётному дню"
          icon={<AssessmentRounded />}
          label="Сегодня к сверке"
          value="1 284 500 RUB"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Средний процент успешных зачислений за три дня"
          icon={<ReceiptLongRounded />}
          label="Средний success rate"
          tone="success"
          value="94.2%"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard
          hint="Следующая финализация закрытия дня"
          icon={<ReceiptLongRounded />}
          label="Ближайшая сверка"
          tone="warning"
          value="Сегодня, 23:00"
        />
      </Grid>
    </Grid>

    <SectionCard
      eyebrow="Партнёр"
      title="Отчётность"
      subtitle="Отдельный контур отчётности по собственным операциям и статусам расчёта."
      action={<Chip color="primary" label="Только свой контур" />}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Период</TableCell>
              <TableCell>Операций</TableCell>
              <TableCell>Валовый объём</TableCell>
              <TableCell>Success rate</TableCell>
              <TableCell>Статус сверки</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partnerReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Typography fontWeight={800}>{report.period}</Typography>
                </TableCell>
                <TableCell>{report.operations}</TableCell>
                <TableCell>{report.grossAmount}</TableCell>
                <TableCell>{report.successRate}</TableCell>
                <TableCell>{report.settlementStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionCard>

    <SectionCard
      title="API-выгрузки"
      subtitle="В MVP партнёр получает отчётность во фронте и не редактирует системные сценарии."
    >
      <EmptyState
        description="Для первой версии системы отдельная API-выгрузка партнёру не планируется. Заказчику можно показать это как осознанное ограничение MVP."
        icon={<CloudOffRounded />}
        title="Выгрузки API недоступны в MVP"
      />
    </SectionCard>
  </Stack>
)
