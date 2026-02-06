// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  username: string;
  fullName: string;
  avatarLetter: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  bio: string;
  id: number;
}

const initialState: UserState = {
  isAuthenticated: false,
  username: "",
  fullName: "",
  avatarLetter: "",
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  bio: "",
  id: 0,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      // KRİTİK DÜZELTME: Backend'den gelen id'yi buraya yazmazsan 
      // HomeScreen'de kimlik doğrulaması yapamazsın.
      state.id = action.payload.id; 
      
      state.fullName = action.payload.fullName || "İsimsiz Kullanıcı"; 
      state.username = action.payload.username;
      
      // Avatar harfini güvenli bir şekilde alalım
      state.avatarLetter = (action.payload.fullName || "I").charAt(0).toUpperCase();
      
      // Diğer verileri de güncelleyelim (bio vb.)
      state.bio = action.payload.bio || "";
      state.postCount = action.payload.postCount || 0;
      state.followerCount = action.payload.followerCount || 0;
      state.followingCount = action.payload.followingCount || 0;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;