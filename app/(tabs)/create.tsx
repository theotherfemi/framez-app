import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
// import * as FileSystem from 'expo-file-system';

export default function CreatePost() {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Toast.show({
          type: 'success',
          text1: 'Image Selected',
          text2: 'Ready to post!',
        });
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Image Selection Failed',
        text2: error.message,
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    Toast.show({
      type: 'info',
      text1: 'Image Removed',
    });
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
        console.log('🖼️ Uploading image from:', uri);

        const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user!.id}/${fileName}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            upsert: false,
        });

        if (error) {
        console.error('❌ Upload error:', error);
        throw error;
        }

        const { data: publicData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

        console.log('✅ Public URL:', publicData.publicUrl);
        return publicData.publicUrl;
    } catch (error: any) {
        console.error('❌ Upload failed:', error);
        Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.message || 'Could not upload image',
        });
        return null;
    }
  };

  const handlePost = async () => {
    console.log('📝 Starting post creation...');
    console.log('User:', user?.id);
    console.log('Content:', content);
    console.log('Image:', selectedImage);

    if (!content.trim() && !selectedImage) {
      Toast.show({
        type: 'error',
        text1: 'Empty Post',
        text2: 'Please add some content or an image',
      });
      return;
    }

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Not Authenticated',
        text2: 'Please log in to create a post',
      });
      router.replace('/login');
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if selected
      if (selectedImage) {
        console.log('📤 Uploading image...');
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) {
          console.error('❌ Image upload returned null');
          setLoading(false);
          return;
        }
        console.log('✅ Image uploaded:', imageUrl);
      }

      // Create post
      console.log('💾 Creating post in database...');
      const { error, data } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim() || null,
          image_url: imageUrl,
        })
        .select();

      if (error) {
        console.error('❌ Post creation error:', error);
        throw error;
      }

      console.log('✅ Post created:', data);

      Toast.show({
        type: 'success',
        text1: 'Post Created! 🎉',
        text2: 'Your post has been shared',
      });

      // Reset form
      setContent('');
      setSelectedImage(null);

      // Navigate to feed
      setTimeout(() => {
        router.push('/(tabs)');
      }, 500);
    } catch (error: any) {
      console.error('❌ Post creation failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Post Failed',
        text2: error.message || 'Could not create post',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="create-outline" size={32} color="#667eea" />
        <Text style={styles.headerTitle}>Create a New Post</Text>
        <Text style={styles.headerSubtitle}>Share your moment with the world</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="What's on your mind?"
          value={content}
          onChangeText={setContent}
          mode="outlined"
          multiline
          numberOfLines={6}
          style={styles.textInput}
          disabled={loading}
          placeholder="Share your thoughts..."
        />

        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={handleRemoveImage}
              disabled={loading}
            >
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.imagePickerButton}
            onPress={handlePickImage}
            disabled={loading}
          >
            <Ionicons name="image-outline" size={48} color="#667eea" />
            <Text style={styles.imagePickerText}>Add Photo</Text>
            <Text style={styles.imagePickerSubtext}>Tap to select from gallery</Text>
          </TouchableOpacity>
        )}

        <Button
          mode="contained"
          onPress={handlePost}
          loading={loading}
          disabled={loading}
          style={styles.postButton}
          contentStyle={styles.postButtonContent}
          icon="send"
        >
          {loading ? 'Posting...' : 'Post'}
        </Button>

        {loading && (
          <Text style={styles.loadingText}>
            {selectedImage ? 'Uploading image and creating post...' : 'Creating post...'}
          </Text>
        )}

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📝 Tips for great posts:</Text>
          <Text style={styles.tipItem}>• Add engaging captions</Text>
          <Text style={styles.tipItem}>• Use high-quality images</Text>
          <Text style={styles.tipItem}>• Be authentic and creative</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: '#fff',
    minHeight: 150,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9ff',
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginTop: 12,
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  postButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    marginBottom: 12,
  },
  postButtonContent: {
    paddingVertical: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#667eea',
    fontSize: 14,
    marginBottom: 12,
  },
  tipsContainer: {
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
});