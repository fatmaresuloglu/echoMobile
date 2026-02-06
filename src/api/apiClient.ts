import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MY_IP = "192.168.1.19"; 

const apiClient = axios.create({
  baseURL: `http://${MY_IP}:5000/api`,
  timeout: 10000,
});

// --- ASIL SİHİR BURADA: REQUEST INTERCEPTOR ---
// Her istek atılmadan hemen önce bu fonksiyon çalışır
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Telefona kaydettiğimiz token'ı çekiyoruz
      const token = await AsyncStorage.getItem('userToken');
      
      if (token) {
        // Eğer token varsa, isteğin başına (Header) ekliyoruz
        // Artık backend'deki authMiddleware bu "Bearer" kartını görecek
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token alınırken hata oluştu:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;