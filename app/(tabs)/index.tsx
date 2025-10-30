import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { user, loadUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser().finally(() => setLoading(false));
  }, []);

  const handleSellCar = () => {
    Haptics.selectionAsync();
    router.push('/(tabs)/sell-car');
  };

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ThemedView style={styles.container}>

        {/* HERO SECTION */}
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedView style={styles.heroContent}>
            <ThemedText style={styles.greeting}>
              {user ? `Olá, ${user.name.split(' ')[0]}!` : 'Bem-vindo ao'}
            </ThemedText>
            <ThemedText style={styles.title}>Carros Usados</ThemedText>
            <ThemedText style={styles.subtitle}>
              {user
                ? 'Encontre ou venda seu carro com segurança'
                : 'Compre e venda com confiança e facilidade'}
            </ThemedText>
          </ThemedView>

          <View style={styles.carIcon}>
            <Ionicons name="car-sport" size={120} color="#fff" />
          </View>
        </LinearGradient>

        {/* CTA SECTION */}
        <ThemedView style={styles.ctaSection}>
          {user ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleSellCar}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <ThemedText style={styles.buttonText}>Vender Meu Carro</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedView style={styles.authButtons}>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                  <Ionicons name="log-in" size={24} color="#fff" />
                  <ThemedText style={styles.buttonText}>Fazer Login</ThemedText>
                </TouchableOpacity>
              </Link>

              <Link href="/(auth)/register" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Ionicons name="person-add" size={24} color="#000" />
                  <ThemedText style={styles.secondaryText}>Criar Conta</ThemedText>
                </TouchableOpacity>
              </Link>
            </ThemedView>
          )}
        </ThemedView>

        {/* FEATURES */}
        <ThemedView style={styles.features}>
          <ThemedView style={styles.featureCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={32} color="#4facfe" />
            </View>
            <ThemedText style={styles.featureTitle}>Segurança</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Anúncios verificados e contato direto
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="search" size={32} color="#00f2fe" />
            </View>
            <ThemedText style={styles.featureTitle}>Busca Rápida</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Filtros por preço, ano e marca
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubble" size={32} color="#7c3aed" />
            </View>
            <ThemedText style={styles.featureTitle}>Contato Direto</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Fale direto com o vendedor
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* FOOTER */}
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Milhares de carros à sua espera
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = {
  container: {
    paddingBottom: 40,
  },
  hero: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  heroContent: {
    padding: 24,
    paddingTop: 60,
    zIndex: 2,
  },
  greeting: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
  },
  carIcon: {
    position: 'absolute' as const,
    right: 16,
    bottom: -20,
    opacity: 0.2,
  },
  ctaSection: {
    padding: 24,
    paddingTop: 32,
  },
  primaryButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 12,
  },
  authButtons: {
    gap: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
};