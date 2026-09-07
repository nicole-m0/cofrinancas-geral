'use client';

import Link from 'next/link';

import { CrudManager, type CrudConfig, type Field } from '@/components/CrudManager';
import { Badge, ProgressBar } from '@/components/ui';
import { brlShort } from '@/lib/format';

type Row = {
  id: string;
  userId: string;
  userName: string;
  title: string;
  type: string;
  current: number;
  target: number;
  color: string;
  done: boolean;
  deadlineLabel: string;
  progress: number;
};

const TYPES = [
  'Poupança com prazo',
  'Redução de gasto',
  'Limite de gasto',
  'Limite por categoria',
];

export function GoalsManager({
  rows,
  users,
}: {
  rows: Row[];
  users: { id: string; name: string }[];
}) {
  const fields: Field[] = [
    {
      name: 'userId',
      label: 'Usuário (dono)',
      kind: 'select',
      required: true,
      options: users.map((u) => ({ value: u.id, label: u.name })),
    },
    { name: 'title', label: 'Título', kind: 'text', required: true },
    {
      name: 'type',
      label: 'Tipo',
      kind: 'select',
      required: true,
      options: TYPES.map((t) => ({ value: t, label: t })),
    },
    { name: 'target', label: 'Alvo (R$)', kind: 'number', required: true, step: '0.01' },
    { name: 'current', label: 'Atual (R$)', kind: 'number', step: '0.01' },
    { name: 'deadlineLabel', label: 'Prazo (texto)', kind: 'text' },
    { name: 'categoryName', label: 'Categoria (opcional)', kind: 'text' },
    { name: 'color', label: 'Cor (hex)', kind: 'text' },
    { name: 'done', label: 'Concluída', kind: 'checkbox' },
  ];

  const config: CrudConfig<Row> = {
    rows,
    getKey: (r) => r.id,
    searchText: (r) => `${r.title} ${r.userName} ${r.type}`,
    searchPlaceholder: 'Buscar meta…',
    initialSort: { key: 'title', dir: 'asc' },
    emptyText: 'Nenhuma meta ainda.',
    newLabel: 'Nova meta',
    createTitle: 'Nova meta',
    editTitle: 'Editar meta',
    fields,
    blank: {
      userId: '',
      title: '',
      type: 'Poupança com prazo',
      target: '',
      current: '0',
      deadlineLabel: '',
      categoryName: '',
      color: '#0F7A56',
      done: false,
    },
    toForm: (r) => ({
      userId: r.userId,
      title: r.title,
      type: r.type,
      target: String(r.target),
      current: String(r.current),
      deadlineLabel: r.deadlineLabel,
      categoryName: '',
      color: r.color,
      done: r.done,
    }),
    createUrl: (f) => `/api/goals?userId=${f.userId}`,
    itemUrl: (r) => `/api/goals/${r.id}`,
    buildPayload: (f) => ({
      title: f.title,
      type: f.type,
      target: Number(f.target),
      current: Number(f.current || 0),
      color: String(f.color || '#0F7A56'),
      deadlineLabel: String(f.deadlineLabel || ''),
      ...(f.categoryName ? { categoryName: String(f.categoryName) } : {}),
      done: Boolean(f.done),
    }),
    describe: (r) => `a meta "${r.title}" de ${r.userName}`,
    columns: [
      {
        key: 'title',
        header: 'Meta',
        sortValue: (r) => r.title.toLowerCase(),
        render: (r) => (
          <div className="min-w-[180px]">
            <div className="font-bold text-ink">{r.title}</div>
            <div className="text-xs font-medium text-muted">{r.type}</div>
          </div>
        ),
      },
      {
        key: 'user',
        header: 'Usuário',
        sortValue: (r) => r.userName.toLowerCase(),
        render: (r) => (
          <Link href={`/usuarios/${r.userId}`} className="text-sm font-semibold text-muted hover:text-ink">
            {r.userName}
          </Link>
        ),
      },
      {
        key: 'progress',
        header: 'Progresso',
        sortValue: (r) => r.progress,
        render: (r) => (
          <div className="w-40">
            <ProgressBar value={r.progress} color={r.color} />
            <div className="mt-1 text-[11px] font-bold text-muted">
              {brlShort(r.current)} / {brlShort(r.target)} · {r.progress}%
            </div>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        align: 'right',
        sortValue: (r) => (r.done ? 2 : r.progress >= 90 ? 1 : 0),
        render: (r) =>
          r.done ? (
            <Badge tone="green">concluída</Badge>
          ) : r.progress >= 90 ? (
            <Badge tone="rust">{r.progress}%</Badge>
          ) : (
            <Badge>{r.progress}%</Badge>
          ),
      },
    ],
  };

  return <CrudManager config={config} />;
}
