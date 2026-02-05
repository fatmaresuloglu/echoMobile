import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../Themes/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
// DİKKAT: RootStackParamList sadece App.tsx'den gelmeli!
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

// Navigasyon tipi tanımlama
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen = ({ onLogout }: ProfileScreenProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // REDUX: Bilgileri merkezi depodan çekiyoruz
  const user = useSelector((state: RootState) => state.user);

  const iconColor = theme.text;
  const activeColor = theme.primary;

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
            <Text style={styles.avatarLetter}>{user.avatarLetter || '?'}</Text>
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
            onPress={() => console.log('Düzenleme ekranına git')}
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
  avatarLetter: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
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
});
