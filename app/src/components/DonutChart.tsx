import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/data/theme';

export type DonutSegment = { pct: number; color: string };

export type DonutChartProps = {
  size: number;
  strokeWidth: number;
  segments: DonutSegment[];
  children?: React.ReactNode;
};

export function DonutChart({ size, strokeWidth, segments, children }: DonutChartProps) {
  const { colors } = useTheme();
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.pct, 0) || 1;

  const arcs = segments.reduce<React.ReactNode[]>((out, seg, i) => {
    const accBefore = segments.slice(0, i).reduce((s, x) => s + x.pct, 0);
    const dash = c * (seg.pct / total);
    const gap = c - dash;
    const rotation = -90 + (accBefore / total) * 360;
    out.push(
      <Circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={seg.color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={[dash, gap]}
        transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
      />,
    );
    return out;
  }, []);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.ringStrong}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {arcs}
      </Svg>
      {children ? <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
