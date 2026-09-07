import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField } from '@/components';
import { useAuth } from '@/data/auth';
import { useTheme, type ThemeColors } from '@/data/theme';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signup') await signUp(name.trim(), email.trim(), password);
      else await signIn(email.trim(), password);
      // navegação é feita pelo RootNavigator quando o status vira "authed"
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.head}>
        <View style={styles.logo}>
          <Text weight="extrabold" color={colors.white} style={styles.logoText}>
            C
          </Text>
        </View>
        <Text weight="extrabold" style={styles.title}>
          {mode === 'login' ? 'Cofrinanças' : 'Criar sua conta'}
        </Text>
        <Text weight="medium" color={colors.textMuted} style={styles.sub}>
          {mode === 'login'
            ? 'Acesse com seu e-mail e senha.'
            : 'Leva menos de um minuto.'}
        </Text>
      </View>

      <View style={styles.form}>
        {mode === 'signup' ? (
          <TextField
            label="Nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            placeholder="Como te chamamos?"
          />
        ) : null}

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="voce@email.com"
        />

        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder="mínimo 6 caracteres"
        />

        {error ? (
          <Text weight="bold" color={colors.rust} style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Button
          label={busy ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta e entrar'}
          variant="ink"
          onPress={submit}
          disabled={busy || !email || password.length < 6 || (mode === 'signup' && name.trim().length < 2)}
          style={styles.submit}
        />

        <Text
          weight="bold"
          color={colors.green}
          style={styles.switch}
          onPress={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError(null);
          }}>
          {mode === 'login' ? 'Não tenho conta — criar agora' : 'Já tenho conta — entrar'}
        </Text>
      </View>
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  head: { alignItems: 'center', gap: 6, marginTop: 24, marginBottom: 28 },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: { fontSize: 22 },
  title: { fontSize: 22, letterSpacing: -0.4 },
  sub: { fontSize: 13, textAlign: 'center' },

  form: { gap: 16 },
  error: { fontSize: 12.5 },
  submit: { marginTop: 4 },
  switch: { fontSize: 13, textAlign: 'center', paddingVertical: 8 },
});
