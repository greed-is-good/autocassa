import type {
  ChatMessage,
  ChipPriceRule,
  Club,
  CommissionLogItem,
  CreditStatus,
  Currency,
  CurrencyAvailability,
  CurrencyBinding,
  Operation,
  OwnerQuickLink,
  Partner,
  PartnerProcessingCommission,
  PartnerReportRow,
  PaymentScenario,
  PaymentStatus,
  PlayerDraft,
  Processing,
  ReceiptStatus,
  TimelineItem,
} from '../types'

const timelineLabels = [
  'Платёж создан',
  'Ожидает оплаты',
  'Оплата получена',
  'Отправлено в клуб',
  'Баланс зачислен',
] as const

type TimelineScenario =
  | 'created'
  | 'awaiting'
  | 'expired'
  | 'payment_error'
  | 'receipt_upload'
  | 'receipt_review'
  | 'processing'
  | 'credit_error'
  | 'manual'
  | 'success'

const makeTimeline = (
  scenario: TimelineScenario,
  times: [string, string, string, string, string],
): TimelineItem[] => {
  const statesByScenario: Record<TimelineScenario, TimelineItem['state'][]> = {
    created: ['active', 'pending', 'pending', 'pending', 'pending'],
    awaiting: ['done', 'active', 'pending', 'pending', 'pending'],
    expired: ['done', 'error', 'pending', 'pending', 'pending'],
    payment_error: ['done', 'error', 'pending', 'pending', 'pending'],
    receipt_upload: ['done', 'active', 'pending', 'pending', 'pending'],
    receipt_review: ['done', 'active', 'pending', 'pending', 'pending'],
    processing: ['done', 'done', 'done', 'active', 'pending'],
    credit_error: ['done', 'done', 'done', 'error', 'pending'],
    manual: ['done', 'done', 'done', 'error', 'pending'],
    success: ['done', 'done', 'done', 'done', 'done'],
  }

  return timelineLabels.map((label, index) => ({
    label,
    time: times[index],
    state: statesByScenario[scenario][index],
  }))
}

export const clubs: Club[] = [
  {
    id: 'club-royal',
    title: 'PP Poker',
    appName: 'PP Poker',
    iconKey: 'PP',
    clubNumber: 'PP-104',
    apiStatus: 'API подключено',
    endpoint: 'https://api.pppoker.app/partner/balance/topup',
    lastCheckStatus: 'Успешно',
    lastCheckAt: '27.03.2026, 18:42',
    lastCheckNote: 'Ответ API за 420 мс',
  },
  {
    id: 'club-volna',
    title: 'X-poker',
    appName: 'X-poker',
    iconKey: 'XP',
    clubNumber: 'XP-208',
    apiStatus: 'API подключено',
    endpoint: 'https://gateway.x-poker.io/api/v1/deposit',
    lastCheckStatus: 'Успешно',
    lastCheckAt: '27.03.2026, 18:37',
    lastCheckNote: 'Подпись webhook подтверждается штатно',
  },
  {
    id: 'club-summit',
    title: 'Suprema Poker',
    appName: 'Suprema Poker',
    iconKey: 'SP',
    clubNumber: 'SP-331',
    apiStatus: 'API подключено',
    endpoint: 'https://api.supremapoker.com/club/balance/credit',
    lastCheckStatus: 'С предупреждением',
    lastCheckAt: '27.03.2026, 18:35',
    lastCheckNote: 'Пиковая задержка до 1.8 сек',
  },
  {
    id: 'club-lucky',
    title: 'pokerok',
    appName: 'pokerok',
    iconKey: 'PO',
    clubNumber: 'PO-502',
    apiStatus: 'Вне MVP',
    endpoint: 'API не подключено',
    lastCheckStatus: 'Ошибка',
    lastCheckAt: '27.03.2026, 17:55',
    lastCheckNote: 'Клуб ожидает отдельную интеграцию',
  },
]

