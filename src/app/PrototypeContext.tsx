import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from 'react'

import {
  calculateChipAmount,
  chatThreads as initialChatThreads,
  getBindingByCurrency,
  getClubById,
  getProcessingById,
  operations,
  playerDefaultDraft,
  playerScenarioIssueNotes,
  playerScenarioMeta,
  playerScenarioTimelines,
} from '../data/mockData'
import type {
  ChatAttachment,
  ChatMessage,
  DemoModalState,
  DetailTab,
  Operation,
  PaymentScenario,
  PlayerDraft,
  PrototypeSessionState,
  ReceiptAttachment,
} from '../types'

const STORAGE_KEY = 'autocassa.prototype.session.v3'

interface PrototypeContextValue {
  playerDraft: PlayerDraft
  setPlayerDraft: Dispatch<SetStateAction<PlayerDraft>>
  statusScenario: PaymentScenario
  setStatusScenario: (scenario: PaymentScenario) => void
  playerOperationCreated: boolean
  startPlayerOperation: () => void
  resetPlayerOperation: () => void
  playerPromoDismissed: boolean
  dismissPlayerPromo: () => void
  playerReceiptAttachment?: ReceiptAttachment
  uploadPlayerReceipt: (attachment: ReceiptAttachment) => void
  currentPlayerOperation: Operation
  allOperations: Operation[]
  selectedOperationId: string
  setSelectedOperationId: Dispatch<SetStateAction<string>>
  detailTab: DetailTab
  setDetailTab: Dispatch<SetStateAction<DetailTab>>
  modalState: DemoModalState
  openModal: (modal: DemoModalState) => void
  closeModal: () => void
  chatOpen: boolean
  setChatOpen: Dispatch<SetStateAction<boolean>>
  chatMessages: Record<string, ChatMessage[]>
  sendChatMessage: (
    operationId: string,
    text: string,
    attachments?: ChatAttachment[],
  ) => void
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null)

const defaultSessionState: PrototypeSessionState = {
  playerDraft: playerDefaultDraft,
  statusScenario: 'awaiting',
  playerOperationCreated: false,
  playerPromoDismissed: false,
  selectedOperationId: operations[0].id,
  detailTab: 'summary',
  modalState: { type: 'none' },
  chatOpen: false,
  chatMessages: initialChatThreads,
}

const loadSessionState = (): PrototypeSessionState => {
  if (typeof window === 'undefined') {
    return defaultSessionState
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return defaultSessionState
    }

    const parsed = JSON.parse(raw) as Partial<PrototypeSessionState>

    return {
      ...defaultSessionState,
      ...parsed,
      playerDraft: {
        ...playerDefaultDraft,
        ...parsed.playerDraft,
      },
      modalState: parsed.modalState ?? { type: 'none' },
      chatMessages: parsed.chatMessages ?? initialChatThreads,
    }
  } catch {
    return defaultSessionState
  }
}

