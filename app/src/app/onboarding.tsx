import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button, IconTile, Screen, Text } from '@/components';
import { useOnboarding } from '@/data/onboarding';
import { useTheme, type ThemeColors } from '@/data/theme';
import type { IconName } from '@/icons';

type Slide = {
  icon: IconName;
  color: string;
  tint: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    icon: 'wallet',
    color: '#0F7A56',
    tint: '#E4F1EB',
    title: 'Bem-vindo ao Cofrinanças',
    body: 'Tenha suas finanças organizadas de forma simples e do seu jeito.',
  },
  {
    icon: 'chart',
    color: '#3E5C76',
    tint: '#ECF0F4',
    title: 'Controle seu dinheiro',
    body: 'Registre suas receitas e despesas e saiba exatamente para onde seu dinheiro está indo.',
  },
  {
    icon: 'target',
    color: '#5B5BD6',
    tint: '#EDEDFB',
    title: 'Conquiste suas metas',
    body: 'Crie objetivos financeiros e acompanhe seu progresso até realizar cada um deles.',
  },
  {
    icon: 'check',
    color: '#0F7A56',
    tint: '#E4F1EB',
    title: 'Comece a cuidar do seu dinheiro',
    body: 'Organize sua vida financeira com o Cofrinanças.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { complete } = useOnboarding();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [step, setStep] = useState(0);

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const finish = async () => {
    await complete();
    router.replace('/login');
  };

  const next = () => {
    if (isLast) void finish();
    else setStep((s) => s + 1);
  };

  return (
    <Screen scroll={false} edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.topBar}>
        {!isLast ? (
          <Text
            weight="bold"
            color={colors.textMuted}
            style={styles.skip}
            onPress={() => void finish()}>
            Pular
          </Text>
        ) : null}
      </View>

      <View style={styles.center}>
        <IconTile icon={slide.icon} color={slide.color} tint={slide.tint} size={96} rounded={30} />
        <Text weight="extrabold" style={styles.title}>
          {slide.title}
        </Text>
        <Text weight="medium" color={colors.textMuted} style={styles.body}>
          {slide.body}
        </Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              hitSlop={8}
              onPress={() => setStep(i)}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
        </View>
        <Button
          label={isLast ? 'Começar' : 'Próximo'}
          variant="ink"
          onPress={next}
          style={styles.cta}
        />
      </View>
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  content: { flex: 1, gap: 0, justifyContent: 'space-between' },
  topBar: { minHeight: 28, alignItems: 'flex-end', justifyContent: 'center' },
  skip: { fontSize: 14, paddingVertical: 4, paddingHorizontal: 4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, paddingHorizontal: 8 },
  title: { fontSize: 24, letterSpacing: -0.5, textAlign: 'center' },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center' },

  bottom: { gap: 20, paddingBottom: 6 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ringStrong },
  dotActive: { width: 22, backgroundColor: colors.green },
  cta: {},
});
