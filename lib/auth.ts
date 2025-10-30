// lib/auth.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,

  login: async (email, password) => {
    if (!email || !password) throw new Error('Preencha todos os campos');
    if (password.length < 6) throw new Error('Senha muito curta');

    const user = { id: Date.now().toString(), name: email.split('@')[0], email };
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user });
  },

  register: async (name, email, password) => {
    if (!name || !email || !password) throw new Error('Preencha todos os campos');
    if (password.length < 6) throw new Error('Senha muito curta');

    const user = { id: Date.now().toString(), name, email };
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('user');
    set({ user: null });
  },

  loadUser: async () => {
    const userJson = await SecureStore.getItemAsync('user');
    if (userJson) {
      set({ user: JSON.parse(userJson) });
    }
  },
}));