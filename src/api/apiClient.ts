import axios from 'axios';

// Buraya mühürlediğimiz IP'yi tek bir yerden yönetiyoruz
const MY_IP = "192.168.1.19"; 
const apiClient = axios.create({
  baseURL: `http://${MY_IP}:5000/api`,
  timeout: 10000,
});

export default apiClient;