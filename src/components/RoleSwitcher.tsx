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
      backgroundColor: 'rgba(255,255,255,0.72)',
      borderRadius: '16px',
      p: 0.5,
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
          borderRadius: '12px !important',
          fontWeight: 800,
          px: 2,
        }}
        value={item}
      >
        {roleLabels[item]}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)
