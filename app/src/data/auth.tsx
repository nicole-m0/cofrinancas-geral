import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { apiRequest } from './api';
import { tokenStore } from './tokenStore';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  initials: string;
  plan: string;
  city: string;
};

type Status = 'loading' | 'authed' | 'guest';

type AuthValue = {
  status: Status;
  token: string | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // restaura sessão salva
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await tokenStore.get();
      if (!saved) {
        if (alive) setStatus('guest');
        return;
      }
      try {
        const me = await apiRequest<{ user: AuthUser }>('/api/me', { token: saved });
        if (!alive) return;
        setToken(saved);
        setUser(me.user);
        setStatus('authed');
      } catch {
        await tokenStore.set(null);
        if (alive) setStatus('guest');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const finishAuth = useCallback(async (t: string, u: AuthUser) => {
    await tokenStore.set(t);
    setToken(t);
    setUser(u);
    setStatus('authed');
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await apiRequest<{ token: string; user: AuthUser }>('/api/mobile/login', {
        method: 'POST',
        body: { email, password },
      });
      await finishAuth(res.token, res.user);
    },
    [finishAuth],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiRequest<{ token: string; user: AuthUser }>('/api/mobile/register', {
        method: 'POST',
        body: { name, email, password },
      });
      await finishAuth(res.token, res.user);
    },
    [finishAuth],
  );

  const signOut = useCallback(async () => {
    await tokenStore.set(null);
    setToken(null);
    setUser(null);
    setStatus('guest');
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ status, token, user, signIn, signUp, signOut }),
    [status, token, user, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
