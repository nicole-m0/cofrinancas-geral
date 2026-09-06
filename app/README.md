# Saldo — app de finanças pessoais

Aplicativo mobile em **React Native + Expo** (Expo Router, TypeScript).
Frontend puro: **sem backend, sem banco** — tudo sai de `src/data/mock.ts` através
de um store em memória.

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
│   ├── _layout.tsx          Stack raiz · fontes Manrope · FinanceProvider
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
│   ├── mock.ts              dataset do design (renderVals) — fonte da verdade
│   ├── store.tsx            FinanceProvider + useFinance() — estado em memória
│   └── goals.ts             helpers de progresso/rótulos de meta
├── theme.ts                 tokens de design
├── icons.tsx                ícones SVG (react-native-svg)
└── format.ts                moeda BR / datas (sem Intl, estável no Hermes)
```

## O que está ligado (protótipo navegável)

- Abas + FAB abrindo _Nova despesa_ / _Nova receita_.
- Salvar uma despesa/receita entra no store → Painel e Transações refletem na hora.
- Painel: esconder/mostrar saldo, alternar gráfico **Donut / Barras**.
- Transações: filtros _Tudo / Despesas / Receitas / Recorrentes_ e etiqueta RECORRENTE.
- Categorias: alternar Despesas/Receitas, excluir e criar categoria.
- Metas: criar meta, abrir detalhe, **registrar aporte** (a barra/anel atualiza).
- Perfil: toggles de notificação e de recorrentes com estado.

Tudo em memória — recarregar volta ao dataset do mock.

## Verificação

```bash
npx tsc --noEmit                  # tipos limpos
npx expo-doctor                   # 21/21 checks
npx expo export --platform web    # o bundle Metro compila (16 rotas)
```

> Execução nativa (iOS/Android real) não foi testada neste ambiente — precisa de
> emulador/dispositivo com `npx expo start`. As checagens acima cobrem tipos,
> config e _bundling_.
