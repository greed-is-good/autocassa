import type {
  ChatMessage,
  Club,
  CreditStatus,
  Currency,
  CurrencyBinding,
  DashboardAlert,
  Operation,
  OwnerQuickLink,
  Partner,
  PartnerReportRow,
  PaymentScenario,
  PaymentStatus,
  PlayerDraft,
  Processing,
  TariffLogItem,
  TariffRate,
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
    clubNumber: 'PP-104',
    apiStatus: 'API подключено',
    endpoint: 'https://api.pppoker.app/partner/balance/topup',
    lastCheckStatus: 'Успешно',
    lastCheckAt: '25.03.2026, 18:42',
    lastCheckNote: 'Ответ API за 420 мс, ошибок нет',
  },
  {
    id: 'club-volna',
    title: 'X-poker',
    appName: 'X-poker',
    clubNumber: 'XP-208',
    apiStatus: 'API подключено',
    endpoint: 'https://gateway.x-poker.io/api/v1/deposit',
    lastCheckStatus: 'Успешно',
    lastCheckAt: '25.03.2026, 18:37',
    lastCheckNote: 'Подтверждение подписи проходит штатно',
  },
  {
    id: 'club-summit',
    title: 'Suprema Poker',
    appName: 'Suprema Poker',
    clubNumber: 'SP-331',
    apiStatus: 'API подключено',
    endpoint: 'https://api.supremapoker.com/club/balance/credit',
    lastCheckStatus: 'С предупреждением',
    lastCheckAt: '25.03.2026, 18:35',
    lastCheckNote: 'Пиковая задержка до 1.8 сек, зачисления не блокируются',
  },
  {
    id: 'club-lucky',
    title: 'pokerok',
    appName: 'pokerok',
    clubNumber: 'PO-502',
    apiStatus: 'Вне MVP',
    endpoint: 'API не подключено',
    lastCheckStatus: 'Ошибка',
    lastCheckAt: '25.03.2026, 17:55',
    lastCheckNote: 'Приложение ждёт интеграцию',
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
    conditionLabel: 'Комиссия 3.2%, автоподтверждение вебхуком',
    providerNote: 'Основной RUB-процессинг',
  },
  {
    id: 'proc-kaspiflow',
    title: 'KaspiFlow KZT',
    code: 'KZT-KASPI',
    currencies: ['KZT'],
    status: 'Активен',
    priority: 1,
    settlementNote: 'Ссылка живёт 20 минут, подтверждение до 90 секунд',
    conditionLabel: 'Фиксированный курс, payout T+0',
    providerNote: 'Основной KZT-процессинг',
  },
  {
    id: 'proc-tetherdesk',
    title: 'Tether Desk',
    code: 'USDT-TRC20',
    currencies: ['USDT'],
    status: 'На мониторинге',
    priority: 1,
    settlementNote: 'Подтверждение после 1 сетевого подтверждения',
    conditionLabel: 'USDT TRC20, окно подтверждения до 7 минут',
    providerNote: 'Основной USDT-процессинг',
  },
  {
    id: 'proc-backup',
    title: 'Backup Settlement Hub',
    code: 'RESERVE',
    currencies: ['RUB', 'KZT'],
    status: 'Резерв',
    priority: 2,
    settlementNote: 'Резервный маршрут следующего спринта',
    conditionLabel: 'Недоступен игроку напрямую',
    providerNote: 'Резервный маршрут',
  },
]

