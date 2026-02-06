import React from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { logout } from './src/store/userSlice';
import { RootState, store } from './src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './src/Themes/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RegisterScreen } from './src/screens/RegisterScreen'; // 1. Kayıt ekranını import et
import { CreatePostScreen } from './src/screens/CreatePostScreen';

// 2. Navigasyon listesine Register'ı ekle (TypeScript için)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined; // Burası kritik
  Home: undefined;
  Profile: undefined;
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      dispatch(logout());
    } catch (e) {
      console.log('Logout hatası:', e);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // 3. Giriş yapmamış kullanıcılar için her iki ekranı da buraya koy
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {props => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="CreatePost"
              component={CreatePostScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
