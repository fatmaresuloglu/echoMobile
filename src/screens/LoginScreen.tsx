import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../Themes/ThemeContext'; //
import apiClient from '../api/apiClient'; //
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginScreen = ({ onLoginSuccess }: any) => {
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('test@echo.com');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/users/login', {
        email,
        password,
      });
      await AsyncStorage.setItem('userToken', response.data.token);
      onLoginSuccess();
    } catch (error) {
      Alert.alert('HATA', 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ARKA PLAN IŞILTILARI (Hafif Turuncu) */}
      <View
        style={[
          styles.glowTop,
          { backgroundColor: theme.primary, opacity: isDarkMode ? 0.12 : 0.05 },
        ]}
      />
      <View
        style={[
          styles.glowBottom,
          { backgroundColor: theme.primary, opacity: isDarkMode ? 0.08 : 0.03 },
        ]}
      />

      {/* Küçültülmüş Tema Butonu */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={styles.toggleIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>

      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: theme.primary }]}>ECHO</Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Şifre"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
        ) : (
          <Text
            style={[styles.buttonText, { color: isDarkMode ? '#000' : '#fff' }]}
          >
            GİRİŞ YAP
          </Text>
        )}
      </TouchableOpacity>

      <Text
        style={[styles.footerText, { color: isDarkMode ? '#333' : '#CCC' }]}
      >
        Echo v1.0 - Fatma'ya Özel
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -180,
    right: -120,
    width: 450,
    height: 450,
    borderRadius: 225,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -180,
    left: -120,
    width: 450,
    height: 450,
    borderRadius: 225,
  },
  themeToggle: { position: 'absolute', top: 50, left: 25 },
  toggleIcon: { fontSize: 22 },
  headerArea: { marginBottom: 60, alignItems: 'center' },
  title: { fontSize: 80, fontWeight: '100', letterSpacing: 12 }, // En ince ve en geniş hali!
  inputContainer: { borderRadius: 20, marginBottom: 15, borderWidth: 1 },
  input: { padding: 18, fontSize: 16 },
  button: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  buttonText: { fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  footerText: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
