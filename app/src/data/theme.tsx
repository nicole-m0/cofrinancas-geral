import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/theme';

const KEY = 'cofrinancas.theme';

export type ThemePreference = 'light' | 'dark' | 'system';
type Scheme = 'light' | 'dark';

const LIGHT = lightColors as unknown as ThemeColors;

type ThemeValue = {
  colors: ThemeColors;
  scheme: Scheme;
  /** escolha do usuário: claro / escuro / seguir o sistema */
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

function isPref(v: unknown): v is ThemePreference {
  return v === 'light' || v === 'dark' || v === 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemScheme, setSystemScheme] = useState<Scheme>(
    () => (Appearance.getColorScheme() as Scheme | null) ?? 'light',
  );

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (isPref(saved)) setPreferenceState(saved);
      } catch {
        /* ignora */
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme((colorScheme as Scheme | null) ?? 'light');
    });
    return () => sub.remove();
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(KEY, p).catch(() => {});
  }, []);

  const scheme: Scheme = preference === 'system' ? systemScheme : preference;
  const colors = scheme === 'dark' ? darkColors : LIGHT;

  const value = useMemo<ThemeValue>(
    () => ({ colors, scheme, preference, setPreference }),
    [colors, scheme, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  return ctx;
}

export type { ThemeColors };
