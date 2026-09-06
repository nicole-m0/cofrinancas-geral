import type { ReactNode } from 'react';

import { CATEGORY_COLORS } from '@/lib/mock';
import { Icon } from './Icon';

export function Card({
  children,
  className = '',
  padding = 'p-5',
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={`rounded-2xl border border-hair bg-card ${padding} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  delta,
  deltaDir,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  deltaDir?: 'up' | 'down' | 'flat';
}) {
  const deltaColor =
    deltaDir === 'down' ? 'text-rust' : deltaDir === 'up' ? 'text-brand' : 'text-muted';
  return (
    <Card>
      <div className="text-[11px] font-extrabold uppercase tracking-wide text-faint">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{value}</div>
      {delta || hint ? (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold">
          {delta ? (
            <span className={`flex items-center gap-1 ${deltaColor}`}>
              {deltaDir === 'up' ? (
                <Icon name="arrow-up" size={13} />
              ) : deltaDir === 'down' ? (
                <Icon name="arrow-down" size={13} />
              ) : null}
              {delta}
            </span>
          ) : null}
          {hint ? <span className="text-muted">{hint}</span> : null}
        </div>
      ) : null}
    </Card>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'green' | 'rust' | 'gold';
}) {
  const tones = {
    neutral: 'bg-sunken text-muted',
    green: 'bg-brand-tint text-brand-dark',
    rust: 'bg-rust-tint text-rust',
    gold: 'bg-[#F7EFDF] text-gold',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-extrabold tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  color = '#0F7A56',
  height = 8,
  className = '',
}: {
  value: number;
  color?: string;
  height?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-[#F1EFEA] ${className}`}
      style={{ height }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function CategoryDot({ name }: { name: string }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]"
      style={{ background: CATEGORY_COLORS[name] ?? '#9AA0A0' }}
    />
  );
}

export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl bg-ink font-extrabold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}
