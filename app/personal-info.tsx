import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, ChevronLeft } from 'lucide-react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/contexts/UserContext';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { userInfo, saveUserInfo } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setPhone(userInfo.phone);
    setAddress(userInfo.address);
  }, [userInfo]);

  const handleSave = async () => {
    try {
      await saveUserInfo({ name, email, phone, address });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Guardado', 'Información personal actualizada correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la información');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Información Personal',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <User size={18} color="#666" strokeWidth={1.5} />
            <Text style={styles.label}>Nombre completo</Text>
          </View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <Mail size={18} color="#666" strokeWidth={1.5} />
            <Text style={styles.label}>Email</Text>
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@ejemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <Phone size={18} color="#666" strokeWidth={1.5} />
            <Text style={styles.label}>Teléfono</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+34 600 000 000"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <MapPin size={18} color="#666" strokeWidth={1.5} />
            <Text style={styles.label}>Dirección</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            placeholder="Dirección completa"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
    letterSpacing: 0.2,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
    letterSpacing: 1,
  },
});
