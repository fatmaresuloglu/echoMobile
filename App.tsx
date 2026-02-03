import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MY_IP = '192.168.1.19';
const API_URL = `http://${MY_IP}:5000/api/users`;

export default function App() {
  // HOOK'LAR HER ZAMAN EN ÜSTTE OLMALI!
  const [email, setEmail] = useState('test@echo.com');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true); // Açılış kontrolü için

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setIsLoggedIn(true);
      } catch (e) {
        console.log('Token okuma hatası');
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem('userToken', token);
      setIsLoggedIn(true);
      Alert.alert('BAŞARILI!', `Hoş geldin ${user.name}`);
    } catch (error: any) {
      Alert.alert(
        'HATA',
        'Giriş başarısız. Bilgileri veya interneti kontrol et.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  // 1. Ekran yüklenirken gösterilecek loading (Hook değil, normal render)
  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  // 2. Eğer giriş yapılmışsa gösterilecek ANA SAYFA
  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ANA SAYFA</Text>
        <Text style={styles.subtitle}>Seni hatırladım, Fatma!</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#cf6679' }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>ÇIKIŞ YAP</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Giriş yapılmamışsa gösterilecek LOGIN EKRANI
  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>ECHO</Text>
        <Text style={styles.subtitle}>Sisteme giriş yapın</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>GİRİŞ YAP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 30,
  },
  headerArea: { marginBottom: 40 },
  title: { fontSize: 45, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 16, color: '#888', marginTop: 5 },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: { padding: 20, color: '#fff', fontSize: 16 },
  button: {
    backgroundColor: '#BB86FC',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
});
