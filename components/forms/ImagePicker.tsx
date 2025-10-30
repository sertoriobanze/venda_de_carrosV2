import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button, Alert } from 'react-native';
import { useState } from 'react';

type ImagePickerProps = {
  onImagePicked: (uri: string) => void;
};

export function CarImagePicker({ onImagePicked }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // 1. Solicita permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar a galeria.');
      return;
    }

    // 2. Abre a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      // CORREÇÃO: use MediaTypeOptions (ainda válido)
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onImagePicked(uri);
    }
  };

  return (
    <ThemedView style={{ alignItems: 'center', marginBottom: 20 }}>
      {image ? (
        <Image source={{ uri: image }} style={styles.preview} />
      ) : (
        <ThemedView style={styles.placeholder}>
          <ThemedText>Sem imagem</ThemedText>
        </ThemedView>
      )}
      <Button title="Escolher Imagem" onPress={pickImage} />
    </ThemedView>
  );
}

const styles = {
  preview: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholder: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
};