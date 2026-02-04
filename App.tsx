import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/Themes/ThemeContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const MainLayout = () => {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setIsLoggedIn(true);
      } catch (e) {
        console.log('Token hatası');
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  if (checking)
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );

  if (!isLoggedIn)
    return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    <View style={{ flex: 1 }}>
      {activeTab === 'home' ? (
        <HomeScreen
          onLogout={handleLogout}
          navigateToProfile={() => setActiveTab('profile')}
        />
      ) : (
        <ProfileScreen
          onLogout={handleLogout}
          navigateToHome={() => setActiveTab('home')}
        />
      )}
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
