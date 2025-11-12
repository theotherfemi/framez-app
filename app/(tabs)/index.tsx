import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';
import LoadingScreen from '@/components/LoadingScreen';
import { supabase, Post } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from 'expo-router';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch all posts with author profile info
  const fetchPosts = async () => {
    try {
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
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('✅ Fetched posts:', data);

      // setPosts((data ?? []) as Post[]);
      setPosts((data as unknown as Post[]) || []);
    } catch (error: any) {
      console.error('❌ Error fetching posts:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error Loading Posts',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  // ✅ Re-fetch posts whenever user navigates back to the feed
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  // ✅ Real-time updates when posts are created/updated/deleted
  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('📡 Post change detected:', payload);
          fetchPosts(); // Refresh feed on any post change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Handler for when a post is deleted from PostCard
  const handlePostDeleted = () => {
    fetchPosts();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="images-outline"
          title="No Posts Yet"
          description="Be the first to share something!"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
