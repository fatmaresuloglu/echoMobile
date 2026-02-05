import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../Themes/ThemeContext';
import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/userSlice';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen = () => {
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('test@echo.com');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // Backend'e istek atıyoruz
      const response = await apiClient.post('/users/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // 1. Token'ı yerel hafızaya kaydet
      await AsyncStorage.setItem('userToken', token);

      // 2. REDUX GÜNCELLEME
      // Backend 'name' gönderiyor, biz Redux'ta 'fullName' olarak saklıyoruz.
      // "İsimsiz Kullanıcı" yazısını burada tarihe gömüyoruz.
      dispatch(
        loginSuccess({
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.name || 'İsimsiz Kullanıcı',
          avatarLetter: user.name ? user.name.charAt(0).toUpperCase() : '?',
          bio: user.bio || '',
          postCount: 0,
          followerCount: 0,
          followingCount: 0,
        }),
      );

      // Not: Eğer App.tsx içindeki kontrol otomatik yönlendirmiyorsa:
      // navigation.navigate('Home');
    } catch (error: any) {
      console.error('Giriş Hatası Detayı:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Giriş yapılamadı.';
      Alert.alert('HATA', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: theme.background },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* ARKA PLAN EFEKTLERİ */}
        <View
          style={[
            styles.glowTop,
            {
              backgroundColor: theme.primary,
              opacity: isDarkMode ? 0.12 : 0.05,
            },
          ]}
        />
        <View
          style={[
            styles.glowBottom,
            {
              backgroundColor: theme.primary,
              opacity: isDarkMode ? 0.08 : 0.03,
            },
          ]}
        />

        {/* Tema Değiştirme */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={styles.toggleIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>

        <View style={styles.headerArea}>
          <Text style={[styles.title, { color: theme.primary }]}>ECHO</Text>
        </View>

        {/* Giriş Formu */}
        <View style={styles.formArea}>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
              },
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
                style={[
                  styles.buttonText,
                  { color: isDarkMode ? '#000' : '#fff' },
                ]}
              >
                GİRİŞ YAP
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.registerText, { color: theme.text }]}>
              Hesabın yok mu?{' '}
              <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                Kaydol
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.footerText, { color: isDarkMode ? '#333' : '#CCC' }]}
        >
          Echo v1.0 - Fatma'ya Özel
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 30, justifyContent: 'center' },
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
  title: { fontSize: 80, fontWeight: '100', letterSpacing: 12 },
  formArea: { width: '100%' },
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
  registerLink: { marginTop: 25, alignItems: 'center' },
  registerText: { fontSize: 14, opacity: 0.8 },
  footerText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