export const processings: Processing[] = [
  {
    id: 'proc-riverpay',
    title: 'RiverPay RUB Gateway',
    code: 'RUB-RIVER',
    currencies: ['RUB'],
    status: 'Активен',
    priority: 1,
    settlementNote: 'Ссылка живёт 15 минут, подтверждение 1-2 минуты',
    conditionLabel: 'Автоподтверждение по webhook',
    providerNote: 'Основной RUB-маршрут',
    confirmationMode: 'auto',
    requiresReceiptUpload: false,
  },
  {
    id: 'proc-kaspiflow',
    title: 'KaspiFlow KZT',
    code: 'KZT-KASPI',
    currencies: ['KZT'],
    status: 'Активен',
    priority: 1,
    settlementNote: 'Оплата по реквизитам, сверка PDF-чека до 7 минут',
    conditionLabel: 'Ручное подтверждение по PDF-чеку',
    providerNote: 'KZT-маршрут с проверкой чека',
    confirmationMode: 'receipt_review',
    requiresReceiptUpload: true,
    reviewEtaLabel: 'Сверка чека до 7 минут',
    bankDetails: [
      { label: 'Получатель', value: 'TOO KaspiFlow Merchant' },
      { label: 'Банк', value: 'Kaspi Bank' },
      { label: 'Номер карты', value: '4400 4301 2200 1848' },
      { label: 'Комментарий', value: 'Укажите номер операции в назначении' },
    ],
  },
  {
    id: 'proc-tetherdesk',
    title: 'Tether Desk',
    code: 'USDT-TRC20',
    currencies: ['USDT'],
    status: 'На мониторинге',
    priority: 1,
    settlementNote: 'Подтверждение после 1 сетевого блока',
    conditionLabel: 'TRC20, окно подтверждения до 7 минут',
    providerNote: 'Основной USDT-маршрут',
    confirmationMode: 'auto',
    requiresReceiptUpload: false,
  },
  {
    id: 'proc-backup',
    title: 'Backup Settlement Hub',
    code: 'RESERVE',
    currencies: ['RUB', 'KZT'],
    status: 'Резерв',
    priority: 2,
    settlementNote: 'Резервный маршрут следующего спринта',
    conditionLabel: 'Не доступен игроку напрямую',
    providerNote: 'Резервный маршрут',
    confirmationMode: 'auto',
    requiresReceiptUpload: false,
  },
]

export const currencyBindings: CurrencyBinding[] = [
  {
    currency: 'RUB',
    processingId: 'proc-riverpay',
    rateLabel: '1 RUB = 1 RUB',
    payoutWindow: 'Подтверждение до 2 минут',
    systemNote: 'Маршрут назначается автоматически',
    ownerEnabled: true,
  },
  {
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    rateLabel: '1 KZT = 1 KZT',
    payoutWindow: 'Проверка чека до 7 минут',
    systemNote: 'После оплаты нужен PDF-чек',
    ownerEnabled: true,
  },
  {
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    rateLabel: '1 USDT = 1 USDT',
    payoutWindow: '1 подтверждение сети',
    systemNote: 'Маршрут назначается автоматически',
    ownerEnabled: true,
  },
]

export const chipPriceRules: ChipPriceRule[] = [
  {
    id: 'chip-royal-rub',
    clubId: 'club-royal',
    currency: 'RUB',
    pricePerChip: 0.1,
    updatedAt: '27.03.2026, 17:10',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'chip-royal-kzt',
    clubId: 'club-royal',
    currency: 'KZT',
    pricePerChip: 0.55,
    updatedAt: '27.03.2026, 17:10',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'chip-royal-usdt',
    clubId: 'club-royal',
    currency: 'USDT',
    pricePerChip: 0.001,
    updatedAt: '27.03.2026, 17:10',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'chip-volna-rub',
    clubId: 'club-volna',
    currency: 'RUB',
    pricePerChip: 0.12,
    updatedAt: '27.03.2026, 17:15',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'chip-volna-kzt',
    clubId: 'club-volna',
    currency: 'KZT',
    pricePerChip: 0.6,
    updatedAt: '27.03.2026, 17:15',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'chip-summit-rub',
    clubId: 'club-summit',
    currency: 'RUB',
    pricePerChip: 0.11,
    updatedAt: '27.03.2026, 17:21',
    updatedBy: 'Денис Самойлов',
  },
  {
    id: 'chip-summit-usdt',
    clubId: 'club-summit',
    currency: 'USDT',
    pricePerChip: 0.0011,
    updatedAt: '27.03.2026, 17:21',
    updatedBy: 'Денис Самойлов',
  },
]

