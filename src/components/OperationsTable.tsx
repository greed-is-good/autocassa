import {
  HistoryRounded,
  ManageAccountsRounded,
  OpenInNewRounded,
  ReplayRounded,
} from '@mui/icons-material'
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'

import {
  formatAmount,
  getClubById,
  getPartnerById,
  getProcessingById,
} from '../data/mockData'
import type { Operation } from '../types'
import { StatusChip } from './StatusChip'

interface OperationsTableProps {
  operations: Operation[]
  selectedId?: string
  showPartner?: boolean
  showActions?: boolean
  onSelect?: (operationId: string) => void
  onShowSummary?: (operationId: string) => void
  onShowHistory?: (operationId: string) => void
  onSendManual?: (operationId: string) => void
  onRetry?: (operationId: string) => void
}

export const OperationsTable = ({
  operations,
  selectedId,
  showPartner = false,
  showActions = false,
  onSelect,
  onShowSummary,
  onShowHistory,
  onSendManual,
  onRetry,
}: OperationsTableProps) => (
  <TableContainer className="autocassa-scrollbar" sx={{ maxHeight: 560 }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Операция</TableCell>
          <TableCell>Клуб</TableCell>
          {showPartner ? <TableCell>Партнёр</TableCell> : null}
          <TableCell>Аккаунт</TableCell>
          <TableCell>Сумма</TableCell>
          <TableCell>Процессинг</TableCell>
          <TableCell>Статус оплаты</TableCell>
          <TableCell>Статус зачисления</TableCell>
          {showActions ? <TableCell align="right">Действия</TableCell> : null}
        </TableRow>
      </TableHead>
      <TableBody>
        {operations.map((operation) => {
          const club = getClubById(operation.clubId)
          const partner = getPartnerById(operation.partnerId)
          const processing = getProcessingById(operation.processingId)
          const isSelected = operation.id === selectedId

          return (
            <TableRow
              hover
              key={operation.id}
              onClick={() => onSelect?.(operation.id)}
              sx={{
                backgroundColor: isSelected ? 'rgba(31,115,242,0.06)' : 'transparent',
                cursor: onSelect ? 'pointer' : 'default',
              }}
            >
              <TableCell>
                <Stack spacing={0.35}>
                  <Typography fontWeight={800}>{operation.id}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {operation.createdAt}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack spacing={0.35}>
                  <Typography fontWeight={700}>{club.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {club.clubNumber}
                  </Typography>
                </Stack>
              </TableCell>
              {showPartner ? (
                <TableCell>
                  <Typography fontWeight={700}>{partner.title}</Typography>
                </TableCell>
              ) : null}
              <TableCell>{operation.accountId}</TableCell>
              <TableCell>
                <Stack spacing={0.25}>
                  <Typography fontWeight={800}>
                    {formatAmount(operation.amount, operation.currency)} {operation.currency}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Ссылка {operation.linkExpiresIn}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack spacing={0.25}>
                  <Typography fontWeight={700}>{processing.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {processing.code}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <StatusChip status={operation.paymentStatus} />
              </TableCell>
              <TableCell>
                <StatusChip status={operation.creditStatus} />
              </TableCell>
              {showActions ? (
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                    <Tooltip title="Открыть детали">
                      <IconButton
                        color="primary"
                        onClick={(event) => {
                          event.stopPropagation()
                          onShowSummary?.(operation.id)
                        }}
                      >
                        <OpenInNewRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="История статусов">
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation()
                          onShowHistory?.(operation.id)
                        }}
                      >
                        <HistoryRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ручная обработка">
                      <IconButton
                        color="warning"
                        onClick={(event) => {
                          event.stopPropagation()
                          onSendManual?.(operation.id)
                        }}
                      >
                        <ManageAccountsRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Повторить зачисление">
                      <IconButton
                        color="success"
                        onClick={(event) => {
                          event.stopPropagation()
                          onRetry?.(operation.id)
                        }}
                      >
                        <ReplayRounded />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              ) : null}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </TableContainer>
)
