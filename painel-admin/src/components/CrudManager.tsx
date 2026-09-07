'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { Column, DataTable } from './DataTable';
import { FormActions, LabeledField, Modal, SelectInput, TextInput } from './Modal';
import { apiFetch } from '@/lib/client';

export type Field =
  | { name: string; label: string; kind: 'text' | 'number' | 'date'; required?: boolean; step?: string }
  | {
      name: string;
      label: string;
      kind: 'select';
      required?: boolean;
      options: { value: string; label: string }[];
    }
  | { name: string; label: string; kind: 'checkbox' };

type FormVals = Record<string, string | boolean>;

export type CrudConfig<Row> = {
  rows: Row[];
  columns: Column<Row>[];
  getKey: (r: Row) => string;
  searchText?: (r: Row) => string;
  searchPlaceholder?: string;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  emptyText?: string;
  newLabel: string;
  editTitle: string;
  createTitle: string;
  fields: Field[];
  blank: FormVals;
  toForm: (r: Row) => FormVals;
  createUrl: (form: FormVals) => string;
  itemUrl: (r: Row) => string;
  buildPayload: (form: FormVals, isEdit: boolean) => unknown;
  describe: (r: Row) => string;
  toolbar?: ReactNode;
};

export function CrudManager<Row>({ config }: { config: CrudConfig<Row> }) {
  const router = useRouter();
  const [form, setForm] = useState<FormVals | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setError(null);
    setEditing(null);
    setForm({ ...config.blank });
  };
  const openEdit = (r: Row) => {
    setError(null);
    setEditing(r);
    setForm(config.toForm(r));
  };
  const close = () => {
    setForm(null);
    setEditing(null);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setError(null);
    try {
      const isEdit = editing !== null;
      const payload = config.buildPayload(form, isEdit);
      if (isEdit) {
        await apiFetch(config.itemUrl(editing as Row), { method: 'PATCH', body: payload });
      } else {
        await apiFetch(config.createUrl(form), { method: 'POST', body: payload });
      }
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function remove(r: Row) {
    if (!confirm(`Excluir ${config.describe(r)}?`)) return;
    try {
      await apiFetch(config.itemUrl(r), { method: 'DELETE' });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  }

  const columns: Column<Row>[] = [
    ...config.columns,
    {
      key: '__actions',
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
          ＋ {config.newLabel}
        </button>
      </div>

      <DataTable
        rows={config.rows}
        columns={columns}
        getKey={config.getKey}
        searchText={config.searchText}
        searchPlaceholder={config.searchPlaceholder}
        initialSort={config.initialSort}
        emptyText={config.emptyText}
        toolbar={config.toolbar}
      />

      <Modal open={form !== null} onClose={close} title={editing ? config.editTitle : config.createTitle}>
        {form && (
          <form onSubmit={submit} className="flex flex-col gap-3">
            {config.fields.map((f) => {
              if (f.kind === 'checkbox') {
                return (
                  <label key={f.name} className="flex items-center gap-2 text-sm font-bold text-ink">
                    <input
                      type="checkbox"
                      checked={Boolean(form[f.name])}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                    />
                    {f.label}
                  </label>
                );
              }
              if (f.kind === 'select') {
                return (
                  <LabeledField key={f.name} label={f.label}>
                    <SelectInput
                      value={String(form[f.name] ?? '')}
                      required={f.required}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                      <option value="" disabled>
                        Selecione…
                      </option>
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </SelectInput>
                  </LabeledField>
                );
              }
              return (
                <LabeledField key={f.name} label={f.label}>
                  <TextInput
                    type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : 'text'}
                    step={f.kind === 'number' ? (f.step ?? 'any') : undefined}
                    value={String(form[f.name] ?? '')}
                    required={f.required}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                </LabeledField>
              );
            })}

            {error && (
              <p className="rounded-lg bg-rust-tint px-3 py-2 text-xs font-bold text-rust">{error}</p>
            )}
            <FormActions onCancel={close} busy={busy} />
          </form>
        )}
      </Modal>
    </div>
  );
}
