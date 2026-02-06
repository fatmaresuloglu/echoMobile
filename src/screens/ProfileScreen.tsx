import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginSuccess } from '../store/userSlice';
import { useTheme } from '../Themes/ThemeContext';
import apiClient from '../api/apiClient';
import Icon from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen = ({ onLogout }: ProfileScreenProps) => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();

  // REDUX: Bilgileri çekiyoruz
  const user = useSelector((state: RootState) => state.user);

  // --- MODAL & FORM STATES ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user.fullName || '');
  const [newBio, setNewBio] = useState(user.bio || '');
  const [updateLoading, setUpdateLoading] = useState(false);

  const iconColor = theme.text;
  const activeColor = theme.primary;

  // --- PROFİL GÜNCELLEME FONKSİYONU ---
  const handleSaveProfile = async () => {
    if (!newName.trim()) {
      Alert.alert('Uyarı', 'İsim alanı boş bırakılamaz.');
      return;
    }

    setUpdateLoading(true);
    try {
      const response = await apiClient.put('/users/update', {
        name: newName,
        bio: newBio,
      });

      // Redux'ı güncelle (İsimsiz kullanıcıyı yok ediyoruz)
      dispatch(
        loginSuccess({
          ...user,
          fullName: response.data.user.name,
          bio: response.data.user.bio,
          avatarLetter: response.data.user.name.charAt(0).toUpperCase(),
        }),
      );

      setModalVisible(false);
      Alert.alert('Başarılı', 'Profilin güncellendi.');
    } catch (error: any) {
      console.error('GÜNCELLEME HATASI:', error.response?.data);
      Alert.alert('HATA', 'Profil güncellenirken bir sorun oluştu.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 1. ÜST AKSİYON SATIRI */}
      <View style={styles.topActionRow}>
        <TouchableOpacity onPress={onLogout} style={styles.exitButtonTop}>
          <Icon name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={styles.exitText}> Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. PROFİL BİLGİLERİ */}
        <View style={styles.header}>
          <View
            style={[styles.avatarLarge, { backgroundColor: theme.primary }]}
          >
            <Text
              style={[
                styles.avatarLetter,
                { color: isDarkMode ? '#000' : '#fff' },
              ]}
            >
              {user.avatarLetter || '?'}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {user.postCount}
              </Text>
              <Text style={styles.statLabel}>Gönderi</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {user.followerCount}
              </Text>
              <Text style={styles.statLabel}>Takipçi</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {user.followingCount}
              </Text>
              <Text style={styles.statLabel}>Takip</Text>
            </View>
          </View>
        </View>

        {/* 3. KULLANICI BİLGİSİ */}
        <View style={styles.bioSection}>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user.fullName || 'İsimsiz Kullanıcı'}
          </Text>
          <Text style={[styles.userBio, { color: theme.text }]}>
            {user.bio || 'Henüz bir biyografi eklenmedi.'}
          </Text>

          <TouchableOpacity
            style={[styles.editButton, { borderColor: theme.inputBorder }]}
            onPress={() => {
              setNewName(user.fullName);
              setNewBio(user.bio);
              setModalVisible(true);
            }}
          >
            <Text style={[styles.editButtonText, { color: theme.text }]}>
              Profili Düzenle
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. GÖNDERİLER (GRID) */}
        <View style={styles.gridContainer}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <View
              key={item}
              style={[
                styles.gridItem,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
            >
              <Icon name="image-outline" size={24} color={theme.inputBorder} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- EDİT PROFİL MODAL --- */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Profili Düzenle
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  color: theme.text,
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.inputBg,
                },
              ]}
              placeholder="Ad Soyad"
              placeholderTextColor="#666"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={[
                styles.modalInput,
                {
                  color: theme.text,
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.inputBg,
                  height: 100,
                },
              ]}
              placeholder="Biyografi"
              placeholderTextColor="#666"
              value={newBio}
              onChangeText={setNewBio}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  Vazgeç
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={updateLoading}
                style={[
                  styles.modalSaveBtn,
                  { backgroundColor: theme.primary },
                ]}
              >
                {updateLoading ? (
                  <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
                ) : (
                  <Text
                    style={{
                      color: isDarkMode ? '#000' : '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    Kaydet
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 5. BOTTOM BAR */}
      <View
        style={[
          styles.bottomBar,
          {
            borderTopColor: theme.inputBorder,
            backgroundColor: theme.background,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home-outline" size={24} color={iconColor} />
          <Text style={[styles.navLabel, { color: iconColor }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="search-outline" size={24} color={iconColor} />
          <Text style={[styles.navLabel, { color: iconColor }]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="list-outline" size={24} color={iconColor} />
          <Text style={[styles.navLabel, { color: iconColor }]}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color={activeColor} />
          <Text style={[styles.navLabel, { color: activeColor }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  topActionRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  exitButtonTop: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  exitText: { color: '#e74c3c', fontSize: 14, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 32, fontWeight: 'bold' },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 10,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#888' },
  bioSection: { paddingHorizontal: 20, marginBottom: 20 },
  userName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  userBio: { fontSize: 14, lineHeight: 20, marginBottom: 15 },
  editButton: {
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: { fontSize: 14, fontWeight: '600' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 2 },
  gridItem: {
    width: width / 3 - 4,
    height: width / 3 - 4,
    margin: 2,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    paddingBottom: 25,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navLabel: { fontSize: 10, fontWeight: '600', marginTop: 4 },
  addButton: {
    backgroundColor: '#3498db',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: { borderRadius: 25, padding: 25, elevation: 5 },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalCancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  modalSaveBtn: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 10,
  },
});
