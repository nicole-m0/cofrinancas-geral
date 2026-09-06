import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
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

import { FinanceProvider } from '@/data/store';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FinanceProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.screen },
            }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="nova-despesa" options={{ presentation: 'modal' }} />
            <Stack.Screen name="nova-receita" options={{ presentation: 'modal' }} />
            <Stack.Screen name="criar-meta" options={{ presentation: 'modal' }} />
            <Stack.Screen name="categorias" />
            <Stack.Screen name="relatorios" />
            <Stack.Screen name="meta/[id]" />
          </Stack>
        </FinanceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