export const currencyBindings: CurrencyBinding[] = [
  {
    currency: 'RUB',
    processingId: 'proc-riverpay',
    rateLabel: '1 RUB = 1 RUB',
    payoutWindow: 'Автоподтверждение, до 2 минут',
    systemNote: 'Маршрут назначается автоматически',
  },
  {
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    rateLabel: '1 KZT = 1 KZT',
    payoutWindow: 'Подтверждение до 90 секунд',
    systemNote: 'Маршрут назначается автоматически',
  },
  {
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    rateLabel: '1 USDT = 1 USDT',
    payoutWindow: '1 подтверждение сети, обычно до 7 минут',
    systemNote: 'Маршрут назначается автоматически',
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
    monthlyPlan: 'До 1 500 операций / месяц',
    commissionNote: 'Фиксированные курсы по связке валюта + процессинг',
  },
  {
    id: 'partner-vector',
    title: 'Vector Partners',
    manager: 'Илья Кравцов',
    telegram: '@vector_partners',
    allowedClubIds: ['club-summit'],
    allowedCurrencies: ['RUB', 'USDT'],
    allowedProcessingIds: ['proc-riverpay', 'proc-tetherdesk'],
    monthlyPlan: 'До 900 операций / месяц',
    commissionNote: 'Повышенный тариф по USDT',
  },
  {
    id: 'partner-pulse',
    title: 'Pulse Acquisition',
    manager: 'Мария Орлова',
    telegram: '@pulse_ops',
    allowedClubIds: ['club-volna', 'club-summit'],
    allowedCurrencies: ['KZT', 'USDT'],
    allowedProcessingIds: ['proc-kaspiflow', 'proc-tetherdesk'],
    monthlyPlan: 'До 700 операций / месяц',
    commissionNote: 'Отчётность и сверка раз в сутки',
  },
]

export const tariffRates: TariffRate[] = [
  {
    id: 'rate-orbit-rub',
    partnerId: 'partner-orbit',
    currency: 'RUB',
    processingId: 'proc-riverpay',
    fixedRate: '96.8%',
    settlementWindow: 'T+0',
    updatedAt: '24.03.2026, 14:05',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'rate-orbit-kzt',
    partnerId: 'partner-orbit',
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    fixedRate: '97.4%',
    settlementWindow: 'T+0',
    updatedAt: '24.03.2026, 14:07',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'rate-orbit-usdt',
    partnerId: 'partner-orbit',
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    fixedRate: '98.6%',
    settlementWindow: 'T+1',
    updatedAt: '24.03.2026, 14:12',
    updatedBy: 'Екатерина Петрова',
  },
  {
    id: 'rate-vector-usdt',
    partnerId: 'partner-vector',
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    fixedRate: '99.1%',
    settlementWindow: 'T+1',
    updatedAt: '23.03.2026, 19:48',
    updatedBy: 'Денис Самойлов',
  },
]

export const tariffLog: TariffLogItem[] = [
  {
    id: 'log-1',
    partnerId: 'partner-orbit',
    changedAt: '24.03.2026, 14:12',
    changedBy: 'Екатерина Петрова',
    summary: 'USDT / Tether Desk изменён с 98.3% на 98.6%',
  },
  {
    id: 'log-2',
    partnerId: 'partner-orbit',
    changedAt: '22.03.2026, 11:30',
    changedBy: 'Денис Самойлов',
    summary: 'Для KZT продлено окно расчёта до T+0',
  },
  {
    id: 'log-3',
    partnerId: 'partner-vector',
    changedAt: '23.03.2026, 19:48',
    changedBy: 'Екатерина Петрова',
    summary: 'Создан тариф USDT / Tether Desk',
  },
]

