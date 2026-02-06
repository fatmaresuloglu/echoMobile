import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Themes/ThemeContext';
import apiClient from '../api/apiClient';

export const CreatePostScreen = () => {
  const [content, setContent] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleShare = async () => {
    if (!content.trim()) return;

    try {
      // Backend'deki createPost fonksiyonuna gidiyor
      await apiClient.post('/posts/create', { content });
      Alert.alert('Başarılı', 'Gönderin paylaşıldı!');
      navigation.goBack(); // Paylaşınca otomatik ana sayfaya dön
    } catch (error) {
      Alert.alert('Hata', 'Paylaşırken bir sorun çıktı.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.primary, fontSize: 16 }}>Vazgeç</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: theme.primary }]}
          onPress={handleShare}
        >
          <Text style={styles.shareText}>Paylaş</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Neler oluyor?"
        placeholderTextColor="#888"
        multiline
        autoFocus
        onChangeText={setContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  shareBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  shareText: { color: '#fff', fontWeight: 'bold' },
  input: { fontSize: 18, textAlignVertical: 'top', height: 200 },
});
