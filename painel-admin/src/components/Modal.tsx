'use client';

import { useEffect, type ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onMouseDown={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-hair bg-card p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-bold text-muted hover:bg-sunken">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const base =
  'w-full rounded-xl border border-hair bg-sunken px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand';

export function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-extrabold uppercase tracking-wide text-faint">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={base} />;
}

export function FormActions({
  onCancel,
  busy,
  submitLabel = 'Salvar',
}: {
  onCancel: () => void;
  busy?: boolean;
  submitLabel?: string;
}) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl px-4 py-2 text-sm font-bold text-muted hover:bg-sunken">
        Cancelar
      </button>
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-inverse px-4 py-2 text-sm font-extrabold text-on-inverse disabled:opacity-60">
        {busy ? 'Salvando…' : submitLabel}
      </button>
    </div>
  );
}
