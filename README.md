# Cofrinanças

Monorepo leve (duas pastas independentes) do produto de finanças pessoais **Cofrinanças**.

```
cofrinanças/
├── app/            → aplicativo mobile Cofrinanças — React Native + Expo
└── painel-admin/   → painel administrativo + API — Next.js
```

O `painel-admin/` hospeda a **API** (Route Handlers) e o painel; o `app/` consome
essa API. Dados em **MySQL** via Prisma; autenticação com Auth.js (cookie no
painel, token Bearer no app). Os módulos de _mock_ ainda existem só para valores
padrão de formulário e desenvolvimento pontual.

Os tipos de domínio (`User`, `Transaction`, `Goal`, `Category`, `RecurringRule`)
são mantidos em sincronia entre `app/src/data/types.ts` e
`painel-admin/src/lib/types.ts`.

O design do app foi importado do Claude Design
(_"Finanças Pessoais - App"_, 10 artboards) — ver `app/README.md`.

---

## `app/` — Cofrinanças (Expo / React Native)

App navegável com as telas do design: Painel, Nova despesa, Nova receita,
Categorias, Metas, Criar meta, Detalhe da meta, Transações, Relatórios, Perfil —
mais **onboarding** de primeira abertura e **login / criar conta**. Navegação por
abas, FAB central abrindo os formulários, controles segmentados / toggles /
filtros. Os dados vêm da API.

```bash
cd app
npm install
# EXPO_PUBLIC_API_URL aponta para o painel-admin (default http://localhost:3000)
npx expo start        # abra no Expo Go, num emulador ou 'w' para web
```

Verificação:

```bash
npx tsc --noEmit                       # tipos
npx expo lint                          # lint
npx expo export --platform web         # o bundle compila
```

## `painel-admin/` — Painel admin + API (Next.js)

- **API** em `src/app/api/*` (auth, transações, categorias, metas, recorrentes,
  preferências, dashboard, admin/usuários).
- **Painel** com CRUD completo: visão geral com KPIs, usuários (lista + detalhe),
  transações, metas, categorias, recorrentes e relatórios — tudo lido do banco.
- Prisma + MySQL; Auth.js v5 (primeiro usuário registrado vira ADMIN).

```bash
cd painel-admin
npm install
# .env com DATABASE_URL e AUTH_SECRET (ver .env.example)
npm run db:migrate    # aplica o schema
npm run dev           # http://localhost:3000
npm run build
npm run lint
```

---

## Notas

- `.env` de ambos os projetos é ignorado pelo git; versionar só `.env.example`.
- As contas de teste criadas em desenvolvimento devem ser removidas antes do uso real.
- Sem `git commit` / `push` automático.
