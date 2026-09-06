'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon, type IconName } from './Icon';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Visão geral', icon: 'grid' },
  { href: '/usuarios', label: 'Usuários', icon: 'users' },
  { href: '/transacoes', label: 'Transações', icon: 'list' },
  { href: '/metas', label: 'Metas', icon: 'target' },
  { href: '/categorias', label: 'Categorias', icon: 'tag' },
  { href: '/recorrentes', label: 'Recorrentes', icon: 'repeat' },
  { href: '/relatorios', label: 'Relatórios', icon: 'chart' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col gap-1 bg-ink px-4 py-6 text-white/70">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-sm font-extrabold text-white">
          C
        </span>
        <div className="leading-tight">
          <div className="text-sm font-extrabold text-white">Cofrinanças</div>
          <div className="text-[11px] font-semibold text-white/45">Painel admin</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl bg-white/5 px-3 py-3 text-[11px] font-semibold leading-relaxed text-white/45">
        Protótipo · dados em mock. Sem backend, sem banco.
      </div>
    </aside>
  );
}
