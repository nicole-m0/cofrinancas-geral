/**
 * Icon set ported 1:1 from the Claude Design symbol sheet
 * (viewBox 0 0 24 24, stroke = currentColor, round caps/joins).
 */
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'list'
  | 'target'
  | 'user'
  | 'plus'
  | 'house'
  | 'cart'
  | 'car'
  | 'bag'
  | 'film'
  | 'heart'
  | 'briefcase'
  | 'wallet'
  | 'chart'
  | 'wifi'
  | 'bell'
  | 'cal'
  | 'chev'
  | 'back'
  | 'filter'
  | 'pencil'
  | 'trash'
  | 'up'
  | 'down'
  | 'check';

type GlyphProps = { color: string };

const GLYPHS: Record<IconName, { sw: number; render: (p: GlyphProps) => React.ReactNode }> = {
  home: {
    sw: 1.7,
    render: ({ color }) => (
      <Path
        d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"
        stroke={color}
      />
    ),
  },
  list: {
    sw: 1.7,
    render: ({ color }) => <Path d="M4 7h16M4 12h16M4 17h10" stroke={color} />,
  },
  target: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Circle cx="12" cy="12" r="8" stroke={color} />
        <Circle cx="12" cy="12" r="3.4" stroke={color} />
      </>
    ),
  },
  user: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Circle cx="12" cy="8.5" r="3.6" stroke={color} />
        <Path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" stroke={color} />
      </>
    ),
  },
  plus: {
    sw: 2.1,
    render: ({ color }) => <Path d="M12 5v14M5 12h14" stroke={color} />,
  },
  house: {
    sw: 1.7,
    render: ({ color }) => (
      <Path d="M4 10.5 12 5l8 5.5V20h-5.5v-5.5h-5V20H4z" stroke={color} />
    ),
  },
  cart: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Path d="M4 5h2l2.2 9.5h9.3L20 8H7" stroke={color} />
        <Circle cx="9.5" cy="19" r="1.4" stroke={color} />
        <Circle cx="17" cy="19" r="1.4" stroke={color} />
      </>
    ),
  },
  car: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Path d="M4 16v-3l2-5h12l2 5v3h-2.5M4 16h4.5M15.5 16h-4" stroke={color} />
        <Circle cx="8" cy="17" r="1.6" stroke={color} />
        <Circle cx="16" cy="17" r="1.6" stroke={color} />
      </>
    ),
  },
  bag: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Path d="M5.5 8h13l-1 12h-11z" stroke={color} />
        <Path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke={color} />
      </>
    ),
  },
  film: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Rect x="4" y="6" width="16" height="12" rx="2.5" stroke={color} />
        <Path d="M10 9.5v5l4.5-2.5z" stroke={color} />
      </>
    ),
  },
  heart: {
    sw: 1.7,
    render: ({ color }) => (
      <Path
        d="M12 19s-6.5-4-6.5-8.2A3.6 3.6 0 0 1 12 8.6a3.6 3.6 0 0 1 6.5 2.2C18.5 15 12 19 12 19z"
        stroke={color}
      />
    ),
  },
  briefcase: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Rect x="3.5" y="8" width="17" height="11" rx="2.2" stroke={color} />
        <Path d="M9 8V6.6A1.6 1.6 0 0 1 10.6 5h2.8A1.6 1.6 0 0 1 15 6.6V8" stroke={color} />
      </>
    ),
  },
  wallet: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Rect x="3.5" y="6.5" width="17" height="12" rx="2.6" stroke={color} />
        <Path d="M15 12.5h3.5" stroke={color} />
      </>
    ),
  },
  chart: {
    sw: 1.7,
    render: ({ color }) => <Path d="M5 19V9M12 19V5M19 19v-7" stroke={color} />,
  },
  wifi: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Path d="M4 10a12 12 0 0 1 16 0M7 13.5a7.5 7.5 0 0 1 10 0" stroke={color} />
        <Circle cx="12" cy="17.5" r="1.2" fill={color} />
      </>
    ),
  },
  bell: {
    sw: 1.7,
    render: ({ color }) => (
      <Path d="M7 17V11a5 5 0 0 1 10 0v6M5 17h14M10.5 20h3" stroke={color} />
    ),
  },
  cal: {
    sw: 1.7,
    render: ({ color }) => (
      <>
        <Rect x="4" y="6" width="16" height="14" rx="2.4" stroke={color} />
        <Path d="M4 10.5h16M9 4.5v3M15 4.5v3" stroke={color} />
      </>
    ),
  },
  chev: {
    sw: 1.8,
    render: ({ color }) => <Path d="M9.5 6l6 6-6 6" stroke={color} />,
  },
  back: {
    sw: 1.8,
    render: ({ color }) => <Path d="M14.5 6l-6 6 6 6" stroke={color} />,
  },
  filter: {
    sw: 1.7,
    render: ({ color }) => <Path d="M4 7h16M7 12h10M10 17h4" stroke={color} />,
  },
  pencil: {
    sw: 1.7,
    render: ({ color }) => <Path d="M5 19h3l10-10-3-3L5 16z" stroke={color} />,
  },
  trash: {
    sw: 1.7,
    render: ({ color }) => (
      <Path d="M5 7h14M9 7V5.5h6V7M7 7l1 12h8l1-12" stroke={color} />
    ),
  },
  up: {
    sw: 1.9,
    render: ({ color }) => <Path d="M12 19V6M6.5 11.5 12 6l5.5 5.5" stroke={color} />,
  },
  down: {
    sw: 1.9,
    render: ({ color }) => <Path d="M12 5v13M6.5 12.5 12 18l5.5-5.5" stroke={color} />,
  },
  check: {
    sw: 2.1,
    render: ({ color }) => <Path d="M5 12.5 10 17.5 19 7" stroke={color} />,
  },
};

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, color = '#101413', strokeWidth }: IconProps) {
  const glyph = GLYPHS[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth ?? glyph.sw}
      strokeLinecap="round"
      strokeLinejoin="round">
      {glyph.render({ color })}
    </Svg>
  );
}