export const partners: Partner[] = [
  {
    id: 'partner-orbit',
    title: 'Orbit Traffic',
    manager: 'Анна Воронова',
    telegram: '@orbit_aff',
    allowedClubIds: ['club-royal', 'club-volna'],
    allowedCurrencies: ['RUB', 'KZT', 'USDT'],
    allowedProcessingIds: ['proc-riverpay', 'proc-kaspiflow', 'proc-tetherdesk'],
    monthlyPlan: 'До 1 500 операций в месяц',
    commissionNote: 'Комиссия задаётся по связке валюта + процессинг',
  },
  {
    id: 'partner-vector',
    title: 'Vector Partners',
    manager: 'Илья Кравцов',
    telegram: '@vector_partners',
    allowedClubIds: ['club-summit'],
    allowedCurrencies: ['RUB', 'USDT'],
    allowedProcessingIds: ['proc-riverpay', 'proc-tetherdesk'],
    monthlyPlan: 'До 900 операций в месяц',
    commissionNote: 'USDT с повышенной маржой',
  },
  {
    id: 'partner-pulse',
    title: 'Pulse Acquisition',
    manager: 'Мария Орлова',
    telegram: '@pulse_ops',
    allowedClubIds: ['club-volna', 'club-summit'],
    allowedCurrencies: ['KZT', 'USDT'],
    allowedProcessingIds: ['proc-kaspiflow', 'proc-tetherdesk'],
    monthlyPlan: 'До 700 операций в месяц',
    commissionNote: 'Ежедневная сверка по закрытию дня',
  },
]

export const partnerProcessingCommissions: PartnerProcessingCommission[] = [
  {
    id: 'commission-orbit-rub',
    partnerId: 'partner-orbit',
    currency: 'RUB',
    processingId: 'proc-riverpay',
    commissionRate: '3.2%',
    settlementWindow: 'T+0',
    updatedAt: '26.03.2026, 14:05',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'commission-orbit-kzt',
    partnerId: 'partner-orbit',
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    commissionRate: '2.8%',
    settlementWindow: 'T+0',
    updatedAt: '26.03.2026, 14:08',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'commission-orbit-usdt',
    partnerId: 'partner-orbit',
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    commissionRate: '1.4%',
    settlementWindow: 'T+1',
    updatedAt: '26.03.2026, 14:12',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'commission-vector-rub',
    partnerId: 'partner-vector',
    currency: 'RUB',
    processingId: 'proc-riverpay',
    commissionRate: '3.6%',
    settlementWindow: 'T+0',
    updatedAt: '25.03.2026, 19:10',
    updatedBy: 'Денис Самойлов',
  },
  {
    id: 'commission-vector-usdt',
    partnerId: 'partner-vector',
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    commissionRate: '1.1%',
    settlementWindow: 'T+1',
    updatedAt: '25.03.2026, 19:12',
    updatedBy: 'Денис Самойлов',
  },
  {
    id: 'commission-pulse-kzt',
    partnerId: 'partner-pulse',
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    commissionRate: '3.1%',
    settlementWindow: 'T+0',
    updatedAt: '25.03.2026, 12:30',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'commission-pulse-usdt',
    partnerId: 'partner-pulse',
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    commissionRate: '1.8%',
    settlementWindow: 'T+1',
    updatedAt: '25.03.2026, 12:32',
    updatedBy: 'Екатерина Петрова',
  },
]

export const commissionLog: CommissionLogItem[] = [
  {
    id: 'commission-log-1',
    partnerId: 'partner-orbit',
    changedAt: '26.03.2026, 14:12',
    changedBy: 'Екатерина Петрова',
    summary: 'USDT / Tether Desk изменён с 1.2% на 1.4%',
  },
  {
    id: 'commission-log-2',
    partnerId: 'partner-orbit',
    changedAt: '26.03.2026, 14:08',
    changedBy: 'Екатерина Петрова',
    summary: 'KZT / KaspiFlow переведён на T+0',
  },
  {
    id: 'commission-log-3',
    partnerId: 'partner-vector',
    changedAt: '25.03.2026, 19:12',
    changedBy: 'Денис Самойлов',
    summary: 'Создана комиссия USDT / Tether Desk',
  },
]

