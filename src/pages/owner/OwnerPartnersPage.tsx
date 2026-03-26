import { AddRounded, EditRounded, GroupsRounded } from '@mui/icons-material'
import {
  Button,
  ButtonBase,
  Chip,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { usePrototype } from '../../app/PrototypeContext'
import { SectionCard } from '../../components/SectionCard'
import {
  getClubById,
  getProcessingById,
  partners,
  tariffLog,
  tariffRates,
} from '../../data/mockData'

export const OwnerPartnersPage = () => {
  const { openModal } = usePrototype()
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0].id)

  const selectedPartner =
    partners.find((partner) => partner.id === selectedPartnerId) ?? partners[0]
  const selectedRates = useMemo(
    () => tariffRates.filter((rate) => rate.partnerId === selectedPartner.id),
    [selectedPartner.id],
  )
  const selectedLog = useMemo(
    () => tariffLog.filter((item) => item.partnerId === selectedPartner.id),
    [selectedPartner.id],
  )

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 4 }}>
          <SectionCard
            eyebrow="Владелец"
            title="Партнёры"
            subtitle="Контур доступа и тарифов"
            action={
              <Button
                onClick={() => openModal({ type: 'createPartner' })}
                startIcon={<AddRounded />}
                variant="contained"
              >
                Создать партнёра
              </Button>
            }
          >
            <Stack spacing={1.25}>
              {partners.map((partner) => (
                <ButtonBase
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  sx={{
                    backgroundColor:
                      partner.id === selectedPartnerId
                        ? 'rgba(31,115,242,0.08)'
                        : 'rgba(255,255,255,0.72)',
                    border: '1px solid rgba(15,23,42,0.06)',
                    borderRadius: '18px',
                    justifyContent: 'flex-start',
                    p: 1.75,
                    textAlign: 'left',
                  }}
                >
                  <Stack spacing={0.4}>
                    <Typography fontWeight={800}>{partner.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {partner.manager} • {partner.telegram}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {partner.monthlyPlan}
                    </Typography>
                  </Stack>
                </ButtonBase>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, xl: 8 }}>
          <Stack spacing={3}>
            <SectionCard
              title="Карточка партнёра"
              subtitle="Основные параметры партнёра"
              action={
                <Button
                  onClick={() => openModal({ type: 'createPartner' })}
                  startIcon={<GroupsRounded />}
                  variant="outlined"
                >
                  Редактировать карточку
                </Button>
              }
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography color="text.secondary" variant="body2">
                      Менеджер
                    </Typography>
                    <Typography fontWeight={800}>{selectedPartner.manager}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={0.5}>
                    <Typography color="text.secondary" variant="body2">
                      Telegram
                    </Typography>
                    <Typography fontWeight={800}>{selectedPartner.telegram}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography color="text.secondary" mb={0.8} variant="body2">
                    Доступные клубы
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {selectedPartner.allowedClubIds.map((clubId) => (
                      <Chip key={clubId} label={getClubById(clubId).title} />
                    ))}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography color="text.secondary" mb={0.8} variant="body2">
                    Доступные валюты
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {selectedPartner.allowedCurrencies.map((currency) => (
                      <Chip color="primary" key={currency} label={currency} size="small" />
                    ))}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography color="text.secondary" mb={0.8} variant="body2">
                    Доступные процессинги
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {selectedPartner.allowedProcessingIds.map((processingId) => (
                      <Chip
                        key={processingId}
                        label={getProcessingById(processingId).title}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title="Фиксированные курсы"
              subtitle="Ставки и журнал изменений"
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Валюта</TableCell>
                      <TableCell>Процессинг</TableCell>
                      <TableCell>Курс</TableCell>
                      <TableCell>Окно расчёта</TableCell>
                      <TableCell>Обновлено</TableCell>
                      <TableCell align="right">Действие</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRates.map((rate) => (
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
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => openModal({ type: 'editRate', rateId: rate.id })}
                          >
                            <EditRounded />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack mt={2.5} spacing={1.1}>
                <Typography fontWeight={800}>Лог изменений тарифов</Typography>
                {selectedLog.map((item) => (
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
        </Grid>
      </Grid>
    </Stack>
  )
}
