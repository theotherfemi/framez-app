import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface PostCardProps {
  authorName: string;
  authorAvatar?: string;
  content?: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  onLikePress: () => void;
}

export default function PostCard({ 
  authorName, 
  authorAvatar,
  content, 
  imageUrl, 
  timestamp, 
  likes,
  isLiked,
  onLikePress 
}: PostCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.header}>
        <View style={styles.userInfo}>
          {authorAvatar ? (
            <Avatar.Image size={40} source={{ uri: authorAvatar }} />
          ) : (
            <Avatar.Text 
              size={40} 
              label={authorName.charAt(0).toUpperCase()}
              style={styles.avatar}
            />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </Card.Content>

      {content && (
        <Card.Content style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </Card.Content>
      )}

      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Card.Content style={styles.actions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={isLiked ? "#e74c3c" : "#000"} 
            />
            {likes > 0 && (
              <Text style={styles.likeCount}>{likes}</Text>
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