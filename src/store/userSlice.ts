// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean; // Giriş kontrolü buraya geldi
  username: string;
  fullName: string;
  avatarLetter: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  bio: string;
}

const initialState: UserState = {
  isAuthenticated: false, // Başlangıçta giriş yapmamış
  username: "",
  fullName: "",
  avatarLetter: "",
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  bio: "",
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Giriş başarılı olduğunda çağıracağız
    loginSuccess: (state, action: PayloadAction<any>) => {
  state.isAuthenticated = true;
  // action.payload.fullName: Backend'den gelen gerçek isim
  // Eğer backend'den gelen veri boşsa yedek olarak "İsimsiz" koyarız
  state.fullName = action.payload.fullName || "İsimsiz Kullanıcı"; 
  state.username = action.payload.username;
  state.avatarLetter = state.fullName.charAt(0).toUpperCase();
},
    // Çıkış yapıldığında her şeyi sıfırla
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;