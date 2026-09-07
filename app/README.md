# Cofrinanças — app de finanças pessoais

Aplicativo mobile em **React Native + Expo** (Expo Router, TypeScript).
Consome a API servida pelo `painel-admin/` (Next.js Route Handlers); a URL fica
em `EXPO_PUBLIC_API_URL` (`.env`). Autenticação por token (Bearer) guardado no
dispositivo. `src/data/mock.ts` só guarda constantes de formulário.

O visual foi importado do Claude Design — projeto _"Finanças Pessoais - App"_,
10 artboards iOS/Android de 390 px. As cores, tipografia (Manrope), raios e o
conjunto de ícones estão em `src/theme.ts` e `src/icons.tsx`.

## Rodar

```bash
npm install
npx expo start
```

Depois: `i` (iOS), `a` (Android), `w` (web) ou leia o QR code no app Expo Go.

## Estrutura

```
src/
├── app/                     rotas (Expo Router)
│   ├── _layout.tsx          Stack raiz · fontes · AuthProvider · OnboardingProvider · FinanceProvider
│   ├── onboarding.tsx       telas de primeira abertura (4 passos)
│   ├── login.tsx            entrar / criar conta
│   ├── (tabs)/              abas com tab bar custom + FAB central
│   │   ├── index.tsx        01 Painel
│   │   ├── transacoes.tsx   08 Transações
│   │   ├── metas.tsx        05 Metas
│   │   └── perfil.tsx       10 Perfil
│   ├── nova-despesa.tsx     02  (modal)
│   ├── nova-receita.tsx     03  (modal)
│   ├── categorias.tsx       04
│   ├── criar-meta.tsx       06  (modal)
│   ├── meta/[id].tsx        07 Detalhe da meta
│   └── relatorios.tsx       09
├── components/              Card, SegmentedControl, ProgressBar, RingProgress,
│                            DonutChart, MiniBarChart, Toggle, BalanceCard, …
├── data/
│   ├── types.ts             User, Transaction, Goal, Category, RecurringRule
│   ├── api.ts               cliente HTTP (fetch + EXPO_PUBLIC_API_URL)
│   ├── auth.tsx             AuthProvider + useAuth() — login/registro/token
│   ├── onboarding.tsx       OnboardingProvider — flag "já viu" (AsyncStorage)
│   ├── tokenStore.ts        token persistido via AsyncStorage
│   ├── mock.ts              só constantes de formulário / rótulos
│   ├── store.tsx            FinanceProvider + useFinance() — dados vindos da API
│   └── goals.ts             helpers de progresso/rótulos de meta
├── theme.ts                 tokens de design
├── icons.tsx                ícones SVG (react-native-svg)
└── format.ts                moeda BR / datas (sem Intl, estável no Hermes)
```

## O que está ligado

- Primeira abertura: onboarding (4 passos, com _Pular_) → login / criar conta.
- Abas + FAB abrindo _Nova despesa_ / _Nova receita_.
- Salvar uma despesa/receita chama a API → Painel e Transações refletem após recarregar os dados.
- Painel: esconder/mostrar saldo, alternar gráfico **Donut / Barras**.
- Transações: filtros _Tudo / Despesas / Receitas / Recorrentes_ e etiqueta RECORRENTE.
- Categorias: alternar Despesas/Receitas, excluir e criar categoria.
- Metas: criar meta, abrir detalhe, **registrar aporte** (a barra/anel atualiza).
- Perfil: toggles de notificação e de recorrentes; **sair da conta**.

Os dados são persistidos no backend; o mock guarda só valores padrão de formulário.

## Verificação

```bash
npx tsc --noEmit                  # tipos limpos
npx expo lint                     # lint
npx expo export --platform web    # o bundle Metro compila
```

> Precisa da API rodando (`painel-admin/` → `npm run dev`) para login e dados.

> Execução nativa (iOS/Android real) não foi testada neste ambiente — precisa de
> emulador/dispositivo com `npx expo start`. As checagens acima cobrem tipos,
> config e _bundling_.
