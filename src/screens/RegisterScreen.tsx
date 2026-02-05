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
} from 'react-native';
import { useTheme } from '../Themes/ThemeContext';
import apiClient from '../api/apiClient';
import { useNavigation } from '@react-navigation/native';

export const RegisterScreen = () => {
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password) {
      Alert.alert('HATA', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('HATA', 'Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/users/register', {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      Alert.alert('BAŞARILI', 'Hesabınız oluşturuldu!', [
        { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || 'Sunucuya bağlanılamadı.';
      Alert.alert('HATA', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ARKA PLAN IŞILTILARI (Giriş sayfasıyla aynı) */}
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

      {/* Tema Butonu */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={styles.toggleIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>

      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: theme.primary }]}>ECHO</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>YENİ HESAP</Text>
      </View>

      {/* İnput Alanları */}
      {[
        { label: 'Ad Soyad', key: 'fullName', secure: false },
        { label: 'Kullanıcı Adı', key: 'username', secure: false },
        { label: 'Email', key: 'email', secure: false, type: 'email-address' },
        { label: 'Şifre', key: 'password', secure: true },
        { label: 'Şifre Tekrar', key: 'confirmPassword', secure: true },
      ].map(input => (
        <View
          key={input.key}
          style={[
            styles.inputContainer,
            { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={input.label}
            placeholderTextColor="#666"
            secureTextEntry={input.secure}
            autoCapitalize="none"
            onChangeText={val => setForm({ ...form, [input.key]: val })}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
        ) : (
          <Text
            style={[styles.buttonText, { color: isDarkMode ? '#000' : '#fff' }]}
          >
            KAYDOL
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
          Zaten hesabın var mı? Giriş Yap
        </Text>
      </TouchableOpacity>

      <Text
        style={[styles.footerText, { color: isDarkMode ? '#333' : '#CCC' }]}
      >
        Echo v1.0 - Fatma'ya Özel
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, justifyContent: 'center' },
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
  headerArea: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 80, fontWeight: '100', letterSpacing: 12 },
  subtitle: { fontSize: 14, letterSpacing: 4, marginTop: -10, opacity: 0.7 },
  inputContainer: { borderRadius: 20, marginBottom: 12, borderWidth: 1 },
  input: { padding: 18, fontSize: 16 },
  button: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  buttonText: { fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  linkButton: { marginTop: 25, alignItems: 'center' },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
