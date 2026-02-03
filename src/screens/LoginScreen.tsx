import React, { useState } from 'react';
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
import { API_CONFIG } from '../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginScreen = ({ onLoginSuccess }: any) => {
  const [email, setEmail] = useState('test@echo.com');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/users/login`, {
        email,
        password,
      });
      const { token } = response.data;
      await AsyncStorage.setItem('userToken', token); // Token'ı cibe attık!
      onLoginSuccess(); // App.tsx'e "Giriş tamam!" diyoruz.
    } catch (error: any) {
      Alert.alert('HATA', 'Bilgiler yanlış veya sunucu kapalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Senin mevcut UI kodların buraya gelecek */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
