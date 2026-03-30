import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { usePrototype } from '../app/PrototypeContext'
import {
  getBindingByCurrency,
  getClubById,
  getCommissionById,
  getPartnerById,
  getProcessingById,
  processings,
} from '../data/mockData'

export const ModalHub = () => {
  const { allOperations, closeModal, modalState, openModal } = usePrototype()

  if (modalState.type === 'none') {
    return null
  }

  const operation =
    'operationId' in modalState
      ? allOperations.find((item) => item.id === modalState.operationId)
      : null

  const commission =
    modalState.type === 'editCommission'
      ? getCommissionById(modalState.commissionId)
      : null
  const binding =
    modalState.type === 'editBinding'
      ? getBindingByCurrency(modalState.currency)
      : null

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={closeModal}>
      {modalState.type === 'createPartner' ? (
        <>
          <DialogTitle>Создание / редактирование партнёра</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Alert severity="info">
                Карточка партнёра содержит доступные клубы, валюты, процессинги и комиссионный контур
              </Alert>
              <TextField defaultValue="Nova Reach" fullWidth label="Название партнёра" />
              <TextField defaultValue="Алексей Миронов" fullWidth label="Менеджер" />
              <TextField defaultValue="@nova_aff" fullWidth label="Telegram" />
              <TextField defaultValue="До 600 операций в месяц" fullWidth label="План объёма" />
              <TextField defaultValue="PP Poker, X-poker" fullWidth label="Доступные клубы" />
              <TextField defaultValue="RUB, USDT" fullWidth label="Доступные валюты" />
              <TextField defaultValue="RiverPay RUB Gateway, Tether Desk" fullWidth label="Доступные процессинги" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Отмена</Button>
            <Button onClick={closeModal} variant="contained">
              Сохранить партнёра
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'editCommission' && commission ? (
        <>
          <DialogTitle>Комиссия процессинга</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body2">
                {getPartnerById(commission.partnerId).title} • {commission.currency} •{' '}
                {getProcessingById(commission.processingId).title}
              </Typography>
              <TextField defaultValue={commission.commissionRate} fullWidth label="Комиссия партнёра" />
              <TextField defaultValue={commission.settlementWindow} fullWidth label="Окно расчёта" />
              <Alert severity="warning">
                Изменение фиксируется в логе комиссий и влияет только на выбранную связку
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Отмена</Button>
            <Button onClick={closeModal} variant="contained">
              Сохранить комиссию
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'accrualError' && operation ? (
        <>
          <DialogTitle>Ошибка зачисления</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography fontWeight={800}>{operation.id}</Typography>
              <Typography>{operation.issueNote ?? 'Клуб вернул некорректный ответ при зачислении'}</Typography>
              <Alert severity="error">
                Платёж уже получен, для завершения операции нужна повторная отправка или ручная корректировка
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="warning" onClick={() => openModal({ type: 'manualAdjustment', operationId: operation.id })}>
              В ручную обработку
            </Button>
            <Button onClick={() => openModal({ type: 'retryAccrual', operationId: operation.id })} variant="contained">
              Повторить зачисление
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'manualAdjustment' && operation ? (
        <>
          <DialogTitle>Подтверждение ручной корректировки</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography fontWeight={800}>{operation.id}</Typography>
              <Typography>
                Операция будет отмечена как требующая ручной обработки и перейдёт в очередь оператора
              </Typography>
              <TextField
                defaultValue="Проверить баланс в клубе и при необходимости сделать ручную корректировку"
                fullWidth
                label="Комментарий оператора"
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Отмена</Button>
            <Button onClick={closeModal} variant="contained">
              Подтвердить
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'retryAccrual' && operation ? (
        <>
          <DialogTitle>Повторная отправка в API клуба</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography fontWeight={800}>{operation.id}</Typography>
              <Typography color="text.secondary" variant="body2">
                Клуб: {getClubById(operation.clubId).title} • API request ID:{' '}
                {operation.apiRequestId ?? 'ещё не создан'}
              </Typography>
              <Alert severity="info">
                Система повторно отправит запрос в API клуба и создаст новое событие в истории операции
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Отмена</Button>
            <Button onClick={closeModal} variant="contained">
              Отправить повторно
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'paymentExpired' && operation ? (
        <>
          <DialogTitle>Истечение ссылки на оплату</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography fontWeight={800}>{operation.id}</Typography>
              <Typography>Ссылка на оплату более недействительна</Typography>
              <Alert severity="warning">
                Зачисление в клуб не запускалось, потому что подтверждение оплаты не было получено
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Закрыть</Button>
            <Button onClick={closeModal} variant="contained">
              Создать новую ссылку
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'paymentSuccess' && operation ? (
        <>
          <DialogTitle>Успешное зачисление</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography fontWeight={800}>{operation.id}</Typography>
              <Typography>
                Клуб подтвердил изменение баланса, операция завершена без ручного вмешательства
              </Typography>
              <Alert severity="success">
                Игрок получил {operation.chipAmount.toLocaleString('ru-RU')} фишек
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Закрыть</Button>
            <Button onClick={closeModal} variant="contained">
              Открыть журнал
            </Button>
          </DialogActions>
        </>
      ) : null}

      {modalState.type === 'editBinding' && binding ? (
        <>
          <DialogTitle>Редактирование связки валюта → процессинг</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography fontWeight={800}>Валюта {binding.currency}</Typography>
              <TextField defaultValue={binding.processingId} fullWidth label="Процессинг" select>
                {processings
                  .filter(
                    (processing) =>
                      processing.currencies.includes(binding.currency) ||
                      processing.status === 'Резерв',
                  )
                  .map((processing) => (
                    <MenuItem key={processing.id} value={processing.id}>
                      {processing.title}
                    </MenuItem>
                  ))}
              </TextField>
              <Alert severity="info">
                Владелец настраивает, какой процессинг подставляется по валюте и нужен ли PDF-чек
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Отмена</Button>
            <Button onClick={closeModal} variant="contained">
              Сохранить связку
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  )
}