const buildLogs = (
  id: string,
  entries: Array<[string, string, string]>,
) => entries.map(([time, title, description], index) => ({
  id: `${id}-log-${index + 1}`,
  time,
  title,
  description,
}))

export const operations: Operation[] = [
  {
    id: 'AC-240325-1042',
    createdAt: '25.03.2026, 18:42',
    partnerId: 'partner-orbit',
    clubId: 'club-royal',
    clubNumber: 'PP-104',
    accountId: 'PP-882114',
    amount: 12500,
    chipAmount: 125000,
    currency: 'RUB',
    processingId: 'proc-riverpay',
    confirmationMode: 'auto',
    paymentStatus: 'Оплачен',
    creditStatus: 'Зачислено',
    chatStatus: 'Есть ответ администратора',
    linkExpiresIn: '14:32',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1042',
    apiRequestId: 'pp-req-778241',
    timeline: makeTimeline('success', [
      '18:42',
      '18:43',
      '18:45',
      '18:46',
      '18:47',
    ]),
    receiptRequired: false,
    receiptStatus: 'not_required',
    logs: buildLogs('AC-240325-1042', [
      ['18:42', 'Операция создана', 'Игрок получил ссылку на оплату'],
      ['18:45', 'Платёж подтверждён', 'RiverPay прислал webhook об оплате'],
      ['18:46', 'Отправлено в клуб', 'Баланс передан в PP Poker'],
      ['18:47', 'Зачислено', 'Клуб подтвердил изменение баланса'],
    ]),
  },
  {
    id: 'AC-240325-1038',
    createdAt: '25.03.2026, 18:21',
    partnerId: 'partner-orbit',
    clubId: 'club-volna',
    clubNumber: 'XP-208',
    accountId: 'XP-551080',
    amount: 75000,
    chipAmount: 125000,
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    confirmationMode: 'receipt_review',
    paymentStatus: 'Оплачен',
    creditStatus: 'Зачислено',
    chatStatus: 'Открыт',
    linkExpiresIn: '09:14',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1038',
    apiRequestId: 'xp-req-118034',
    timeline: makeTimeline('success', [
      '18:21',
      '18:22',
      '18:24',
      '18:25',
      '18:26',
    ]),
    receiptRequired: true,
    receiptStatus: 'approved',
    receiptAttachment: {
      id: 'receipt-1038',
      name: 'kaspiflow-AC-240325-1038.pdf',
      size: '412 KB',
      uploadedAt: '25.03.2026, 18:22',
      reviewNote: 'Сумма и номер операции совпали',
    },
    receiptReviewedAt: '25.03.2026, 18:24',
    processingReviewEta: 'Сверка до 7 минут',
    logs: buildLogs('AC-240325-1038', [
      ['18:21', 'Операция создана', 'Показаны реквизиты KaspiFlow'],
      ['18:22', 'Чек загружен', 'Игрок прикрепил PDF-чек после оплаты'],
      ['18:24', 'Чек подтверждён', 'KaspiFlow принял платёж после сверки'],
      ['18:25', 'Отправлено в клуб', 'Баланс передан в X-poker'],
      ['18:26', 'Зачислено', 'Клуб подтвердил пополнение'],
    ]),
  },
  {
    id: 'AC-240325-1031',
    createdAt: '25.03.2026, 17:58',
    partnerId: 'partner-vector',
    clubId: 'club-summit',
    clubNumber: 'SP-331',
    accountId: 'SP-219450',
    amount: 180,
    chipAmount: 163636.36,
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    confirmationMode: 'auto',
    paymentStatus: 'Оплачен',
    creditStatus: 'Ошибка зачисления',
    chatStatus: 'Есть ответ администратора',
    linkExpiresIn: '03:42',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1031',
    issueNote: 'API клуба вернул код 422: аккаунт временно заблокирован',
    apiRequestId: 'sp-req-542201',
    timeline: makeTimeline('credit_error', [
      '17:58',
      '17:59',
      '18:03',
      '18:04',
      'ошибка API',
    ]),
    receiptRequired: false,
    receiptStatus: 'not_required',
    logs: buildLogs('AC-240325-1031', [
      ['17:58', 'Операция создана', 'Игрок получил ссылку на оплату'],
      ['18:03', 'Платёж подтверждён', 'Tether Desk прислал подтверждение сети'],
      ['18:04', 'Ошибка зачисления', 'Suprema Poker не принял callback'],
    ]),
  },
  {
    id: 'AC-240325-1025',
    createdAt: '25.03.2026, 17:24',
    partnerId: 'partner-pulse',
    clubId: 'club-volna',
    clubNumber: 'XP-208',
    accountId: 'XP-110944',
    amount: 9200,
    chipAmount: 76666.67,
    currency: 'RUB',
    processingId: 'proc-riverpay',
    confirmationMode: 'auto',
    paymentStatus: 'Истёк',
    creditStatus: 'Не отправлено',
    chatStatus: 'Закрыт',
    linkExpiresIn: '00:00',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1025',
    issueNote: 'Игрок не завершил оплату в пределах окна ссылки',
    timeline: makeTimeline('expired', [
      '17:24',
      '17:39',
      'не получено',
      'не отправлено',
      'не зачислено',
    ]),
    receiptRequired: false,
    receiptStatus: 'not_required',
    logs: buildLogs('AC-240325-1025', [
      ['17:24', 'Операция создана', 'Ссылка на оплату отправлена игроку'],
      ['17:39', 'Ссылка истекла', 'Платёж не был завершён'],
    ]),
  },
  {
    id: 'AC-240325-1019',
    createdAt: '25.03.2026, 16:58',
    partnerId: 'partner-orbit',
    clubId: 'club-royal',
    clubNumber: 'PP-104',
    accountId: 'PP-900321',
    amount: 30000,
    chipAmount: 300000,
    currency: 'RUB',
    processingId: 'proc-riverpay',
    confirmationMode: 'auto',
    paymentStatus: 'Оплачен',
    creditStatus: 'Требует ручной обработки',
    chatStatus: 'Открыт',
    linkExpiresIn: '00:00',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1019',
    issueNote: 'Клуб не подтвердил итоговый callback после успешного API-запроса',
    apiRequestId: 'pp-req-778190',
    timeline: makeTimeline('manual', [
      '16:58',
      '16:59',
      '17:02',
      '17:03',
      'ручная проверка',
    ]),
    receiptRequired: false,
    receiptStatus: 'not_required',
    logs: buildLogs('AC-240325-1019', [
      ['16:58', 'Операция создана', 'Игрок получил ссылку на оплату'],
      ['17:02', 'Платёж подтверждён', 'RiverPay прислал webhook'],
      ['17:03', 'Передано в ручную обработку', 'Требуется проверка callback клуба'],
    ]),
  },
  {
    id: 'AC-240324-9987',
    createdAt: '24.03.2026, 22:17',
    partnerId: 'partner-vector',
    clubId: 'club-summit',
    clubNumber: 'SP-331',
    accountId: 'SP-400122',
    amount: 85,
    chipAmount: 77272.73,
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    confirmationMode: 'auto',
    paymentStatus: 'Ожидает оплаты',
    creditStatus: 'Не отправлено',
    chatStatus: 'Открыт',
    linkExpiresIn: '06:18',
    paymentLink: 'https://pay.autocassa.demo/AC-240324-9987',
    timeline: makeTimeline('awaiting', [
      '22:17',
      '22:17',
      'ожидание',
      'не отправлено',
      'не зачислено',
    ]),
    receiptRequired: false,
    receiptStatus: 'not_required',
    logs: buildLogs('AC-240324-9987', [['22:17', 'Операция создана', 'Игрок получил ссылку на оплату']]),
  },
  {
    id: 'AC-240324-9981',
    createdAt: '24.03.2026, 21:42',
    partnerId: 'partner-pulse',
    clubId: 'club-volna',
    clubNumber: 'XP-208',
    accountId: 'XP-500771',
    amount: 44000,
    chipAmount: 73333.33,
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    confirmationMode: 'receipt_review',
    paymentStatus: 'Отменён',
    creditStatus: 'Не отправлено',
    chatStatus: 'Закрыт',
    linkExpiresIn: '00:00',
    paymentLink: 'https://pay.autocassa.demo/AC-240324-9981',
    issueNote: 'Платёж отклонён на стороне провайдера',
    timeline: makeTimeline('payment_error', [
      '21:42',
      '21:44',
      'отклонено',
      'не отправлено',
      'не зачислено',
    ]),
    receiptRequired: true,
    receiptStatus: 'uploaded',
    receiptAttachment: {
      id: 'receipt-9981',
      name: 'kaspi-AC-240324-9981.pdf',
      size: '288 KB',
      uploadedAt: '24.03.2026, 21:43',
    },
    processingReviewEta: 'Сверка до 7 минут',
    logs: buildLogs('AC-240324-9981', [
      ['21:42', 'Операция создана', 'Показаны реквизиты KaspiFlow'],
      ['21:43', 'Чек загружен', 'Игрок прикрепил PDF-чек'],
      ['21:44', 'Платёж отклонён', 'Чек не прошёл сверку по сумме'],
    ]),
  },
  {
    id: 'AC-240324-9970',
    createdAt: '24.03.2026, 20:58',
    partnerId: 'partner-orbit',
    clubId: 'club-royal',
    clubNumber: 'PP-104',
    accountId: 'PP-775632',
    amount: 5600,
    chipAmount: 56000,
    currency: 'RUB',
    processingId: 'proc-riverpay',
    confirmationMode: 'auto',
    paymentStatus: 'Создан',
    creditStatus: 'Не отправлено',
    chatStatus: 'Открыт',
    linkExpiresIn: '15:00',
    paymentLink: 'https://pay.autocassa.demo/AC-240324-9970',
    timeline: makeTimeline('created', [
      '20:58',
      'ожидание',
      'ожидание',
      'не отправлено',
      'не зачислено',
    ]),
    receiptRequired: false,
    receiptStatus: 'not_required',
    logs: buildLogs('AC-240324-9970', [['20:58', 'Операция создана', 'Ссылка на оплату готова']]),
  },
]

