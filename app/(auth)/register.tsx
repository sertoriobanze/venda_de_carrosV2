import { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/Input';
import { Button } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      Alert.alert('Sucesso', 'Conta criada! Faça login.');
      router.push('/(auth)/login');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="car-sport" size={64} color="#000" />
        <ThemedText type="title" style={styles.title}>Criar Conta</ThemedText>
        <ThemedText style={styles.subtitle}>Cadastre-se para vender carros</ThemedText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          label="Nome completo"
          value={name}
          onChangeText={setName}
          placeholder="João Silva"
        />
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
          title={loading ? 'Criando...' : 'Criar Conta'}
          onPress={handleRegister}
          disabled={loading}
        />

        <View style={styles.linkContainer}>
          <ThemedText style={styles.linkText}>
            Já tem conta?{' '}
          </ThemedText>
          <Link href="/(auth)/login" asChild>
            <ThemedText type="defaultSemiBold" style={styles.link}>
              Fazer login
            </ThemedText>
          </Link>
        </View>
      </View>
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