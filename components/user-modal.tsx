// components/user-modal.tsx
import { Modal, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

type UserModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function UserModal({ visible, onClose }: UserModalProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Haptics.selectionAsync();
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          onClose();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <ThemedView style={styles.modal}>
          {user ? (
            <>
              {/* Perfil do usuário */}
              <View style={styles.userInfo}>
                <Ionicons name="person-circle" size={48} color="#000" />
                <View>
                  <ThemedText style={styles.userName}>{user.name}</ThemedText>
                  <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Opções */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  Haptics.selectionAsync();
                  onClose();
                  router.push('/(tabs)/profile');
                }}
              >
                <Ionicons name="person-outline" size={24} color="#000" />
                <ThemedText style={styles.optionText}>Meu Perfil</ThemedText>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                <ThemedText style={[styles.optionText, { color: '#e74c3c' }]}>Sair</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Não logado */}
              <View style={styles.guestHeader}>
                <Ionicons name="person-circle-outline" size={56} color="#999" />
                <ThemedText style={styles.guestTitle}>Entre na sua conta</ThemedText>
                <ThemedText style={styles.guestSubtitle}>
                  Faça login para vender carros e gerenciar seu perfil
                </ThemedText>
              </View>

              <View style={styles.divider} />

              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.authButton}>
                  <Ionicons name="log-in-outline" size={24} color="#fff" />
                  <ThemedText style={styles.authText}>Fazer Login</ThemedText>
                </TouchableOpacity>
              </Link>

              <Link href="/(auth)/register" asChild>
                <TouchableOpacity style={[styles.authButton, styles.registerButton]}>
                  <Ionicons name="person-add-outline" size={24} color="#000" />
                  <ThemedText style={styles.registerText}>Criar Conta</ThemedText>
                </TouchableOpacity>
              </Link>
            </>
          )}
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  guestHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  authText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#f0f0f0',
  },
  registerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
};