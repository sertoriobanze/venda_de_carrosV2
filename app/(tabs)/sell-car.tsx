import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { CarForm } from '@/components/forms/CarForm';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function SellCarScreen() {
  const { user, loadUser } = useAuth();
  const router = useRouter();

  // Verifica login ao carregar
  useEffect(() => {
    loadUser().then(() => {
      if (!user) {
        router.replace('/(auth)/login');
      }
    });
  }, [user, router]);

  // Evita flash enquanto redireciona
  if (!user) {
    return null;
  }

  const handleSuccess = () => {
    router.push('/(tabs)/my-cars');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Vender Carro</ThemedText>
        <View style={{ width: 28 }} />
      </ThemedView>

      {/* Formulário */}
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.formContainer}>
          <CarForm onSuccess={handleSuccess} />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
};