import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../Themes/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import apiClient from '../api/apiClient';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  CreatePost: undefined;
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
  const isFocused = useIsFocused();
  const user = useSelector((state: RootState) => state.user);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const iconColor = theme.text;
  const activeColor = theme.primary;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/posts');
      setPosts(response.data);
    } catch (error: any) {
      console.log('Postlar yüklenemedi:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    // DOBRA NOT: Bu log terminalde görünmüyorsa dokunma ulaşmıyordur.
    console.log('!!! SİLME TETİKLENDİ !!! ID:', postId);

    // Menüyü hemen kapatmıyoruz, Alert onayından sonra kapatacağız
    // veya basıldığı an kapatmak istiyorsan bile onPress içinde yapmalısın.

    Alert.alert('Gönderiyi Sil', 'Bu gönderiyi silmek istediğine emin misin?', [
      { text: 'Vazgeç', style: 'cancel', onPress: () => setActiveMenuId(null) },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          setActiveMenuId(null);
          try {
            const response = await apiClient.delete(`/posts/${postId}`);

            if (response.status === 200 || response.status === 204) {
              setPosts(currentPosts =>
                currentPosts.filter(post => post.id !== postId),
              );
              Alert.alert('Başarılı', 'Gönderi silindi.');
            }
          } catch (error: any) {
            console.error('Silme Hatası Detayı:', error.response?.data);
            Alert.alert(
              'Hata',
              error.response?.data?.error || 'Post silinemedi.',
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused]);

  const handleLike = async (postId: number) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          const isLikedNow = !post.isLiked;
          return {
            ...post,
            isLiked: isLikedNow,
            likeCount: isLikedNow
              ? (post.likeCount || 0) + 1
              : (post.likeCount || 0) - 1,
          };
        }
        return post;
      }),
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Menüyü kapatmak için boş alana dokunma desteği (onTouchStart yerine bu daha güvenli) */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setActiveMenuId(null)}
        pointerEvents={activeMenuId ? 'auto' : 'none'}
      />

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
              {user.fullName}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.feed}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 20 }}
          />
        ) : posts.length === 0 ? (
          <Text
            style={{ color: theme.text, textAlign: 'center', marginTop: 50 }}
          >
            Henüz hiç gönderi yok. 🚀
          </Text>
        ) : (
          posts.map(post => (
            <View
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
            >
              <View style={styles.postHeader}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.postAvatar,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      {(post.author?.fullName || 'E').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.postUserName, { color: theme.text }]}>
                      {post.author?.fullName || 'Kullanıcı'}
                    </Text>
                    <Text style={styles.postTime}>
                      {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </View>

                {post.authorId === Number(user.id) && (
                  <View style={{ zIndex: 10 }}>
                    <TouchableOpacity
                      onPress={() =>
                        setActiveMenuId(
                          activeMenuId === post.id ? null : post.id,
                        )
                      }
                      style={{ padding: 10 }}
                    >
                      <Icon
                        name="ellipsis-vertical"
                        size={20}
                        color={theme.text}
                      />
                    </TouchableOpacity>

                    {activeMenuId === post.id && (
                      <View
                        style={[
                          styles.dropdownMenu,
                          {
                            backgroundColor: theme.inputBg,
                            borderColor: theme.inputBorder,
                          },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            Alert.alert('Düzenle', 'Yakında!');
                            setActiveMenuId(null);
                          }}
                        >
                          <Icon
                            name="create-outline"
                            size={18}
                            color={theme.text}
                          />
                          <Text style={{ color: theme.text, marginLeft: 10 }}>
                            Düzenle
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.menuItem,
                            {
                              borderTopWidth: 0.5,
                              borderTopColor: theme.inputBorder,
                            },
                          ]}
                          onPress={() => handleDelete(post.id)}
                        >
                          <Icon
                            name="trash-outline"
                            size={18}
                            color="#e74c3c"
                          />
                          <Text style={{ color: '#e74c3c', marginLeft: 10 }}>
                            Sil
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <Text style={[styles.postDesc, { color: theme.text }]}>
                {post.content}
              </Text>

              <View
                style={[
                  styles.postActions,
                  { borderTopColor: theme.inputBorder },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <Icon
                    name={post.isLiked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={post.isLiked ? '#e74c3c' : theme.text}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: post.isLiked ? '#e74c3c' : theme.text },
                    ]}
                  >
                    {post.likeCount || 0} Beğeni
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon
                    name="chatbubble-outline"
                    size={18}
                    color={theme.text}
                  />
                  <Text style={[styles.actionText, { color: theme.text }]}>
                    Yorum
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
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
  postCard: {
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    marginBottom: 20,
    zIndex: 1,
  },
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
  dropdownMenu: {
    position: 'absolute',
    right: 10,
    top: 45,
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 15,
    zIndex: 9999,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
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
    elevation: 5,
  },
});