export const playerDefaultDraft: PlayerDraft = {
  clubId: 'club-royal',
  clubNumber: 'PP-104',
  accountId: 'PP-882114',
  amount: '12500',
  currency: 'RUB',
  acceptResponsibility: false,
  acceptTerms: false,
}

export const playerScenarioMeta: Record<
  PaymentScenario,
  {
    paymentStatus: PaymentStatus
    creditStatus: CreditStatus
    receiptStatus: ReceiptStatus
    title: string
    description: string
    actionLabel: string
    highlight: 'info' | 'warning' | 'error' | 'success'
  }
> = {
  awaiting: {
    paymentStatus: 'Ожидает оплаты',
    creditStatus: 'Не отправлено',
    receiptStatus: 'not_required',
    title: 'Ожидает оплату',
    description: 'Ссылка активна',
    actionLabel: 'Открыть оплату',
    highlight: 'info',
  },
  expired: {
    paymentStatus: 'Истёк',
    creditStatus: 'Не отправлено',
    receiptStatus: 'not_required',
    title: 'Ссылка истекла',
    description: 'Нужна новая ссылка',
    actionLabel: 'Создать новую ссылку',
    highlight: 'warning',
  },
  payment_error: {
    paymentStatus: 'Отменён',
    creditStatus: 'Не отправлено',
    receiptStatus: 'not_required',
    title: 'Ошибка оплаты',
    description: 'Провайдер не подтвердил платёж',
    actionLabel: 'Проверить статус',
    highlight: 'error',
  },
  receipt_upload: {
    paymentStatus: 'Создан',
    creditStatus: 'Не отправлено',
    receiptStatus: 'awaiting_upload',
    title: 'Ожидает PDF-чек',
    description: 'Оплатите по реквизитам и прикрепите чек',
    actionLabel: 'Прикрепить чек',
    highlight: 'warning',
  },
  receipt_review: {
    paymentStatus: 'Ожидает оплаты',
    creditStatus: 'Не отправлено',
    receiptStatus: 'under_review',
    title: 'Чек на сверке',
    description: 'Процессинг проверяет PDF-чек',
    actionLabel: 'Открыть поддержку',
    highlight: 'info',
  },
  processing: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Отправлено в клуб',
    receiptStatus: 'approved',
    title: 'Отправлено в клуб',
    description: 'Ожидается ответ API клуба',
    actionLabel: 'Проверить статус',
    highlight: 'info',
  },
  credit_error: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Ошибка зачисления',
    receiptStatus: 'approved',
    title: 'Ошибка зачисления',
    description: 'Нужна повторная отправка или ручная проверка',
    actionLabel: 'Связаться с администратором',
    highlight: 'error',
  },
  manual: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Требует ручной обработки',
    receiptStatus: 'approved',
    title: 'Ручная обработка',
    description: 'Операция передана оператору',
    actionLabel: 'Открыть чат',
    highlight: 'warning',
  },
  success: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Зачислено',
    receiptStatus: 'approved',
    title: 'Баланс зачислен',
    description: 'Операция завершена',
    actionLabel: 'Открыть чек',
    highlight: 'success',
  },
}

