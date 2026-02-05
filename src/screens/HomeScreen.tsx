import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux'; // Redux Hook
import { RootState } from '../store'; // Store tipin
import { useTheme } from '../Themes/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen = ({ onLogout }: HomeScreenProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // REDUX BAĞLANTISI: Kullanıcıyı çekiyoruz
  const user = useSelector((state: RootState) => state.user);

  const iconColor = theme.text;
  const activeColor = theme.primary;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ÜST BÖLÜM */}
      <View style={styles.topSection}>
        <View style={[styles.profileBar, { backgroundColor: theme.inputBg }]}>
          <View style={styles.userInfo}>
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.primary + '33' },
              ]}
            >
              <Icon name="person" size={18} color={theme.primary} />
            </View>
            <Text style={[styles.userText, { color: theme.text }]}>
              {/* Redux'tan gelen kullanıcı adı */}
              {user.fullName}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.feed}>
        <View
          style={[
            styles.postCard,
            { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
          ]}
        >
          <View style={styles.postHeader}>
            <View
              style={[styles.postAvatar, { backgroundColor: theme.primary }]}
            >
              {/* Redux'tan gelen harf */}
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {user.avatarLetter}
              </Text>
            </View>
            <View>
              <Text style={[styles.postUserName, { color: theme.text }]}>
                {user.fullName}
              </Text>
              <Text style={styles.postTime}>Şimdi</Text>
            </View>
          </View>

          <Text style={[styles.postDesc, { color: theme.text }]}>
            Bu yeni arayüz çok daha temiz oldu. Vektörel ikonlar cam gibi
            duruyor!
          </Text>

          {/* POST ETKİLEŞİM BUTONLARI */}
          <View
            style={[styles.postActions, { borderTopColor: theme.inputBorder }]}
          >
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="heart-outline" size={20} color={theme.text} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {' '}
                Beğen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="chatbubble-outline" size={18} color={theme.text} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {' '}
                Yorum
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share-social-outline" size={18} color={theme.text} />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {' '}
                Paylaş
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View
        style={[
          styles.bottomBar,
          {
            borderTopColor: theme.inputBorder,
            backgroundColor: theme.background,
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color={activeColor} />
          <Text style={[styles.navLabel, { color: activeColor }]}>Home</Text>
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

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.navItem}
        >
          <Icon name="person-outline" size={24} color={iconColor} />
          <Text style={[styles.navLabel, { color: iconColor }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  topSection: { paddingHorizontal: 20, marginBottom: 10 },
  profileBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userText: { fontSize: 14, fontWeight: '600' },
  feed: { flex: 1, paddingHorizontal: 20 },
  postCard: { borderRadius: 15, padding: 15, borderWidth: 1, marginBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postUserName: { fontWeight: 'bold', fontSize: 15 },
  postTime: { fontSize: 12, color: '#888' },
  postDesc: { fontSize: 14, marginBottom: 15, lineHeight: 20 },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingTop: 12,
    justifyContent: 'space-around',
  },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  actionText: { fontSize: 13, fontWeight: 'bold', marginLeft: 5 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    paddingBottom: 25,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
