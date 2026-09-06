'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';

import { Icon } from './Icon';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  className?: string;
};

export type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getKey: (row: T) => string;
  rowHref?: (row: T) => string;
  searchText?: (row: T) => string;
  searchPlaceholder?: string;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  emptyText?: string;
  toolbar?: ReactNode;
};

export function DataTable<T>({
  rows,
  columns,
  getKey,
  rowHref,
  searchText,
  searchPlaceholder = 'Buscar…',
  initialSort,
  emptyText = 'Nada por aqui.',
  toolbar,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(
    initialSort ?? null,
  );

  const filtered = useMemo(() => {
    let list = rows;
    if (searchText && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => searchText(r).toLowerCase().includes(q));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        const dir = sort.dir === 'asc' ? 1 : -1;
        list = [...list].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          if (av < bv) return -1 * dir;
          if (av > bv) return 1 * dir;
          return 0;
        });
      }
    }
    return list;
  }, [rows, columns, query, sort, searchText]);

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' },
    );
  };

  return (
    <div className="rounded-2xl border border-hair bg-card">
      {(searchText || toolbar) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-hair p-4">
          {searchText ? (
            <div className="flex min-w-56 flex-1 items-center gap-2 rounded-xl bg-sunken px-3 py-2">
              <Icon name="search" size={16} className="text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-faint"
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-hair text-left">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`whitespace-nowrap px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-faint ${
                    c.align === 'right' ? 'text-right' : ''
                  }`}>
                  {c.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-ink">
                      {c.header}
                      {sort?.key === c.key ? (
                        <Icon
                          name={sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'}
                          size={12}
                        />
                      ) : null}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const href = rowHref?.(row);
              return (
                <tr
                  key={getKey(row)}
                  className="border-b border-hair last:border-0 hover:bg-sunken/60">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 align-middle ${
                        c.align === 'right' ? 'text-right' : ''
                      } ${c.className ?? ''}`}>
                      {href ? (
                        <Link href={href} className="block">
                          {c.render(row)}
                        </Link>
                      ) : (
                        c.render(row)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm font-medium text-muted">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