export const playerScenarioTimelines: Record<PaymentScenario, TimelineItem[]> = {
  awaiting: makeTimeline('awaiting', [
    'сейчас',
    'сейчас',
    'ожидание',
    'не отправлено',
    'не зачислено',
  ]),
  expired: makeTimeline('expired', [
    'сейчас',
    '15:00',
    'не получено',
    'не отправлено',
    'не зачислено',
  ]),
  payment_error: makeTimeline('payment_error', [
    'сейчас',
    'сейчас',
    'отклонено',
    'не отправлено',
    'не зачислено',
  ]),
  receipt_upload: makeTimeline('receipt_upload', [
    'сейчас',
    'ожидает чек',
    'не подтверждено',
    'не отправлено',
    'не зачислено',
  ]),
  receipt_review: makeTimeline('receipt_review', [
    'сейчас',
    'чек на сверке',
    'ожидание',
    'не отправлено',
    'не зачислено',
  ]),
  processing: makeTimeline('processing', [
    'сейчас',
    'оплата подтверждена',
    'получено',
    'в обработке',
    'ожидание',
  ]),
  credit_error: makeTimeline('credit_error', [
    'сейчас',
    'оплата подтверждена',
    'получено',
    'ошибка API',
    'не зачислено',
  ]),
  manual: makeTimeline('manual', [
    'сейчас',
    'оплата подтверждена',
    'получено',
    'ручная проверка',
    'не зачислено',
  ]),
  success: makeTimeline('success', [
    'сейчас',
    'оплата подтверждена',
    'получено',
    'отправлено',
    'зачислено',
  ]),
}

