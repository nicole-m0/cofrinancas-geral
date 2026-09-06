# Cofrinanças

Monorepo leve (duas pastas independentes) do produto de finanças pessoais.
**Só frontend — sem backend e sem banco.** Todos os dados vêm de módulos de _mock_.

```
cofrinanças/
├── app/            → aplicativo mobile "Saldo" — React Native + Expo
└── painel-admin/   → painel administrativo — Next.js (só visualização)
```

A ideia de médio prazo é o `app/` consumir APIs servidas pelo `painel-admin/`.
Por enquanto os dois leem os próprios módulos de mock, que usam os **mesmos nomes
de campo** (`User`, `Transaction`, `Goal`, `Category`, `RecurringRule`) para que a
troca por uma API real seja praticamente _drop-in_.

O design do app foi importado do Claude Design
(_"Finanças Pessoais - App"_, 10 artboards) — ver `app/README.md`.

---

## `app/` — Saldo (Expo / React Native)

Protótipo navegável com as 10 telas do design: Painel, Nova despesa, Nova receita,
Categorias, Metas, Criar meta, Detalhe da meta, Transações, Relatórios, Perfil.
Navegação real por abas, FAB central abrindo os formulários, controles
segmentados / toggles / filtros funcionando e um **store em memória** que reflete
o que você adiciona (reseta ao recarregar — é o "dados em mock").

```bash
cd app
npm install
npx expo start        # abra no Expo Go, num emulador ou 'w' para web
```

Verificação usada durante o desenvolvimento:

```bash
npx tsc --noEmit                       # tipos
npx expo-doctor                        # config
npx expo export --platform web         # o bundle compila
```

## `painel-admin/` — Painel admin (Next.js)

Dashboards e tabelas **read-only** sobre o mesmo formato de dados: visão geral com
KPIs, usuários (lista + detalhe), transações (com filtros), metas, categorias,
recorrentes e relatórios agregados. 8 usuários no mock — a "Marina Alcântara"
carrega os números exatos do design; os outros 7 são gerados de forma
determinística (PRNG com _seed_ fixa) para o `next build` ser estável.

```bash
cd painel-admin
npm install
npm run dev           # http://localhost:3000
npm run build         # build de produção (18 páginas estáticas)
npm run lint
```

---

## Fora de escopo (por decisão)

Sem API, sem banco, sem autenticação, sem CRUD real no painel. Nada de
`git commit` / `push` automático.
