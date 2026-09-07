import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';

import { AuthProvider, useAuth } from '@/data/auth';
import { OnboardingProvider, useOnboarding } from '@/data/onboarding';
import { FinanceProvider } from '@/data/store';
import { ThemeProvider, useTheme } from '@/data/theme';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status: authStatus, user } = useAuth();
  const { status: onbStatus } = useOnboarding();
  const { colors, scheme } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const ready = authStatus !== 'loading' && onbStatus !== 'loading';

  useEffect(() => {
    if (!ready) return;
    const seg = segments[0];
    const inOnboarding = seg === 'onboarding';
    const inLogin = seg === 'login';

    if (authStatus === 'authed') {
      if (inOnboarding || inLogin) router.replace('/');
      return;
    }
    // visitante
    if (onbStatus === 'pending') {
      if (!inOnboarding) router.replace('/onboarding');
    } else if (!inLogin) {
      router.replace('/login');
    }
  }, [ready, authStatus, onbStatus, segments, router]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <FinanceProvider key={authStatus === 'authed' ? (user?.id ?? 'authed') : 'guest'}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.screen },
        }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="nova-despesa" options={{ presentation: 'modal' }} />
        <Stack.Screen name="nova-receita" options={{ presentation: 'modal' }} />
        <Stack.Screen name="criar-meta" options={{ presentation: 'modal' }} />
        <Stack.Screen name="categorias" />
        <Stack.Screen name="relatorios" />
        <Stack.Screen name="meta/[id]" />
      </Stack>
    </FinanceProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <OnboardingProvider>
              <RootNavigator />
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
