import { brlShort } from '@/lib/format';
import type { MonthPoint } from '@/lib/types';

/** Grouped vertical bars: receitas × despesas per month. */
export function BarChart({ data, height = 180 }: { data: MonthPoint[]; height?: number }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  return (
    <div className="flex items-end gap-3" style={{ height: height + 24 }}>
      {data.map((d) => (
        <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end justify-center gap-1.5" style={{ height }}>
            <div
              className="w-3 rounded-t bg-brand"
              style={{ height: `${(d.income / max) * 100}%` }}
              title={`Receitas ${brlShort(d.income)}`}
            />
            <div
              className="w-3 rounded-t bg-rust-bright"
              style={{ height: `${(d.expense / max) * 100}%` }}
              title={`Despesas ${brlShort(d.expense)}`}
            />
          </div>
          <span className="text-[11px] font-bold text-faint">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Multi-segment donut. `segments` = [{ value, color }]. */
export function DonutChart({
  segments,
  size = 148,
  strokeWidth = 22,
  centerLabel,
  centerValue,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  const arcs = segments.reduce<{ color: string; len: number; offset: number }[]>((acc, seg) => {
    const len = (seg.value / total) * c;
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].len : 0;
    acc.push({ color: seg.color, len, offset });
    return acc;
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-track)"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.len} ${c - arc.len}`}
            strokeDashoffset={-arc.offset}
          />
        ))}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerLabel ? (
            <span className="text-[10px] font-bold tracking-wide text-faint">{centerLabel}</span>
          ) : null}
          {centerValue ? (
            <span className="text-sm font-extrabold text-ink">{centerValue}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
