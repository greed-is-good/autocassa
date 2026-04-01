import type { Currency } from '../types'

type CurrencySvgIconProps = {
  currency: Currency
  muted?: boolean
  size?: number
}

const iconTheme: Record<
  Currency,
  { accent: string; fill: string; glyph: string; stroke: string }
> = {
  RUB: {
    accent: '#2f6fed',
    fill: '#ebf2ff',
    glyph: '₽',
    stroke: '#b9cdfd',
  },
  KZT: {
    accent: '#d4941a',
    fill: '#fff3dc',
    glyph: '₸',
    stroke: '#f2d597',
  },
  USDT: {
    accent: '#14a36a',
    fill: '#e2f8ee',
    glyph: 'T',
    stroke: '#9bdabf',
  },
}

export const CurrencySvgIcon = ({
  currency,
  muted = false,
  size = 28,
}: CurrencySvgIconProps) => {
  const theme = iconTheme[currency]

  return (
    <svg
      aria-hidden="true"
      height={size}
      style={{ display: 'block', flexShrink: 0, opacity: muted ? 0.5 : 1 }}
      viewBox="0 0 28 28"
      width={size}
    >
      <rect
        fill={theme.fill}
        height="26"
        rx="8"
        stroke={theme.stroke}
        strokeWidth="1.2"
        width="26"
        x="1"
        y="1"
      />
      <circle cx="14" cy="14" fill={theme.accent} opacity="0.1" r="8" />
      <text
        fill={theme.accent}
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        x="14"
        y="18"
      >
        {theme.glyph}
      </text>
    </svg>
  )
}
