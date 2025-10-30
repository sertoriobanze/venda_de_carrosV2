// app/(tabs)/my-cars.tsx
import { useEffect, useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAllCars, deleteCarById, initDatabase } from '@/lib/database';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';

export default function MyCarsScreen() {
  const { user } = useAuth();
  const [cars, setCars] = useState<any[]>([]);
  const router = useRouter();

  const loadMyCars = async () => {
    initDatabase();
    const all = getAllCars();
    const mine = all.filter(c => c.userId === user?.id);
    setCars(mine);
  };

  useFocusEffect(
    useCallback(() => {
      loadMyCars();
    }, [user])
  );

  const handleDelete = (id: number) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteCarById(id);
          loadMyCars();
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Meus Carros</ThemedText>
      </ThemedView>

      <FlatList
        data={cars}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            <Image source={{ uri: item.imagePath }} style={styles.image} />
            <ThemedView style={styles.info}>
              <ThemedText style={styles.name}>{item.brand} {item.model}</ThemedText>
              <ThemedText style={styles.price}>{item.price.toLocaleString('pt-MZ')} MZN</ThemedText>
            </ThemedView>
            <ThemedView style={styles.actions}>
              <TouchableOpacity
                onPress={() => router.push(`/edit-car?id=${item.id}`)}
                style={styles.editBtn}
              >
                <Ionicons name="create" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
            Você ainda não publicou nenhum carro.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = {
  header: { padding: 16, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold' },
  list: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, flexDirection: 'row', elevation: 2 },
  image: { width: 80, height: 60, borderRadius: 8 },
  info: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  name: { fontWeight: '600' },
  price: { fontWeight: 'bold', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  editBtn: { padding: 8 },
  deleteBtn: { padding: 8 },
};