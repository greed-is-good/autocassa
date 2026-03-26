import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  startTransition,
  useContext,
  useEffectEvent,
  useMemo,
  useState,
} from 'react'

import {
  chatThreads as initialChatThreads,
  getBindingByCurrency,
  operations,
  playerDefaultDraft,
  playerScenarioMeta,
} from '../data/mockData'
import type {
  ChatAttachment,
  ChatMessage,
  DemoModalState,
  DetailTab,
  Operation,
  PaymentScenario,
  PlayerDraft,
} from '../types'

interface PrototypeContextValue {
  playerDraft: PlayerDraft
  setPlayerDraft: Dispatch<SetStateAction<PlayerDraft>>
  statusScenario: PaymentScenario
  setStatusScenario: (scenario: PaymentScenario) => void
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

const buildCurrentPlayerOperation = (
  draft: PlayerDraft,
  scenario: PaymentScenario,
): Operation => {
  const reference = operations[0]
  const binding = getBindingByCurrency(draft.currency)
  const meta = playerScenarioMeta[scenario]

  return {
    ...reference,
    clubId: draft.clubId,
    clubNumber: draft.clubNumber,
    accountId: draft.accountId,
    amount: Number(draft.amount) || 0,
    currency: draft.currency,
    processingId: binding.processingId,
    paymentStatus: meta.paymentStatus,
    creditStatus: meta.creditStatus,
    timeline: (() => {
      if (scenario === 'awaiting') return operations[5].timeline
      if (scenario === 'expired') return operations[3].timeline
      if (scenario === 'payment_error') return operations[6].timeline
      if (scenario === 'processing') return operations[1].timeline
      if (scenario === 'credit_error') return operations[2].timeline
      if (scenario === 'manual') return operations[4].timeline
      return operations[0].timeline
    })(),
    issueNote:
      scenario === 'credit_error'
        ? operations[2].issueNote
        : scenario === 'manual'
          ? operations[4].issueNote
          : scenario === 'expired'
            ? operations[3].issueNote
            : scenario === 'payment_error'
              ? operations[6].issueNote
              : undefined,
    apiRequestId:
      scenario === 'processing' || scenario === 'success'
        ? 'pp-req-778241'
        : scenario === 'credit_error'
          ? 'sp-req-542201'
          : scenario === 'manual'
            ? 'pp-req-778190'
            : undefined,
  }
}

export const PrototypeProvider = ({ children }: PropsWithChildren) => {
  const [playerDraft, setPlayerDraft] = useState<PlayerDraft>(playerDefaultDraft)
  const [statusScenario, setStatusScenarioState] =
    useState<PaymentScenario>('success')
  const [selectedOperationId, setSelectedOperationId] = useState(operations[0].id)
  const [detailTab, setDetailTab] = useState<DetailTab>('summary')
  const [modalState, setModalState] = useState<DemoModalState>({ type: 'none' })
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] =
    useState<Record<string, ChatMessage[]>>(initialChatThreads)

  const setStatusScenario = (scenario: PaymentScenario) => {
    startTransition(() => {
      setStatusScenarioState(scenario)
    })
  }

  const currentPlayerOperation = useMemo(
    () => buildCurrentPlayerOperation(playerDraft, statusScenario),
    [playerDraft, statusScenario],
  )

  const allOperations = useMemo(
    () => [
      currentPlayerOperation,
      ...operations.filter((operation) => operation.id !== currentPlayerOperation.id),
    ],
    [currentPlayerOperation],
  )

  const pushAdminReply = useEffectEvent((operationId: string) => {
    setChatMessages((previous) => ({
      ...previous,
      [operationId]: [
        ...(previous[operationId] ?? []),
        {
          id: `admin-${Date.now()}`,
          author: 'admin',
          text: 'Сообщение получено, оператор уже видит его в Telegram и ответит в этом окне',
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
      text: text.trim() || 'Прикрепляю материалы по операции.',
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

  const value = useMemo<PrototypeContextValue>(
    () => ({
      playerDraft,
      setPlayerDraft,
      statusScenario,
      setStatusScenario,
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
