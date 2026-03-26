import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import type { Role } from '../types'

interface RoleSwitcherProps {
  role: Role
  onChange: (role: Role) => void
}

const roleLabels: Record<Role, string> = {
  player: 'Игрок',
  partner: 'Партнёр',
  owner: 'Владелец',
}

export const RoleSwitcher = ({ role, onChange }: RoleSwitcherProps) => (
  <ToggleButtonGroup
    color="primary"
    exclusive
    size="small"
    sx={{
      backgroundColor: 'rgba(248,250,252,0.96)',
      border: '1px solid rgba(15,23,42,0.08)',
      borderRadius: '14px',
      p: 0.35,
    }}
    value={role}
    onChange={(_, nextRole: Role | null) => {
      if (nextRole) {
        onChange(nextRole)
      }
    }}
  >
    {(['player', 'partner', 'owner'] as const).map((item) => (
      <ToggleButton
        key={item}
        sx={{
          border: 'none',
          borderRadius: '10px !important',
          fontSize: 13,
          fontWeight: 800,
          px: 1.8,
        }}
        value={item}
      >
        {roleLabels[item]}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)