export const operations: Operation[] = [
  {
    id: 'AC-240325-1042',
    createdAt: '25.03.2026, 18:42',
    partnerId: 'partner-orbit',
    clubId: 'club-royal',
    clubNumber: 'PP-104',
    accountId: 'PP-882114',
    amount: 12500,
    currency: 'RUB',
    processingId: 'proc-riverpay',
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
  },
  {
    id: 'AC-240325-1038',
    createdAt: '25.03.2026, 18:21',
    partnerId: 'partner-orbit',
    clubId: 'club-volna',
    clubNumber: 'XP-208',
    accountId: 'XP-551080',
    amount: 75000,
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
    paymentStatus: 'Оплачен',
    creditStatus: 'Отправлено в клуб',
    chatStatus: 'Открыт',
    linkExpiresIn: '09:14',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1038',
    apiRequestId: 'xp-req-118034',
    timeline: makeTimeline('processing', [
      '18:21',
      '18:21',
      '18:24',
      '18:25',
      'в обработке',
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
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
    paymentStatus: 'Оплачен',
    creditStatus: 'Ошибка зачисления',
    chatStatus: 'Есть ответ администратора',
    linkExpiresIn: '03:42',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1031',
    issueNote: 'API приложения вернул код 422: аккаунт временно заблокирован',
    apiRequestId: 'sp-req-542201',
    timeline: makeTimeline('credit_error', [
      '17:58',
      '17:59',
      '18:03',
      '18:04',
      'ошибка API',
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
    currency: 'RUB',
    processingId: 'proc-riverpay',
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
  },
  {
    id: 'AC-240325-1019',
    createdAt: '25.03.2026, 16:58',
    partnerId: 'partner-orbit',
    clubId: 'club-royal',
    clubNumber: 'PP-104',
    accountId: 'PP-900321',
    amount: 30000,
    currency: 'RUB',
    processingId: 'proc-riverpay',
    paymentStatus: 'Оплачен',
    creditStatus: 'Требует ручной обработки',
    chatStatus: 'Открыт',
    linkExpiresIn: '00:00',
    paymentLink: 'https://pay.autocassa.demo/AC-240325-1019',
    issueNote: 'Приложение не подтвердило итоговый callback после успешного API-запроса',
    apiRequestId: 'pp-req-778190',
    timeline: makeTimeline('manual', [
      '16:58',
      '16:59',
      '17:02',
      '17:03',
      'ручная проверка',
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
    currency: 'USDT',
    processingId: 'proc-tetherdesk',
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
  },
  {
    id: 'AC-240324-9981',
    createdAt: '24.03.2026, 21:42',
    partnerId: 'partner-pulse',
    clubId: 'club-volna',
    clubNumber: 'XP-208',
    accountId: 'XP-500771',
    amount: 44000,
    currency: 'KZT',
    processingId: 'proc-kaspiflow',
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
  },
  {
    id: 'AC-240324-9970',
    createdAt: '24.03.2026, 20:58',
    partnerId: 'partner-orbit',
    clubId: 'club-royal',
    clubNumber: 'PP-104',
    accountId: 'PP-775632',
    amount: 5600,
    currency: 'RUB',
    processingId: 'proc-riverpay',
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
  },
]

export const playerDefaultDraft: PlayerDraft = {
  clubId: 'club-royal',
  clubNumber: 'PP-104',
  accountId: 'PP-882114',
  amount: '12500',
  currency: 'RUB',
}

export const playerScenarioMeta: Record<
  PaymentScenario,
  {
    paymentStatus: PaymentStatus
    creditStatus: CreditStatus
    title: string
    description: string
    actionLabel: string
    highlight: 'info' | 'warning' | 'error' | 'success'
  }
> = {
  awaiting: {
    paymentStatus: 'Ожидает оплаты',
    creditStatus: 'Не отправлено',
    title: 'Ожидает оплату',
    description: 'Ссылка активна',
    actionLabel: 'Открыть оплату',
    highlight: 'info',
  },
  expired: {
    paymentStatus: 'Истёк',
    creditStatus: 'Не отправлено',
    title: 'Ссылка истекла',
    description: 'Нужна новая ссылка',
    actionLabel: 'Создать новую ссылку',
    highlight: 'warning',
  },
  payment_error: {
    paymentStatus: 'Отменён',
    creditStatus: 'Не отправлено',
    title: 'Ошибка оплаты',
    description: 'Платёж не подтверждён',
    actionLabel: 'Проверить статус оплаты',
    highlight: 'error',
  },
  processing: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Отправлено в клуб',
    title: 'Отправлено в клуб',
    description: 'Ожидается ответ API',
    actionLabel: 'Открыть чек оплаты',
    highlight: 'info',
  },
  credit_error: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Ошибка зачисления',
    title: 'Ошибка зачисления',
    description: 'Нужна повторная отправка или ручная обработка',
    actionLabel: 'Связаться с администратором',
    highlight: 'error',
  },
  manual: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Требует ручной обработки',
    title: 'Ручная обработка',
    description: 'Операция передана оператору',
    actionLabel: 'Открыть чат по операции',
    highlight: 'warning',
  },
  success: {
    paymentStatus: 'Оплачен',
    creditStatus: 'Зачислено',
    title: 'Зачисление выполнено',
    description: 'Операция завершена',
    actionLabel: 'Открыть чек оплаты',
    highlight: 'success',
  },
}

export const ownerAlerts: DashboardAlert[] = [
  {
    id: 'owner-alert-1',
    severity: 'error',
    title: '3 операции с ошибкой зачисления',
    description: 'Нужны повторная отправка или ручная обработка.',
    meta: 'Последнее событие: 25.03.2026, 17:58',
  },
  {
    id: 'owner-alert-2',
    severity: 'warning',
    title: '2 кейса ждут ручной обработки',
    description: 'Нет финального подтверждения от клуба.',
    meta: 'SLA оператора: до 15 минут',
  },
  {
    id: 'owner-alert-3',
    severity: 'info',
    title: 'USDT процессинг на мониторинге',
    description: 'Среднее подтверждение выросло до 5.4 минут.',
    meta: 'Тренд за последние 2 часа',
  },
]

export const integrationAlerts: DashboardAlert[] = [
  {
    id: 'integration-1',
    severity: 'warning',
    title: 'Suprema Poker',
    description: 'Ответ API вырос до 1.8 сек.',
    meta: 'Последняя проверка: 25.03.2026, 18:35',
  },
  {
    id: 'integration-2',
    severity: 'error',
    title: 'pokerok',
    description: 'Клуб вне MVP.',
    meta: 'Требуется отдельная интеграция',
  },
]

export const ownerQuickLinks: OwnerQuickLink[] = [
  {
    id: 'quick-payments',
    label: 'Платежи',
    path: '/owner/payments',
    counter: '128 операций сегодня',
  },
  {
    id: 'quick-clubs',
    label: 'Клубы и интеграции',
    path: '/owner/clubs',
    counter: '3 API подключено',
  },
  {
    id: 'quick-processings',
    label: 'Процессинги и валюты',
    path: '/owner/processings',
    counter: '3 активных маршрута MVP',
  },
  {
    id: 'quick-partners',
    label: 'Партнёры и тарифы',
    path: '/owner/partners',
    counter: '3 партнёра в работе',
  },
]

export const partnerReports: PartnerReportRow[] = [
  {
    id: 'report-1',
    period: '25.03.2026',
    operations: 48,
    grossAmount: '1 284 500 RUB',
    successRate: '94.8%',
    settlementStatus: 'Готов к сверке',
  },
  {
    id: 'report-2',
    period: '24.03.2026',
    operations: 53,
    grossAmount: '1 412 900 RUB',
    successRate: '95.6%',
    settlementStatus: 'Закрыт',
  },
  {
    id: 'report-3',
    period: '23.03.2026',
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
      text: 'Операция AC-240325-1042 • ответы администратора через Telegram',
      time: '18:42',
    },
    {
      id: 'msg-2',
      author: 'player',
      text: 'Оплата завершена, подскажите, когда баланс обновится?',
      time: '18:45',
    },
    {
      id: 'msg-3',
      author: 'admin',
      text: 'Баланс уже отправлен в приложение, подтверждение обычно приходит в течение минуты',
      time: '18:46',
    },
  ],
  'AC-240325-1031': [
    {
      id: 'msg-4',
      author: 'system',
      text: 'Администратор видит сообщение в Telegram',
      time: '18:04',
    },
    {
      id: 'msg-5',
      author: 'player',
      text: 'Деньги списались, но баланс в приложении не изменился',
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
      text: 'Проверяем ответ API приложения, при необходимости переведём кейс в ручную обработку',
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

export const getRateById = (rateId: string) =>
  tariffRates.find((rate) => rate.id === rateId) ?? tariffRates[0]

export const getBindingByCurrency = (currency: Currency) =>
  currencyBindings.find((binding) => binding.currency === currency) ?? currencyBindings[0]

export const formatAmount = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: currency === 'USDT' ? 2 : 0,
    minimumFractionDigits: currency === 'USDT' ? 2 : 0,
  }).format(amount)
