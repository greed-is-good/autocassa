export type Role = 'player' | 'partner' | 'owner'

export type Currency = 'RUB' | 'KZT' | 'USDT'

export type PaymentStatus =
  | 'Создан'
  | 'Ожидает оплаты'
  | 'Оплачен'
  | 'Истёк'
  | 'Отменён'

export type CreditStatus =
  | 'Не отправлено'
  | 'Отправлено в клуб'
  | 'Зачислено'
  | 'Ошибка зачисления'
  | 'Требует ручной обработки'

export type ChatStatus = 'Открыт' | 'Есть ответ администратора' | 'Закрыт'

export type TimelineState = 'done' | 'active' | 'pending' | 'error'

export type PaymentScenario =
  | 'awaiting'
  | 'expired'
  | 'payment_error'
  | 'receipt_upload'
  | 'receipt_review'
  | 'processing'
  | 'credit_error'
  | 'manual'
  | 'success'

export type DetailTab = 'summary' | 'history'

export type ConfirmationMode = 'auto' | 'receipt_review'

export type ReceiptStatus =
  | 'not_required'
  | 'awaiting_upload'
  | 'uploaded'
  | 'under_review'
  | 'approved'

export interface Club {
  id: string
  title: string
  appName: string
  iconKey: string
  clubNumber: string
  apiStatus: 'API подключено' | 'Вне MVP'
  endpoint: string
  lastCheckStatus: 'Успешно' | 'С предупреждением' | 'Ошибка'
  lastCheckAt: string
  lastCheckNote: string
}

export interface BankDetailLine {
  label: string
  value: string
}

export interface Processing {
  id: string
  title: string
  code: string
  currencies: Currency[]
  status: 'Активен' | 'На мониторинге' | 'Резерв'
  priority: number
  settlementNote: string
  conditionLabel: string
  providerNote: string
  confirmationMode: ConfirmationMode
  requiresReceiptUpload: boolean
  reviewEtaLabel?: string
  bankDetails?: BankDetailLine[]
}

export interface CurrencyBinding {
  currency: Currency
  processingId: string
  rateLabel: string
  payoutWindow: string
  systemNote: string
  ownerEnabled: boolean
}

export interface Partner {
  id: string
  title: string
  manager: string
  telegram: string
  allowedClubIds: string[]
  allowedCurrencies: Currency[]
  allowedProcessingIds: string[]
  monthlyPlan: string
  commissionNote: string
}

export interface ChipPriceRule {
  id: string
  clubId: string
  currency: Currency
  processingId: string
  pricePerChip: number
  updatedAt: string
  updatedBy: string
}

export interface PartnerProcessingCommission {
  id: string
  partnerId: string
  currency: Currency
  processingId: string
  commissionRate: string
  settlementWindow: string
  updatedAt: string
  updatedBy: string
}

export interface CommissionLogItem {
  id: string
  partnerId: string
  changedAt: string
  changedBy: string
  summary: string
}

export interface TimelineItem {
  label: string
  time: string
  state: TimelineState
}

export interface ReceiptAttachment {
  id: string
  name: string
  size: string
  uploadedAt: string
  reviewNote?: string
}

export interface OperationLogItem {
  id: string
  time: string
  title: string
  description: string
}

export interface Operation {
  id: string
  createdAt: string
  partnerId: string
  clubId: string
  clubNumber: string
  accountId: string
  amount: number
  chipAmount: number
  currency: Currency
  processingId: string
  confirmationMode: ConfirmationMode
  paymentStatus: PaymentStatus
  creditStatus: CreditStatus
  chatStatus: ChatStatus
  linkExpiresIn: string
  paymentLink: string
  issueNote?: string
  apiRequestId?: string
  timeline: TimelineItem[]
  receiptRequired: boolean
  receiptStatus: ReceiptStatus
  receiptAttachment?: ReceiptAttachment
  receiptReviewedAt?: string
  processingReviewEta?: string
  logs: OperationLogItem[]
}

export interface ChatAttachment {
  id: string
  kind: 'Скриншот' | 'Файл' | 'Видео'
  name: string
  size: string
}

export interface ChatMessage {
  id: string
  author: 'player' | 'admin' | 'system'
  text: string
  time: string
  attachments?: ChatAttachment[]
}

export interface PlayerDraft {
  clubId: string
  clubNumber: string
  accountId: string
  amount: string
  currency: Currency
  acceptResponsibility: boolean
  acceptTerms: boolean
}

export interface DashboardAlert {
  id: string
  severity: 'info' | 'success' | 'warning' | 'error'
  title: string
  description: string
  meta: string
}

export interface PartnerReportRow {
  id: string
  period: string
  operations: number
  grossAmount: string
  successRate: string
  settlementStatus: 'Готов к сверке' | 'Ожидает подтверждения' | 'Закрыт'
}

export interface OwnerQuickLink {
  id: string
  label: string
  path: string
  counter: string
}

export interface CurrencyAvailability {
  currency: Currency
  binding: CurrencyBinding
  enabled: boolean
  reason?: string
}

export type DemoModalState =
  | { type: 'none' }
  | { type: 'createPartner' }
  | { type: 'editCommission'; commissionId: string }
  | { type: 'accrualError'; operationId: string }
  | { type: 'manualAdjustment'; operationId: string }
  | { type: 'retryAccrual'; operationId: string }
  | { type: 'paymentExpired'; operationId: string }
  | { type: 'paymentSuccess'; operationId: string }
  | { type: 'editBinding'; currency: Currency }

export interface PrototypeSessionState {
  playerDraft: PlayerDraft
  statusScenario: PaymentScenario
  playerOperationCreated: boolean
  playerPromoDismissed: boolean
  playerReceiptAttachment?: ReceiptAttachment
  selectedOperationId: string
  detailTab: DetailTab
  modalState: DemoModalState
  chatOpen: boolean
  chatMessages: Record<string, ChatMessage[]>
}
