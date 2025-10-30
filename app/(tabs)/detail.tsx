import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { Button, ScrollView } from 'react-native';
import { getAllCars, initDatabase } from '@/lib/database';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<any>(null);

  useEffect(() => {
    initDatabase();
    const data = getAllCars().find(c => c.id === Number(id));
    setCar(data);
  }, [id]);

  if (!car) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Carro não encontrado</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        {/* Header */}
        <ThemedView style={styles.header}>
          <Ionicons name="chevron-back" size={28} color="#000" onPress={() => router.back()} />
          <ThemedText type="title" style={styles.title}>Detalhes</ThemedText>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </ThemedView>

        {/* Car Image */}
        <Image
          source={{ uri: car.imagePath }}
          style={styles.carImage}
          contentFit="cover"
        />

        {/* Info */}
        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.carName}>
            {car.brand} {car.model}
          </ThemedText>
          <ThemedText style={styles.carPrice}>
             {Number(car.price).toLocaleString('pt-BR')} MZN
          </ThemedText>
          <ThemedText style={styles.carYear}>
            Ano: {car.year}
          </ThemedText>

          <ThemedText style={styles.description}>
            {car.description || 'Carro em ótimo estado, revisado e com garantia. Ideal para quem busca conforto e economia.'}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>Informações</ThemedText>
          <ThemedView style={styles.propsGrid}>
            <ThemedView style={styles.prop}>
              <ThemedText style={styles.propLabel}>Marca</ThemedText>
              <ThemedText style={styles.propValue}>{car.brand}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.prop}>
              <ThemedText style={styles.propLabel}>Modelo</ThemedText>
              <ThemedText style={styles.propValue}>{car.model}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.prop}>
              <ThemedText style={styles.propLabel}>Ano</ThemedText>
              <ThemedText style={styles.propValue}>{car.year}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.prop}>
              <ThemedText style={styles.propLabel}>Preço</ThemedText>
              <ThemedText style={styles.propValue}> {car.price.toLocaleString('pt-BR')} MZN</ThemedText>
            </ThemedView>
          </ThemedView>

          <Button
            title="Entrar em Contato"
            color="#000"
            onPress={() => alert('Contato aberto!')}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  title: { fontSize: 20, fontWeight: '600' },
  carImage: { width: '100%', height: 240 },
  infoContainer: { padding: 20 },
  carName: { fontSize: 24, fontWeight: 'bold' },
  carPrice: { fontSize: 22, fontWeight: 'bold', color: '#000', marginVertical: 4 },
  carYear: { color: '#666', marginBottom: 16 },
  description: { lineHeight: 22, marginBottom: 20, color: '#444' },
  sectionTitle: { fontWeight: '600', marginTop: 20, marginBottom: 12 },
  propsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  prop: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    width: '48%',
  },
  propLabel: { fontSize: 13, color: '#666' },
  propValue: { fontWeight: '600', marginTop: 4 },
};