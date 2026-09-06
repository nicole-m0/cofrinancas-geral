import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/theme';

export type DonutSegment = { pct: number; color: string };

export type DonutChartProps = {
  size: number;
  strokeWidth: number;
  segments: DonutSegment[];
  children?: React.ReactNode;
};

export function DonutChart({ size, strokeWidth, segments, children }: DonutChartProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.pct, 0) || 1;

  let acc = 0;
  const arcs = segments.map((seg, i) => {
    const frac = seg.pct / total;
    const dash = c * frac;
    const gap = c - dash;
    const rotation = -90 + (acc / total) * 360;
    acc += seg.pct;
    return (
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
      />
    );
  });

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
