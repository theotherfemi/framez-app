import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Avatar, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import EmptyState from '@/components/EmptyState';

// Mock user data
const mockUser = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null,
  postsCount: 12,
  followersCount: 248,
  followingCount: 180,
};

// Mock user posts
const mockUserPosts = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400' },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400' },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
];

export default function Profile() {
  const [user] = useState(mockUser);
  const [posts] = useState(mockUserPosts);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Logout logic will go here later
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be implemented with functionality');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Avatar.Image size={100} source={{ uri: user.avatar }} />
          ) : (
            <Avatar.Text 
              size={100} 
              label={user.fullName.charAt(0).toUpperCase()}
              style={styles.avatar}
            />
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon="pencil"
          >
            Edit Profile
          </Button>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#e74c3c"
            icon="logout"
          >
            Logout
          </Button>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Posts Grid */}
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>My Posts</Text>
        
        {posts.length === 0 ? (
          <EmptyState 
            icon="images-outline"
            title="No Posts Yet"
            description="Start sharing your moments by creating your first post"
          />
        ) : (
          <View style={styles.postsGrid}>
            {posts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postItem}>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <View style={styles.postOverlay}>
                  <Ionicons name="heart" size={20} color="#fff" />
                  <Text style={styles.postOverlayText}>24</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#667eea',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f8f9ff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
    marginHorizontal: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  logoutButton: {
    flex: 1,
    borderColor: '#e74c3c',
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  postsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postItem: {
    width: '32.5%',
    aspectRatio: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0,
  },
  postOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});