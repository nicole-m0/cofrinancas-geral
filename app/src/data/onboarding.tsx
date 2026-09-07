import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'cofrinancas.onboardingDone';

type Status = 'loading' | 'pending' | 'done';

type OnboardingValue = {
  status: Status;
  /** Marca o onboarding como concluído (ou pulado) e persiste. */
  complete: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let alive = true;
    (async () => {
      let seen = false;
      try {
        seen = (await AsyncStorage.getItem(KEY)) === '1';
      } catch {
        seen = false;
      }
      if (alive) setStatus(seen ? 'done' : 'pending');
    })();
    return () => {
      alive = false;
    };
  }, []);

  const complete = useCallback(async () => {
    setStatus('done');
    try {
      await AsyncStorage.setItem(KEY, '1');
    } catch {
      /* ignora falha de storage — segue como 'done' nesta sessão */
    }
  }, []);

  const value = useMemo<OnboardingValue>(() => ({ status, complete }), [status, complete]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding deve ser usado dentro de <OnboardingProvider>');
  return ctx;
}
