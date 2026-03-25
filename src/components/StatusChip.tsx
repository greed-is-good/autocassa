import type { ReactElement } from 'react'

import {
  AccessTimeRounded,
  AutorenewRounded,
  CheckCircleRounded,
  ErrorRounded,
  ForumRounded,
  HourglassEmptyRounded,
  PauseCircleRounded,
  ScheduleRounded,
} from '@mui/icons-material'
import { Chip, type ChipProps } from '@mui/material'

import type { ChatStatus, CreditStatus, PaymentStatus } from '../types'

type SupportedStatus = PaymentStatus | CreditStatus | ChatStatus

const chipMap: Record<
  SupportedStatus,
  { color: ChipProps['color']; icon: ReactElement }
> = {
  Создан: { color: 'default', icon: <ScheduleRounded fontSize="small" /> },
  'Ожидает оплаты': {
    color: 'info',
    icon: <AccessTimeRounded fontSize="small" />,
  },
  Оплачен: { color: 'success', icon: <CheckCircleRounded fontSize="small" /> },
  Истёк: { color: 'warning', icon: <HourglassEmptyRounded fontSize="small" /> },
  Отменён: { color: 'error', icon: <PauseCircleRounded fontSize="small" /> },
  'Не отправлено': {
    color: 'default',
    icon: <ScheduleRounded fontSize="small" />,
  },
  'Отправлено в клуб': {
    color: 'info',
    icon: <AutorenewRounded fontSize="small" />,
  },
  Зачислено: {
    color: 'success',
    icon: <CheckCircleRounded fontSize="small" />,
  },
  'Ошибка зачисления': {
    color: 'error',
    icon: <ErrorRounded fontSize="small" />,
  },
  'Требует ручной обработки': {
    color: 'warning',
    icon: <HourglassEmptyRounded fontSize="small" />,
  },
  Открыт: { color: 'info', icon: <ForumRounded fontSize="small" /> },
  'Есть ответ администратора': {
    color: 'success',
    icon: <ForumRounded fontSize="small" />,
  },
  Закрыт: { color: 'default', icon: <ForumRounded fontSize="small" /> },
}

interface StatusChipProps {
  status: SupportedStatus
  size?: 'small' | 'medium'
}

export const StatusChip = ({ status, size = 'small' }: StatusChipProps) => (
  <Chip
    color={chipMap[status].color}
    icon={chipMap[status].icon}
    label={status}
    size={size}
    variant={chipMap[status].color === 'default' ? 'outlined' : 'filled'}
  />
)
