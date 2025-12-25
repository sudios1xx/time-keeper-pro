# Arquitetura Frontend (DVFoot)

## Camadas
- `app/router`: roteamento central e guards.
- `features/*`: lógica por domínio (auth, players, games, events, finances, lineup, profile).
  - `services`: acesso a dados (mock/API) e query keys.
  - `index.ts`: exports públicos da feature.
- `shared/ui`: reexporta componentes base (shadcn).
- `shared/lib`: utilidades comuns (formatadores, validação, toast, logger).
- `shared/data`: chaves de cache/query compartilhadas.

## Princípios
- Separar UI de dados (services + mappers) para trocar backend sem tocar componentes.
- Rotas e guards centralizados para reduzir acoplamento.
- Feature folders para escalar com múltiplas equipes/domínios.
- Reuso de UI/estado (loading/erro/empty) via `shared`.

## Próximos passos sugeridos
- Migrar data layer para chamadas reais (Supabase/API) atrás dos services.
- Cobrir services/hooks com testes e2e/unitários.
- Adicionar barrel files por feature ao longo da migração.