export const playerScenarioIssueNotes: Partial<Record<PaymentScenario, string>> = {
  expired: 'Ссылка на оплату истекла',
  payment_error: 'Провайдер не подтвердил платёж',
  credit_error: 'Клуб вернул ошибку при зачислении',
  manual: 'Операция передана на ручную обработку',
}

export const ownerQuickLinks: OwnerQuickLink[] = [
  {
    id: 'quick-payments',
    label: 'Платежи',
    path: '/owner/payments',
    counter: '8 операций в demo-журнале',
  },
  {
    id: 'quick-clubs',
    label: 'Клубы и цены фишек',
    path: '/owner/clubs',
    counter: '3 API подключено',
  },
  {
    id: 'quick-processings',
    label: 'Процессинги и валюты',
    path: '/owner/processings',
    counter: '3 маршрута MVP',
  },
  {
    id: 'quick-partners',
    label: 'Партнёры и комиссии',
    path: '/owner/partners',
    counter: '3 партнёра в работе',
  },
]

export const partnerReports: PartnerReportRow[] = [
  {
    id: 'report-1',
    period: '27.03.2026',
    operations: 48,
    grossAmount: '1 284 500 RUB',
    successRate: '94.8%',
    settlementStatus: 'Готов к сверке',
  },
  {
    id: 'report-2',
    period: '26.03.2026',
    operations: 53,
    grossAmount: '1 412 900 RUB',
    successRate: '95.6%',
    settlementStatus: 'Закрыт',
  },
  {
    id: 'report-3',
    period: '25.03.2026',
    operations: 39,
    grossAmount: '998 200 RUB',
    successRate: '92.3%',
    settlementStatus: 'Ожидает подтверждения',
  },
]

