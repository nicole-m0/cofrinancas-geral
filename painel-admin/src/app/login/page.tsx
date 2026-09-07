'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get('next') || '/';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    params.get('error') === 'forbidden' ? 'Esta conta não tem acesso de administrador.' : null,
  );
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? 'Não foi possível criar a conta.');
          return;
        }
      }

      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('E-mail ou senha incorretos.');
        return;
      }
      router.replace(nextUrl);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-sm font-extrabold text-white">
            C
          </span>
          <div className="leading-tight">
            <div className="text-base font-extrabold text-ink">Cofrinanças</div>
            <div className="text-xs font-semibold text-muted">Painel admin</div>
          </div>
        </div>

        <div className="rounded-2xl border border-hair bg-card p-6">
          <h1 className="text-lg font-extrabold text-ink">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </h1>
          <p className="mt-1 text-xs font-medium text-muted">
            {mode === 'login'
              ? 'Acesse com seu e-mail e senha.'
              : 'A primeira conta criada vira administrador.'}
          </p>

          <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
            {mode === 'signup' && (
              <Input label="Nome" value={name} onChange={setName} type="text" autoComplete="name" />
            )}
            <Input
              label="E-mail"
              value={email}
              onChange={setEmail}
              type="email"
              autoComplete="email"
            />
            <Input
              label="Senha"
              value={password}
              onChange={setPassword}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {error && (
              <p className="rounded-lg bg-rust-tint px-3 py-2 text-xs font-bold text-rust">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 rounded-xl bg-inverse px-4 py-2.5 text-sm font-extrabold text-on-inverse disabled:opacity-60">
              {busy ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta e entrar'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
            }}
            className="mt-4 w-full text-center text-xs font-bold text-brand hover:text-brand-dark">
            {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tenho conta — entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-extrabold uppercase tracking-wide text-faint">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        required
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-hair bg-sunken px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