const buildCurrentPlayerOperation = (
  draft: PlayerDraft,
  scenario: PaymentScenario,
  receiptAttachment?: ReceiptAttachment,
): Operation => {
  const reference = operations[0]
  const binding = getBindingByCurrency(draft.currency)
  const processing = getProcessingById(binding.processingId)
  const club = getClubById(draft.clubId)
  const scenarioMeta = playerScenarioMeta[scenario]
  const amount = Number(draft.amount) || 0
  const chipAmount = calculateChipAmount(
    amount,
    draft.clubId,
    draft.currency,
    processing.id,
  )
  const receiptRequired = processing.requiresReceiptUpload
  const receiptStatus = receiptRequired ? scenarioMeta.receiptStatus : 'not_required'
  const apiRequestId =
    scenario === 'processing' ||
    scenario === 'success' ||
    scenario === 'credit_error' ||
    scenario === 'manual'
      ? `${club.iconKey.toLowerCase()}-req-${processing.code.length}${amount || 0}`
      : undefined

  return {
    ...reference,
    clubId: club.id,
    clubNumber: draft.clubNumber,
    accountId: draft.accountId,
    amount,
    chipAmount,
    currency: draft.currency,
    processingId: processing.id,
    confirmationMode: processing.confirmationMode,
    paymentStatus: scenarioMeta.paymentStatus,
    creditStatus: scenarioMeta.creditStatus,
    chatStatus:
      scenario === 'expired' || scenario === 'payment_error'
        ? 'Закрыт'
        : scenario === 'processing' ||
            scenario === 'success' ||
            scenario === 'credit_error'
          ? 'Есть ответ администратора'
          : 'Открыт',
    linkExpiresIn: scenario === 'expired' ? '00:00' : receiptRequired ? '20:00' : '14:32',
    paymentLink: `https://pay.autocassa.demo/${reference.id}`,
    issueNote: playerScenarioIssueNotes[scenario],
    apiRequestId,
    timeline: playerScenarioTimelines[scenario],
    receiptRequired,
    receiptStatus,
    receiptAttachment: receiptRequired ? receiptAttachment : undefined,
    receiptReviewedAt:
      receiptRequired &&
      !!receiptAttachment &&
      (scenario === 'processing' ||
        scenario === 'success' ||
        scenario === 'credit_error' ||
        scenario === 'manual')
        ? 'сейчас'
        : undefined,
    processingReviewEta: processing.reviewEtaLabel,
    logs: [
      {
        id: `${reference.id}-log-create`,
        time: 'сейчас',
        title: 'Операция создана',
        description: receiptRequired
          ? 'Показаны реквизиты для оплаты'
          : 'Ссылка на оплату создана',
      },
      ...(receiptRequired && receiptAttachment
        ? [
            {
              id: `${reference.id}-log-receipt`,
              time: receiptAttachment.uploadedAt,
              title: 'Чек загружен',
              description: receiptAttachment.name,
            },
          ]
        : []),
      ...(scenario === 'receipt_review'
        ? [
            {
              id: `${reference.id}-log-review`,
              time: 'сейчас',
              title: 'Чек на сверке',
              description: processing.reviewEtaLabel ?? 'Ожидается подтверждение процессинга',
            },
          ]
        : []),
      ...(scenario === 'processing'
        ? [
            {
              id: `${reference.id}-log-processing`,
              time: 'сейчас',
              title: 'Отправлено в клуб',
              description: 'Ожидается ответ API клуба',
            },
          ]
        : []),
      ...(scenario === 'credit_error'
        ? [
            {
              id: `${reference.id}-log-credit-error`,
              time: 'сейчас',
              title: 'Ошибка зачисления',
              description: 'Клуб вернул ошибку при callback',
            },
          ]
        : []),
      ...(scenario === 'manual'
        ? [
            {
              id: `${reference.id}-log-manual`,
              time: 'сейчас',
              title: 'Передано оператору',
              description: 'Операция ждёт ручной проверки',
            },
          ]
        : []),
      ...(scenario === 'success'
        ? [
            {
              id: `${reference.id}-log-success`,
              time: 'сейчас',
              title: 'Баланс зачислен',
              description: `Игрок получил ${chipAmount.toLocaleString('ru-RU')} фишек`,
            },
          ]
        : []),
    ],
  }
}

