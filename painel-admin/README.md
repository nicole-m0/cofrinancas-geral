# Painel admin — Cofrinanças

Painel administrativo em **Next.js 16** (App Router, TypeScript, Tailwind v4).
**Só visualização**, **sem backend e sem banco** — os dados vêm de `src/lib/mock.ts`.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # build de produção — 18 páginas estáticas
npm run lint
```

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Visão geral — KPIs, evolução mensal, distribuição por categoria, últimos usuários/transações |
| `/usuarios` | Tabela de usuários (busca + ordenação) → detalhe |
| `/usuarios/[id]` | Perfil: saldo, metas, recorrentes, distribuição, transações recentes |
| `/transacoes` | Tabela global com filtros (tipo, categoria, usuário) e somatórios |
| `/metas` | Todas as metas agrupadas por tipo, com progresso |
| `/categorias` | Catálogo + uso agregado (total, nº lançamentos, nº usuários, média) |
| `/recorrentes` | Regras recorrentes de todos os usuários |
| `/relatorios` | Evolução mensal, taxa de poupança por mês, distribuição, ranking por saldo |

## Dados (mock)

`src/lib/mock.ts` traz **8 usuários**. `u-marina` ("Marina Alcântara") usa os
números exatos do design do app; os outros 7 são gerados de forma
**determinística** (PRNG `mulberry32` com _seed_ derivada do id) — sem
`Math.random` em runtime, então o `next build` é reprodutível.

- `src/lib/types.ts` — mesmos nomes de campo do app (`app/src/data/types.ts`).
- `src/lib/aggregate.ts` — métricas derivadas (KPIs, evolução, distribuição, ranking).
- `src/lib/format.ts` — moeda / datas em pt-BR.

Páginas são Server Components; só as tabelas com busca/ordenação/filtros
(`*Table.tsx`) são Client Components.
