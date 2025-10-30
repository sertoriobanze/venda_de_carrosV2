import { useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text'; // ← ADICIONE ESTA LINHA
import { Input } from '@/components/ui/Input';
import { CarImagePicker } from './ImagePicker';
import { Button, TouchableOpacity } from 'react-native';
import { saveImageLocally } from '@/lib/storage';
import { insertCar, initDatabase, resetDatabase } from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/lib/auth'; // ← ADICIONE

type CarFormProps = {
  onSuccess: () => void;
};

type ValidationError = {
  field: 'brand' | 'model' | 'year' | 'price' | 'image';
  message: string;
};

export function CarForm({ onSuccess }: CarFormProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { user } = useAuth(); // ← PEGA O USUÁRIO LOGADO
// No CarForm, antes do insert:

  // Máscara de preço
  const formatPrice = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return (parseInt(num) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePriceChange = (text: string) => {
    const num = text.replace(/\D/g, '');
    setPrice(num);
  };

  const displayPrice = () => formatPrice(price);

  // Validação
  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!brand.trim()) newErrors.push({ field: 'brand', message: 'Marca é obrigatória' });
    if (!model.trim()) newErrors.push({ field: 'model', message: 'Modelo é obrigatório' });
    if (!year || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 1)
      newErrors.push({ field: 'year', message: 'Ano inválido' });
    if (!price || parseInt(price) <= 0) newErrors.push({ field: 'price', message: 'Preço deve ser maior que zero' });
    if (!imageUri) newErrors.push({ field: 'image', message: 'Foto é obrigatória' });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const removeError = (field: ValidationError['field']) => {
    setErrors(prev => prev.filter(e => e.field !== field));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      initDatabase();
      const imagePath = await saveImageLocally(imageUri!);

      insertCar({
        brand: brand.trim(),
        model: model.trim(),
        year: parseInt(year),
        price: parseFloat(price) / 100,
        description: description.trim(),
        imagePath,
        userId: user?.id || '', 
        phone: '841234567', // opcional
      });

      alert('Carro cadastrado com sucesso!');
      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o carro');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBrand('');
    setModel('');
    setYear('');
    setPrice('');
    setDescription('');
    setImageUri(null);
    setErrors([]);
  };

  return (
    <ThemedView style={{ gap: 16 }}>
      {/* Preview da Foto */}
      {imageUri ? (
        <ThemedView style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeImage} onPress={() => setImageUri(null)}>
            <Ionicons name="close-circle" size={28} color="#e74c3c" />
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <CarImagePicker onImagePicked={setImageUri} />
      )}

      {/* Erros */}
      {errors.length > 0 && (
        <ThemedView style={styles.errorsContainer}>
          {errors.map((error, i) => (
            <ThemedView key={i} style={styles.errorCard}>
              <Ionicons name="alert-circle" size={20} color="#fff" />
              <ThemedText style={styles.errorText}>{error.message}</ThemedText>
              <TouchableOpacity onPress={() => removeError(error.field)}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {/* Campos */}
      <Input label="Marca" value={brand} onChangeText={setBrand} placeholder="Ex: Toyota" />
      <Input label="Modelo" value={model} onChangeText={setModel} placeholder="Ex: Corolla" />
      <Input
        label="Ano"
        value={year}
        onChangeText={setYear}
        placeholder="Ex: 2023"
        keyboardType="numeric"
      />
      <Input
        label="Preço (R$)"
        value={displayPrice()}
        onChangeText={handlePriceChange}
        placeholder="Ex: 85.000,00"
        keyboardType="numeric"
      />
      <Input
        label="Descrição (opcional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Fale sobre o carro..."
        multiline
        numberOfLines={3}
      />

      <Button
        title={loading ? 'Salvando...' : 'Cadastrar Carro'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ThemedView>
  );
}

const styles = {
  imagePreview: {
    position: 'relative',
    alignSelf: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  errorsContainer: {
    gap: 8,
  },
  errorCard: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 2,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
};