export const PrototypeProvider = ({ children }: PropsWithChildren) => {
  const persistedState = useMemo(loadSessionState, [])

  const [playerDraft, setPlayerDraft] = useState<PlayerDraft>(persistedState.playerDraft)
  const [statusScenario, setStatusScenarioState] = useState<PaymentScenario>(
    persistedState.statusScenario,
  )
  const [playerOperationCreated, setPlayerOperationCreated] = useState(
    persistedState.playerOperationCreated,
  )
  const [playerPromoDismissed, setPlayerPromoDismissed] = useState(
    persistedState.playerPromoDismissed,
  )
  const [playerReceiptAttachment, setPlayerReceiptAttachment] = useState<
    ReceiptAttachment | undefined
  >(persistedState.playerReceiptAttachment)
  const [selectedOperationId, setSelectedOperationId] = useState(
    persistedState.selectedOperationId,
  )
  const [detailTab, setDetailTab] = useState<DetailTab>(persistedState.detailTab)
  const [modalState, setModalState] = useState<DemoModalState>(persistedState.modalState)
  const [chatOpen, setChatOpen] = useState(persistedState.chatOpen)
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(
    persistedState.chatMessages,
  )

  const setStatusScenario = (scenario: PaymentScenario) => {
    startTransition(() => {
      setStatusScenarioState(scenario)
    })
  }

  const startPlayerOperation = () => {
    const processing = getProcessingById(getBindingByCurrency(playerDraft.currency).processingId)

    setPlayerOperationCreated(true)
    setPlayerReceiptAttachment(undefined)
    setStatusScenario(processing.confirmationMode === 'receipt_review' ? 'receipt_upload' : 'awaiting')
  }

  const resetPlayerOperation = () => {
    setPlayerOperationCreated(false)
    setPlayerReceiptAttachment(undefined)
    setStatusScenario('awaiting')
  }

  const uploadPlayerReceipt = (attachment: ReceiptAttachment) => {
    setPlayerReceiptAttachment(attachment)
    setPlayerOperationCreated(true)
    setStatusScenario('receipt_review')
  }

  const currentPlayerOperation = useMemo(
    () => buildCurrentPlayerOperation(playerDraft, statusScenario, playerReceiptAttachment),
    [playerDraft, playerReceiptAttachment, statusScenario],
  )

  const allOperations = useMemo(
    () =>
      playerOperationCreated
        ? [
            currentPlayerOperation,
            ...operations.filter((operation) => operation.id !== currentPlayerOperation.id),
          ]
        : operations,
    [currentPlayerOperation, playerOperationCreated],
  )

  const pushAdminReply = useEffectEvent((operationId: string) => {
    setChatMessages((previous) => ({
      ...previous,
      [operationId]: [
        ...(previous[operationId] ?? []),
        {
          id: `admin-${Date.now()}`,
          author: 'admin',
          text: 'Сообщение получено, оператор уже видит его в Telegram и ответит здесь',
          time: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    }))
  })

  const sendChatMessage = (
    operationId: string,
    text: string,
    attachments: ChatAttachment[] = [],
  ) => {
    if (!text.trim() && attachments.length === 0) {
      return
    }

    const nextMessage: ChatMessage = {
      id: `player-${Date.now()}`,
      author: 'player',
      text: text.trim() || 'Прикрепляю материалы по операции',
      time: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setChatMessages((previous) => ({
      ...previous,
      [operationId]: [...(previous[operationId] ?? []), nextMessage],
    }))

    window.setTimeout(() => {
      pushAdminReply(operationId)
    }, 900)
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const snapshot: PrototypeSessionState = {
      playerDraft,
      statusScenario,
      playerOperationCreated,
      playerPromoDismissed,
      playerReceiptAttachment,
      selectedOperationId,
      detailTab,
      modalState,
      chatOpen,
      chatMessages,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }, [
    chatMessages,
    chatOpen,
    detailTab,
    modalState,
    playerDraft,
    playerOperationCreated,
    playerPromoDismissed,
    playerReceiptAttachment,
    selectedOperationId,
    statusScenario,
  ])

  const value = useMemo<PrototypeContextValue>(
    () => ({
      playerDraft,
      setPlayerDraft,
      statusScenario,
      setStatusScenario,
      playerOperationCreated,
      startPlayerOperation,
      resetPlayerOperation,
      playerPromoDismissed,
      dismissPlayerPromo: () => setPlayerPromoDismissed(true),
      playerReceiptAttachment,
      uploadPlayerReceipt,
      currentPlayerOperation,
      allOperations,
      selectedOperationId,
      setSelectedOperationId,
      detailTab,
      setDetailTab,
      modalState,
      openModal: setModalState,
      closeModal: () => setModalState({ type: 'none' }),
      chatOpen,
      setChatOpen,
      chatMessages,
      sendChatMessage,
    }),
    [
      allOperations,
      chatMessages,
      chatOpen,
      currentPlayerOperation,
      detailTab,
      modalState,
      playerDraft,
      playerOperationCreated,
      playerPromoDismissed,
      playerReceiptAttachment,
      selectedOperationId,
      statusScenario,
    ],
  )

  return (
    <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
  )
}

export const usePrototype = () => {
  const context = useContext(PrototypeContext)

  if (!context) {
    throw new Error('usePrototype must be used within PrototypeProvider')
  }

  return context
}
