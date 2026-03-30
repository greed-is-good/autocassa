import { EditRounded, SyncAltRounded } from '@mui/icons-material'
import {
  Alert,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { usePrototype } from '../../app/PrototypeContext'
import { SectionCard } from '../../components/SectionCard'
import {
  currencyBindings,
  getProcessingById,
  processings,
} from '../../data/mockData'

export const OwnerProcessingsPage = () => {
  const { openModal } = usePrototype()

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Alert icon={<SyncAltRounded />} severity="info" sx={{ borderRadius: '20px' }}>
        Игрок выбирает только валюту, процессинг назначается по настройке владельца
      </Alert>

      <SectionCard
        eyebrow="Владелец"
        title="Процессинги и валюты"
        subtitle="Связки валют и режимов подтверждения"
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Валюта</TableCell>
                <TableCell>Процессинг</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Режим</TableCell>
                <TableCell>Приоритет</TableCell>
                <TableCell>Условия</TableCell>
                <TableCell align="right">Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currencyBindings.map((binding) => {
                const processing = getProcessingById(binding.processingId)

                return (
                  <TableRow key={binding.currency}>
                    <TableCell>
                      <Typography fontWeight={800}>{binding.currency}</Typography>
                    </TableCell>
                    <TableCell>{processing.title}</TableCell>
                    <TableCell>
                      <Chip
                        color={
                          processing.status === 'Активен'
                            ? 'success'
                            : processing.status === 'На мониторинге'
                              ? 'warning'
                              : 'default'
                        }
                        label={processing.status}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {processing.confirmationMode === 'receipt_review'
                        ? 'По реквизитам + PDF-чек'
                        : 'По ссылке'}
                    </TableCell>
                    <TableCell>{processing.priority}</TableCell>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography>{binding.payoutWindow}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {binding.systemNote}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => openModal({ type: 'editBinding', currency: binding.currency })}
                        startIcon={<EditRounded />}
                        variant="outlined"
                      >
                        Редактировать
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard title="Справочник процессингов" subtitle="Активные и резервные маршруты">
        <Stack spacing={1.4}>
          {processings.map((processing) => (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              key={processing.id}
              spacing={2}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(15,23,42,0.06)',
                borderRadius: '18px',
                p: 2,
              }}
            >
              <Stack spacing={0.45}>
                <Typography fontWeight={800}>{processing.title}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {processing.code} • {processing.providerNote}
                </Typography>
                {processing.bankDetails?.length ? (
                  <Typography color="text.secondary" variant="body2">
                    Реквизиты настроены: {processing.bankDetails[0].value}
                  </Typography>
                ) : null}
              </Stack>
              <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={0.6}>
                <Chip
                  color={
                    processing.status === 'Активен'
                      ? 'success'
                      : processing.status === 'На мониторинге'
                        ? 'warning'
                        : 'default'
                  }
                  label={processing.status}
                />
                <Typography color="text.secondary" variant="body2">
                  {processing.confirmationMode === 'receipt_review'
                    ? processing.reviewEtaLabel
                    : processing.conditionLabel}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </SectionCard>
    </Stack>
  )
}