export const chatThreads: Record<string, ChatMessage[]> = {
  'AC-240325-1042': [
    {
      id: 'msg-1',
      author: 'system',
      text: 'Операция AC-240325-1042 привязана к Telegram-каналу администратора',
      time: '18:42',
    },
    {
      id: 'msg-2',
      author: 'player',
      text: 'Оплата завершена, подскажите, когда баланс обновится',
      time: '18:45',
    },
    {
      id: 'msg-3',
      author: 'admin',
      text: 'Баланс уже отправлен в клуб, подтверждение обычно приходит в течение минуты',
      time: '18:46',
    },
  ],
  'AC-240325-1031': [
    {
      id: 'msg-4',
      author: 'system',
      text: 'Администратор видит этот диалог в Telegram',
      time: '18:04',
    },
    {
      id: 'msg-5',
      author: 'player',
      text: 'Деньги списались, но фишки не поступили',
      time: '18:05',
      attachments: [
        {
          id: 'att-1',
          kind: 'Скриншот',
          name: 'screen-balance.png',
          size: '1.8 MB',
        },
      ],
    },
    {
      id: 'msg-6',
      author: 'admin',
      text: 'Проверяем ответ API клуба, при необходимости повторим зачисление',
      time: '18:06',
    },
  ],
}

export const attachmentPresets = [
  {
    id: 'preset-screen',
    kind: 'Скриншот' as const,
    name: 'Скриншот страницы оплаты.png',
    size: '2.1 MB',
  },
  {
    id: 'preset-file',
    kind: 'Файл' as const,
    name: 'Квитанция-перевода.pdf',
    size: '640 KB',
  },
  {
    id: 'preset-video',
    kind: 'Видео' as const,
    name: 'Запись-экрана-платежа.mp4',
    size: '12.4 MB',
  },
]

export const getClubById = (clubId: string) =>
  clubs.find((club) => club.id === clubId) ?? clubs[0]

export const getProcessingById = (processingId: string) =>
  processings.find((processing) => processing.id === processingId) ?? processings[0]

export const getPartnerById = (partnerId: string) =>
  partners.find((partner) => partner.id === partnerId) ?? partners[0]

export const getCommissionById = (commissionId: string) =>
  partnerProcessingCommissions.find((commission) => commission.id === commissionId) ??
  partnerProcessingCommissions[0]

export const getBindingByCurrency = (currency: Currency) =>
  currencyBindings.find((binding) => binding.currency === currency) ?? currencyBindings[0]

export const getChipPriceRule = (clubId: string, currency: Currency) =>
  chipPriceRules.find((rule) => rule.clubId === clubId && rule.currency === currency)

export const getPlayerPartner = () => partners[0]

export const calculateChipAmount = (
  amount: number,
  clubId: string,
  currency: Currency,
) => {
  const rule = getChipPriceRule(clubId, currency)

  if (!rule || amount <= 0) {
    return 0
  }

  return amount / rule.pricePerChip
}

export const getCurrencyAvailability = (
  clubId: string,
  partnerId = getPlayerPartner().id,
): CurrencyAvailability[] => {
  const club = getClubById(clubId)
  const partner = getPartnerById(partnerId)

  return currencyBindings.map((binding) => {
    const processing = getProcessingById(binding.processingId)
    const chipRule = getChipPriceRule(clubId, binding.currency)

    if (club.apiStatus === 'Вне MVP') {
      return {
        currency: binding.currency,
        binding,
        enabled: false,
        reason: 'Клуб вне MVP',
      }
    }

    if (!partner.allowedClubIds.includes(clubId)) {
      return {
        currency: binding.currency,
        binding,
        enabled: false,
        reason: 'Клуб не подключен партнёру',
      }
    }

    if (!binding.ownerEnabled) {
      return {
        currency: binding.currency,
        binding,
        enabled: false,
        reason: 'Валюта отключена владельцем',
      }
    }

    if (!partner.allowedCurrencies.includes(binding.currency)) {
      return {
        currency: binding.currency,
        binding,
        enabled: false,
        reason: 'Валюта недоступна партнёру',
      }
    }

    if (!partner.allowedProcessingIds.includes(processing.id)) {
      return {
        currency: binding.currency,
        binding,
        enabled: false,
        reason: 'Процессинг отключен для партнёра',
      }
    }

    if (!chipRule) {
      return {
        currency: binding.currency,
        binding,
        enabled: false,
        reason: 'Нет цены фишки',
      }
    }

    return {
      currency: binding.currency,
      binding,
      enabled: true,
    }
  })
}

export const formatAmount = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: currency === 'USDT' ? 2 : 0,
    minimumFractionDigits: currency === 'USDT' ? 2 : 0,
  }).format(amount)

export const formatChipAmount = (amount: number) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(amount)
