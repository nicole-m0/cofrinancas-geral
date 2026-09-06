import Link from 'next/link';
import type { ReactNode } from 'react';

import { Icon } from './Icon';

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-ink">
            <Icon name="chevron" size={13} className="rotate-180" />
            {backLabel ?? 'Voltar'}
          </Link>
        ) : null}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm font-medium text-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
