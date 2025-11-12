import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';

// Mock data for UI
const mockPosts = [
  {
    id: '1',
    authorName: 'John Doe',
    content: 'Beautiful sunset today! 🌅',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    timestamp: '2h ago',
    likes: 24,
    isLiked: false,
  },
  {
    id: '2',
    authorName: 'Jane Smith',
    content: 'Coffee time ☕',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
    timestamp: '5h ago',
    likes: 15,
    isLiked: true,
  },
  {
    id: '3',
    authorName: 'Mike Johnson',
    content: 'Just finished an amazing workout! Feeling pumped 💪',
    timestamp: '1d ago',
    likes: 42,
    isLiked: false,
  },
];

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState 
          icon="images-outline"
          title="No Posts Yet"
          description="Start following people to see their posts in your feed"
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
            authorName={item.authorName}
            content={item.content}
            imageUrl={item.imageUrl}
            timestamp={item.timestamp}
            likes={item.likes}
            isLiked={item.isLiked}
            onLikePress={() => handleLike(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
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