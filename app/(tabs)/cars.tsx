import { useEffect, useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, View, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAllCars, initDatabase } from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import { UserModal } from '@/components/user-modal'; // ← NOVO

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  imagePath: string;
};

export default function CarsScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // ← MODAL
  const router = useRouter();

  const loadCars = async () => {
    initDatabase();
    const data = getAllCars().map(car => ({
      ...car,
      price: Number(car.price) || 0,
    }));
    setCars(data);
    setFilteredCars(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadCars();
    }, [])
  );

  useEffect(() => {
    let filtered = cars;

    if (search) {
      filtered = filtered.filter(c =>
        c.brand.toLowerCase().includes(search.toLowerCase()) ||
        c.model.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minPrice) {
      const min = parseInt(minPrice) || 0;
      filtered = filtered.filter(c => c.price >= min);
    }

    if (maxPrice) {
      const max = parseInt(maxPrice) || Infinity;
      filtered = filtered.filter(c => c.price <= max);
    }

    setFilteredCars(filtered);
  }, [cars, search, minPrice, maxPrice]);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person-circle-outline" size={32} color="#000" />
        </TouchableOpacity>
      </ThemedView>

      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Carros Disponíveis</ThemedText>
      </ThemedView>

      {/* Search */}
      <ThemedView style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar por marca ou modelo"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </ThemedView>

      {/* Price Filters */}
      <ThemedView style={styles.priceFilter}>
        <TextInput
          placeholder="Preço mínimo (MZN)"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          style={styles.priceInput}
        />
        <TextInput
          placeholder="Preço máximo (MZN)"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          style={styles.priceInput}
        />
      </ThemedView>

      {/* Most Rented Title */}
      <ThemedView style={styles.sectionTitle}>
        <ThemedText type="subtitle">Mais Recentes</ThemedText>
      </ThemedView>

      {/* Car List */}
      <FlatList
        data={filteredCars}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/detail?id=${item.id}`)}
            style={styles.carCard}
          >
            <Image
              source={{ uri: item.imagePath }}
              style={styles.carImage}
              placeholder={{ uri: 'https://via.placeholder.com/120x80' }}
              contentFit="cover"
              transition={200}
            />
            <ThemedView style={styles.carInfo}>
              <ThemedText style={styles.carName}>
                {item.brand} {item.model}
              </ThemedText>
              <ThemedText style={styles.carType}>
                {item.year}
              </ThemedText>
              <ThemedText style={styles.carPrice}>
                {item.price.toLocaleString('pt-MZ')} MZN
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            Nenhum carro disponível.
          </ThemedText>
        }
      />

      {/* MODAL DO USUÁRIO */}
      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  titleContainer: { paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, padding: 12, fontSize: 16 },
  priceFilter: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    elevation: 2,
  },
  sectionTitle: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
  },
  carInfo: { flex: 1, justifyContent: 'center', paddingLeft: 12 },
  carName: { fontSize: 16, fontWeight: '600' },
  carType: { fontSize: 13, color: '#666', marginTop: 2 },
  carPrice: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
};