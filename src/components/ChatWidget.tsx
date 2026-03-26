import {
  AttachFileRounded,
  ChatRounded,
  CloseRounded,
  SendRounded,
  SmartToyRounded,
  VideoFileRounded,
} from '@mui/icons-material'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { usePrototype } from '../app/PrototypeContext'
import {
  attachmentPresets,
  getClubById,
} from '../data/mockData'
import type { ChatAttachment } from '../types'
import { StatusChip } from './StatusChip'

const inferAttachmentKind = (file: File): ChatAttachment['kind'] => {
  if (file.type.startsWith('video/')) {
    return 'Видео'
  }

  if (file.type.startsWith('image/')) {
    return 'Скриншот'
  }

  return 'Файл'
}

const formatFileSize = (size: number) => `${Math.max(1, Math.round(size / 1024))} KB`

export const ChatWidget = () => {
  const location = useLocation()
  const {
    allOperations,
    chatMessages,
    chatOpen,
    currentPlayerOperation,
    selectedOperationId,
    sendChatMessage,
    setChatOpen,
  } = usePrototype()
  const [draftMessage, setDraftMessage] = useState('')
  const [attachmentsOpen, setAttachmentsOpen] = useState(false)
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const activeOperationId = location.pathname.startsWith('/player')
    ? currentPlayerOperation.id
    : selectedOperationId || currentPlayerOperation.id

  const activeOperation =
    allOperations.find((operation) => operation.id === activeOperationId) ??
    currentPlayerOperation

  const activeMessages = useMemo(
    () =>
      chatMessages[activeOperationId] ?? [
        {
          id: 'fallback-system',
          author: 'system' as const,
          text: 'Чат привязан к операции, ответы приходят через Telegram',
          time: 'сейчас',
        },
      ],
    [activeOperationId, chatMessages],
  )

  const handleSend = () => {
    sendChatMessage(activeOperationId, draftMessage, pendingAttachments)
    setDraftMessage('')
    setPendingAttachments([])
  }

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setChatOpen((previous) => !previous)}
        sx={{
          bottom: 28,
          position: 'fixed',
          right: 28,
          zIndex: 1300,
        }}
      >
        {chatOpen ? <CloseRounded /> : <ChatRounded />}
      </Fab>

      {chatOpen ? (
        <Paper
          className="autocassa-panel autocassa-fade-up"
          sx={{
            bottom: 98,
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'calc(100vh - 132px)', sm: 620 },
            maxHeight: 'calc(100vh - 132px)',
            overflow: 'hidden',
            position: 'fixed',
            right: 28,
            width: { xs: 'calc(100vw - 24px)', sm: 440 },
            zIndex: 1300,
          }}
        >
          <Stack
            spacing={1.4}
            sx={{
              background:
                'linear-gradient(135deg, rgba(18,59,132,1), rgba(31,115,242,0.96))',
              color: 'white',
              p: 2,
            }}
          >
            <Stack alignItems="center" direction="row" justifyContent="space-between">
              <Typography fontWeight={800}>Чат с администратором</Typography>
              <IconButton onClick={() => setChatOpen(false)} sx={{ color: 'white' }}>
                <CloseRounded />
              </IconButton>
            </Stack>

            <Stack
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" flexWrap="wrap" gap={0.8}>
                <Chip
                  icon={<SmartToyRounded />}
                  label={`Операция ${activeOperation.id}`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white' }}
                />
                <Chip
                  label={getClubById(activeOperation.clubId).title}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white' }}
                />
              </Stack>
              <StatusChip
                label={
                  activeOperation.chatStatus === 'Есть ответ администратора'
                    ? 'Есть ответ'
                    : activeOperation.chatStatus
                }
                status={activeOperation.chatStatus}
                sx={{
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                  maxWidth: '100%',
                }}
              />
            </Stack>
          </Stack>

          <Stack
            className="autocassa-scrollbar"
            spacing={1.5}
            sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}
          >
            {activeMessages.map((message) =>
              message.author === 'system' ? (
                <Box
                  key={message.id}
                  sx={{
                    alignSelf: 'center',
                    backgroundColor: 'rgba(31,115,242,0.08)',
                    borderRadius: '16px',
                    color: 'text.secondary',
                    maxWidth: '90%',
                    px: 1.5,
                    py: 1,
                  }}
                >
                  <Typography textAlign="center" variant="body2">
                    {message.text}
                  </Typography>
                </Box>
              ) : (
                <Stack
                  alignItems={message.author === 'player' ? 'flex-end' : 'flex-start'}
                  key={message.id}
                  spacing={0.7}
                >
                  <Stack
                    direction={message.author === 'player' ? 'row-reverse' : 'row'}
                    spacing={1}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          message.author === 'player'
                            ? 'secondary.main'
                            : 'rgba(31,115,242,0.14)',
                        color:
                          message.author === 'player' ? 'white' : 'primary.main',
                        height: 34,
                        width: 34,
                      }}
                    >
                      {message.author === 'player' ? 'Вы' : 'A'}
                    </Avatar>
                    <Box
                      sx={{
                        backgroundColor:
                          message.author === 'player'
                            ? 'rgba(31,115,242,0.12)'
                            : 'rgba(255,255,255,0.82)',
                        border: '1px solid rgba(15,23,42,0.06)',
                        borderRadius: '18px',
                        maxWidth: { xs: 300, sm: 340 },
                        p: 1.5,
                      }}
                    >
                      <Typography>{message.text}</Typography>
                      {message.attachments?.length ? (
                        <Stack mt={1.1} spacing={0.8}>
                          {message.attachments.map((attachment) => (
                            <Stack
                              alignItems="center"
                              direction="row"
                              key={attachment.id}
                              spacing={1}
                              sx={{
                                backgroundColor: alpha('#1f73f2', 0.06),
                                borderRadius: '14px',
                                p: 1,
                              }}
                            >
                              <VideoFileRounded fontSize="small" />
                              <Stack spacing={0.2}>
                                <Typography fontWeight={700} variant="body2">
                                  {attachment.name}
                                </Typography>
                                <Typography color="text.secondary" variant="caption">
                                  {attachment.kind} • {attachment.size}
                                </Typography>
                              </Stack>
                            </Stack>
                          ))}
                        </Stack>
                      ) : null}
                    </Box>
                  </Stack>
                  <Typography color="text.secondary" variant="caption">
                    {message.time}
                  </Typography>
                </Stack>
              ),
            )}
          </Stack>

          <Divider />

          <Stack spacing={1.2} sx={{ p: 1.5 }}>
            {pendingAttachments.length > 0 ? (
              <Stack direction="row" flexWrap="wrap" gap={0.8}>
                {pendingAttachments.map((attachment) => (
                  <Chip
                    key={attachment.id}
                    label={`${attachment.kind}: ${attachment.name}`}
                    onDelete={() =>
                      setPendingAttachments((previous) =>
                        previous.filter((item) => item.id !== attachment.id),
                      )
                    }
                    size="small"
                  />
                ))}
              </Stack>
            ) : null}

            <Stack alignItems="flex-end" direction="row" spacing={1}>
              <IconButton onClick={() => setAttachmentsOpen(true)}>
                <AttachFileRounded />
              </IconButton>
              <TextField
                fullWidth
                maxRows={3}
                multiline
                placeholder="Напишите сообщение по текущей операции..."
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
              />
              <IconButton color="primary" onClick={handleSend}>
                <SendRounded />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ) : null}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={attachmentsOpen}
        onClose={() => setAttachmentsOpen(false)}
      >
        <DialogTitle>Вложения к чату</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.2}>
            <Typography color="text.secondary" variant="body2">
              Можно приложить скриншот, файл или видео
            </Typography>

            {attachmentPresets.map((attachment) => {
              const selected = pendingAttachments.some((item) => item.id === attachment.id)

              return (
                <Button
                  key={attachment.id}
                  onClick={() =>
                    setPendingAttachments((previous) =>
                      selected
                        ? previous.filter((item) => item.id !== attachment.id)
                        : [...previous, attachment],
                    )
                  }
                  sx={{ justifyContent: 'space-between' }}
                  variant={selected ? 'contained' : 'outlined'}
                >
                  <Stack alignItems="flex-start">
                    <Typography fontWeight={800}>{attachment.name}</Typography>
                    <Typography variant="body2">
                      {attachment.kind} • {attachment.size}
                    </Typography>
                  </Stack>
                </Button>
              )
            })}

            <input
              hidden
              multiple
              ref={fileInputRef}
              type="file"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []).map((file) => ({
                  id: `${file.name}-${file.size}`,
                  kind: inferAttachmentKind(file),
                  name: file.name,
                  size: formatFileSize(file.size),
                }))

                setPendingAttachments((previous) => [...previous, ...files])
                event.target.value = ''
              }}
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              startIcon={<AttachFileRounded />}
              variant="text"
            >
              Выбрать файл с компьютера
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttachmentsOpen(false)}>Готово</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
