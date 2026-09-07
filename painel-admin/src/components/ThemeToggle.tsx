'use client';

import { useEffect, useState } from 'react';

import { applyTheme, isThemePref, THEME_STORAGE_KEY, type ThemePref } from '@/lib/theme';

const OPTIONS: { value: ThemePref; label: string; glyph: string }[] = [
  { value: 'light', label: 'Claro', glyph: '☀' },
  { value: 'dark', label: 'Escuro', glyph: '☾' },
  { value: 'system', label: 'Sistema', glyph: '⌂' },
];

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPref(isThemePref(stored) ? stored : 'system');
    setMounted(true);
  }, []);

  // Reage a mudanças do SO quando o modo é "Sistema".
  useEffect(() => {
    if (pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const choose = (value: ThemePref) => {
    setPref(value);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    applyTheme(value);
  };

  return (
    <div className="flex rounded-xl bg-white/5 p-1" role="group" aria-label="Tema">
      {OPTIONS.map((o) => {
        const active = mounted && pref === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => choose(o.value)}
            aria-pressed={active}
            title={o.label}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors ${
              active ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'
            }`}>
            <span aria-hidden>{o.glyph}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
