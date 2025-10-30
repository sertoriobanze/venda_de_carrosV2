import { useState } from 'react';
import { View, Alert ,KeyboardAvoidingView} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/Input';
import { Button } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)'); // Vai para as abas
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="car-sport" size={64} color="#000" />
        <ThemedText type="title" style={styles.title}>Carros Usados</ThemedText>
        <ThemedText style={styles.subtitle}>Faça login para vender</ThemedText>
      </View>

      {/* Form */}
      <KeyboardAvoidingView style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Button
          title={loading ? 'Entrando...' : 'Entrar'}
          onPress={handleLogin}
          disabled={loading}
        />

        <View style={styles.linkContainer}>
          <ThemedText style={styles.linkText}>
            Não tem conta?{' '}
          </ThemedText>
          <Link href="/(auth)/register" asChild>
            <ThemedText type="defaultSemiBold" style={styles.link}>
              Criar conta
            </ThemedText>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  },
  form: {
    flex: 1,
    gap: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
  },
  link: {
    color: '#000',
    fontSize: 16,
  },
};