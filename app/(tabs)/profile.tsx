import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { supabase, Post, Profile } from '@/lib/supabase';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';
import LoadingScreen from '@/components/LoadingScreen';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // ✅ Safely cast with fallback values
      const safeProfile: Profile = {
        id: data.id,
        email: data.email ?? '',
        full_name: data.full_name ?? '',
        avatar_url: data.avatar_url ?? null,
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: data.updated_at ?? new Date().toISOString(),
        username: ''
      };

      setProfile(safeProfile);
    } catch (error: any) {
      console.error('❌ Error fetching profile:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Profile Error',
        text2: error.message,
      });
      setProfile(null);
    }
  };

  // ✅ Fetch posts for current user
  const fetchUserPosts = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          created_at,
          user_id,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            email,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts((data as unknown as Post[]) || []);
    } catch (error: any) {
      console.error('❌ Error fetching posts:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Post Error',
        text2: error.message,
      });
    }
  };

  // ✅ Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchUserPosts()]);
      setLoading(false);
    };
    load();
  }, []);

  // ✅ Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchUserPosts()]);
    setRefreshing(false);
  }, []);

  const handlePostDeleted = async () => {
    await fetchUserPosts();
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {/* ✅ Profile Header */}
      {profile ? (
        <View style={styles.profileHeader}>
          {profile.avatar_url ? (
            <View style={styles.avatarWrapper}>
              <img
                src={profile.avatar_url}
                alt="avatar"
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            </View>
          ) : (
            <View style={[styles.avatarWrapper, styles.emptyAvatar]} />
          )}
          <Text style={styles.name}>{profile.full_name || 'No Name'}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No profile data found.</Text>
      )}

      {/* ✅ Posts List */}
      {posts.length === 0 ? (
        <EmptyState
          icon="images-outline"
          title="No Posts Yet"
          description="You haven't shared anything yet."
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item as Post & { profiles: NonNullable<Post['profiles']> }}
              onDelete={handlePostDeleted}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#667eea']}
              tintColor="#667eea"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  emptyAvatar: {
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  postsList: {
    paddingBottom: 60,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});
