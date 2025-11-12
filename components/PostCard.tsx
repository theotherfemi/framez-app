import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import Toast from 'react-native-toast-message';

interface PostCardProps {
  post: {
    id: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
    user_id: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
  };
  onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    checkIfLiked();
    fetchLikeCount();
  }, []);

  const checkIfLiked = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .single();
    
    setLiked(!!data);
  };

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id);
    
    setLikeCount(count || 0);
  };

  const handleLike = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    
    // Animate the heart
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (liked) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id);
      
      if (!error) {
        setLiked(false);
        setLikeCount(prev => prev - 1);
      }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: post.id, user_id: user.id });
      
      if (!error) {
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    }
    
    setLoading(false);
  };

//   const handleDeletePost = async () => {
//     if (!user || user.id !== post.user_id) return;

//     const { error } = await supabase
//       .from('posts')
//       .delete()
//       .eq('id', post.id);

//     if (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Delete Failed',
//         text2: error.message,
//       });
//     } else {
//       Toast.show({
//         type: 'success',
//         text1: 'Post Deleted',
//         text2: 'Your post has been removed',
//       });
//       onDelete?.();
//     }
//   };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.header}>
        <View style={styles.userInfo}>
          {post.profiles.avatar_url ? (
            <Avatar.Image size={40} source={{ uri: post.profiles.avatar_url }} />
          ) : (
            // <Avatar.Text 
            //   size={40} 
            //   label={post.profiles.full_name.charAt(0).toUpperCase()}
            //   style={styles.avatar}
            // />
            <Avatar.Text 
                size={40} 
                label={(post.profiles?.username?.charAt(0) || post.profiles?.username?.charAt(0) || '?').toUpperCase()}
                style={styles.avatar}
            />
          )}
          <View style={styles.userDetails}>
            {/* <Text style={styles.authorName}>{post.profiles.full_name}</Text> */}
            <Text style={styles.authorName}>
                {post.profiles?.username || post.profiles?.username || 'Unknown User'}
            </Text>
            <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
          </View>
        </View>
        {/* {user?.id === post.user_id && (
          <TouchableOpacity onPress={handleDeletePost}>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        )} */}
      </Card.Content>

      {post.content && (
        <Card.Content style={styles.contentContainer}>
          <Text style={styles.content}>{post.content}</Text>
        </Card.Content>
      )}

      {post.image_url && (
        <Image 
          source={{ uri: post.image_url }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Card.Content style={styles.actions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton} disabled={loading}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={28} 
                color={liked ? "#e74c3c" : "#000"} 
              />
            </Animated.View>
            {likeCount > 0 && (
              <Text style={styles.likeCount}>{likeCount}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={26} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={26} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={26} color="#000" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 0,
  },
  header: {
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#667eea',
  },
  userDetails: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  actions: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButton: {
    marginRight: 16,
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
});