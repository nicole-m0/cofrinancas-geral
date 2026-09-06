import type { SVGProps } from 'react';

export type IconName =
  | 'grid'
  | 'users'
  | 'list'
  | 'target'
  | 'tag'
  | 'repeat'
  | 'chart'
  | 'search'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron'
  | 'wallet'
  | 'external';

const PATHS: Record<IconName, string> = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z',
  users:
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c1-3.2 3.6-4.8 6.5-4.8s5.5 1.6 6.5 4.8M17 11.2a3 3 0 0 0 0-6M21.5 20c-.7-2.4-2.2-3.9-4.5-4.5',
  list: 'M4 7h16M4 12h16M4 17h10',
  target: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  tag: 'M4 4h7l9 9-7 7-9-9zM8.5 8.5h.01',
  repeat: 'M4 9l3-3h11v5M20 15l-3 3H6v-5',
  chart: 'M5 19V9M12 19V5M19 19v-7',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  'arrow-up': 'M12 19V6M6.5 11.5 12 6l5.5 5.5',
  'arrow-down': 'M12 5v13M6.5 12.5 12 18l5.5-5.5',
  chevron: 'M9.5 6l6 6-6 6',
  wallet: 'M4 7h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11M16 12.5h3',
  external: 'M7 17 17 7M9 7h8v8',
};

export function Icon({
  name,
  size = 18,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d={PATHS[name]} />
    </svg>
  );
}
