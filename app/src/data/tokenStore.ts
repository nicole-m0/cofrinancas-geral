/**
 * Guarda o Bearer token da sessão, persistido no dispositivo.
 * AsyncStorage funciona no nativo e no web (localStorage por baixo).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'cofrinancas.token';

export const tokenStore = {
  async get(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEY);
    } catch {
      return null;
    }
  },

  async set(token: string | null): Promise<void> {
    try {
      if (token) await AsyncStorage.setItem(KEY, token);
      else await AsyncStorage.removeItem(KEY);
    } catch {
      /* ignora falha de storage */
    }
  },
};
