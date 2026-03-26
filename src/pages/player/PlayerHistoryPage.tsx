import { SearchRounded } from '@mui/icons-material'
import { InputAdornment, Stack, TextField } from '@mui/material'
import { useDeferredValue, useMemo, useState } from 'react'

import { usePrototype } from '../../app/PrototypeContext'
import { EmptyState } from '../../components/EmptyState'
import { OperationsTable } from '../../components/OperationsTable'
import { SectionCard } from '../../components/SectionCard'

export const PlayerHistoryPage = () => {
  const { allOperations } = usePrototype()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredOperations = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()

    if (!normalized) {
      return allOperations
    }

    return allOperations.filter(
      (operation) =>
        operation.id.toLowerCase().includes(normalized) ||
        operation.accountId.toLowerCase().includes(normalized),
    )
  }, [allOperations, deferredQuery])

  return (
    <Stack className="autocassa-fade-up" spacing={3}>
      <SectionCard
        eyebrow="Игрок"
        title="История операций"
        subtitle="Поиск по номеру операции или аккаунту"
      >
        <Stack spacing={2.5}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
            fullWidth
            label="Поиск по номеру операции или аккаунту"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {filteredOperations.length > 0 ? (
            <OperationsTable operations={filteredOperations} />
          ) : (
            <EmptyState
              actionLabel="Сбросить фильтр"
              description="По номеру операции или аккаунту ничего не найдено"
              icon={<SearchRounded />}
              onAction={() => setQuery('')}
              title="История не найдена"
            />
          )}
        </Stack>
      </SectionCard>
    </Stack>
  )
}
