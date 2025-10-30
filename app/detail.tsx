// app/detail.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { Button, ScrollView, Linking, Alert } from 'react-native';
import { getAllCars, initDatabase, deleteCarById } from '@/lib/database';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initDatabase();
    const data = getAllCars().find(c => c.id === Number(id));
    setCar(data);
  }, [id]);

  const isOwner = car?.userId === user?.id;

  const handleContact = () => {
    Linking.openURL(`tel:+258${car.phone || '841234567'}`);
  };

  const handleDelete = () => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteCarById(car.id);
          router.back();
        },
      },
    ]);
  };

  if (!car) return <ThemedText>Carro não encontrado</ThemedText>;

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.header}>
          <Ionicons name="chevron-back" size={28} color="#000" onPress={() => router.back()} />
          <ThemedText type="title">Detalhes</ThemedText>
          {isOwner && (
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          )}
        </ThemedView>

        <Image source={{ uri: car.imagePath }} style={styles.image} />

        <ThemedView style={styles.info}>
          <ThemedText style={styles.name}>{car.brand} {car.model}</ThemedText>
          <ThemedText style={styles.price}>{Number(car.price).toLocaleString('pt-MZ')} MZN</ThemedText>

          {isOwner ? (
            <ThemedView style={styles.ownerActions}>
              <Button title="Editar" onPress={() => router.push(`/edit-car?id=${car.id}`)} />
              <Button title="Excluir" color="#e74c3c" onPress={handleDelete} />
            </ThemedView>
          ) : (
            <Button title="Entrar em Contato" onPress={handleContact} />
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = {
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 50 },
  image: { width: '100%', height: 240 },
  info: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  ownerActions: { gap: 12, marginTop: 20 },
};