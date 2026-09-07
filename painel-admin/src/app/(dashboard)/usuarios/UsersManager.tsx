'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Column, DataTable } from '@/components/DataTable';
import { FormActions, LabeledField, Modal, SelectInput, TextInput } from '@/components/Modal';
import { Avatar, Badge } from '@/components/ui';
import { apiFetch } from '@/lib/client';
import type { UserKpi } from '@/lib/data';
import { brlShort, shortDate } from '@/lib/format';

type FormState = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  plan: 'Gratuito' | 'Pro';
  city: string;
};

const empty: FormState = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
  plan: 'Gratuito',
  city: '',
};

export function UsersManager({ initialRows }: { initialRows: UserKpi[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setError(null);
    setForm({ ...empty });
  };
  const openEdit = (u: UserKpi) => {
    setError(null);
    setForm({
      id: u.id,
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      plan: u.plan === 'Pro' ? 'Pro' : 'Gratuito',
      city: u.city,
    });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        role: form.role,
        plan: form.plan,
        city: form.city,
      };
      if (form.password) payload.password = form.password;

      if (form.id) {
        await apiFetch(`/api/admin/users/${form.id}`, { method: 'PATCH', body: payload });
      } else {
        await apiFetch('/api/admin/users', { method: 'POST', body: payload });
      }
      setForm(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function remove(u: UserKpi) {
    if (!confirm(`Excluir ${u.name}? Todos os dados da conta serão removidos.`)) return;
    try {
      await apiFetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  }

  const columns: Column<UserKpi>[] = [
    {
      key: 'name',
      header: 'Usuário',
      sortValue: (r) => r.name.toLowerCase(),
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar initials={r.initials} size={36} />
          <div className="min-w-0">
            <div className="truncate font-bold text-ink">{r.name}</div>
            <div className="truncate text-xs font-medium text-muted">{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Acesso',
      sortValue: (r) => r.role,
      render: (r) => <Badge tone={r.role === 'ADMIN' ? 'gold' : 'neutral'}>{r.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (r) => r.status,
      render: (r) => (
        <Badge tone={r.status === 'ativo' ? 'green' : 'neutral'}>
          {r.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'plan',
      header: 'Plano',
      sortValue: (r) => r.plan,
      render: (r) => <span className="text-sm font-bold text-muted">{r.plan}</span>,
    },
    {
      key: 'balance',
      header: 'Saldo',
      align: 'right',
      sortValue: (r) => r.balance,
      render: (r) => <span className="font-extrabold text-ink">{brlShort(r.balance)}</span>,
    },
    {
      key: 'savingsRate',
      header: 'Poupança',
      align: 'right',
      sortValue: (r) => r.savingsRate,
      render: (r) => (
        <span className={`font-bold ${r.savingsRate < 0 ? 'text-rust' : 'text-muted'}`}>
          {r.savingsRate}%
        </span>
      ),
    },
    {
      key: 'transactions',
      header: 'Lanç.',
      align: 'right',
      sortValue: (r) => r.transactions,
      render: (r) => <span className="font-bold text-muted">{r.transactions}</span>,
    },
    {
      key: 'joinedAt',
      header: 'Entrou',
      align: 'right',
      sortValue: (r) => r.joinedAt,
      render: (r) => (
        <span className="text-sm font-semibold text-muted">{shortDate(r.joinedAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="rounded-lg px-2 py-1 text-xs font-bold text-brand hover:bg-brand-tint">
            Editar
          </button>
          <button
            type="button"
            onClick={() => remove(r)}
            className="rounded-lg px-2 py-1 text-xs font-bold text-rust hover:bg-rust-tint">
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-inverse px-4 py-2 text-sm font-extrabold text-on-inverse">
          ＋ Novo usuário
        </button>
      </div>

      <DataTable
        rows={initialRows}
        columns={columns}
        getKey={(r) => r.id}
        searchText={(r) => `${r.name} ${r.email} ${r.city}`}
        searchPlaceholder="Buscar por nome, e-mail ou cidade…"
        initialSort={{ key: 'name', dir: 'asc' }}
        emptyText="Nenhum usuário. Crie o primeiro."
      />

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={form?.id ? 'Editar usuário' : 'Novo usuário'}>
        {form && (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <LabeledField label="Nome">
              <TextInput
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </LabeledField>
            <LabeledField label="E-mail">
              <TextInput
                type="email"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </LabeledField>
            <LabeledField label={form.id ? 'Nova senha (deixe vazio p/ manter)' : 'Senha'}>
              <TextInput
                type="password"
                value={form.password}
                required={!form.id}
                minLength={6}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </LabeledField>
            <div className="grid grid-cols-2 gap-3">
              <LabeledField label="Acesso">
                <SelectInput
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as FormState['role'] })}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </SelectInput>
              </LabeledField>
              <LabeledField label="Plano">
                <SelectInput
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value as FormState['plan'] })}>
                  <option value="Gratuito">Gratuito</option>
                  <option value="Pro">Pro</option>
                </SelectInput>
              </LabeledField>
            </div>
            <LabeledField label="Cidade">
              <TextInput
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </LabeledField>

            {error && (
              <p className="rounded-lg bg-rust-tint px-3 py-2 text-xs font-bold text-rust">{error}</p>
            )}
            <FormActions onCancel={() => setForm(null)} busy={busy} />
          </form>
        )}
      </Modal>
    </div>
  );
}
