import { Tabs } from "expo-router";
import { Store, ShoppingCart, User, Palette } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCart } from "@/contexts/CartContext";

export default function TabLayout() {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        headerShown: true,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          backgroundColor: "#fff",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
          marginTop: 4,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Catálogo",
          headerTitle: "PRESTIGE WHOLESALE",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 2,
          },
          tabBarIcon: ({ color }) => <Store size={24} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          headerTitle: "MI CARRITO",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 2,
          },
          tabBarIcon: ({ color }) => (
            <View>
              <ShoppingCart size={24} color={color} strokeWidth={1.5} />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="customization"
        options={{
          title: "Personalización",
          headerTitle: "PERSONALIZACIÓN",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 2,
          },
          tabBarIcon: ({ color }) => <Palette size={24} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerTitle: "MI PERFIL",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 2,
          },
          tabBarIcon: ({ color }) => <User size={24} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    backgroundColor: "#000",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
