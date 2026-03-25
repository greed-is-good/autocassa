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
import { clubs } from '../../data/mockData'

const checkColor = {
  Успешно: 'success',
  'С предупреждением': 'warning',
  Ошибка: 'error',
} as const

export const OwnerClubsPage = () => (
  <Stack className="autocassa-fade-up" spacing={3}>
    <SectionCard
      eyebrow="Владелец"
      title="Клубы и интеграции"
      subtitle="Список приложений и клубов с текущим статусом API, endpoint и результатом последней проверки."
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
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={1.5}
              >
                <Stack spacing={0.4}>
                  <Typography fontWeight={800}>{club.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {club.appName} • {club.clubNumber}
                  </Typography>
                </Stack>
                <Chip
                  color={club.apiStatus === 'API подключено' ? 'success' : 'default'}
                  label={club.apiStatus}
                />
              </Stack>
              <Typography color="text.secondary" variant="body2">
                Endpoint: {club.endpoint}
              </Typography>
              <Chip
                color={checkColor[club.lastCheckStatus]}
                icon={<CheckCircleRounded />}
                label={`Последняя проверка: ${club.lastCheckStatus}`}
                sx={{ width: 'fit-content' }}
              />
              <Typography variant="body2">{club.lastCheckNote}</Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </SectionCard>

    <SectionCard
      title="Реестр интеграций"
      subtitle="Табличный вид для обсуждения с заказчиком и дальнейшей детализации контрактов API."
    >
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
                  <Stack spacing={0.25}>
                    <Typography fontWeight={800}>{club.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {club.appName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{club.clubNumber}</TableCell>
                <TableCell>
                  <Chip
                    color={club.apiStatus === 'API подключено' ? 'success' : 'default'}
                    label={club.apiStatus}
                    size="small"
                  />
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
  </Stack>
)
