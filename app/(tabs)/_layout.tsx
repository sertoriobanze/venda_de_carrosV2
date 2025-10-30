import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { UserModal } from '@/components/user-modal';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loadUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tintColor,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="cars"
          options={{
            title: 'Carros',
            tabBarIcon: ({ color }) => <Ionicons name="car-sport" size={26} color={color} />,
          }}
        />
        {user ? (
          <>
            <Tabs.Screen
              name="sell-car"
              options={{
                title: 'Vender',
                tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={28} color={color} />,
              }}
            />
            <Tabs.Screen
              name="my-cars"
              options={{
                title: 'Meus',
                tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} />,
              }}
            />
          </>
        ) : (
          <>
            <Tabs.Screen name="sell-car" options={{ href: null }} />
            <Tabs.Screen name="my-cars" options={{ href: null }} />
          </>
        )}
      </Tabs>

      {/* MODAL FORA DO TABS */}
      <UserModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}