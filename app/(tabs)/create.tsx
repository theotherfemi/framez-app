import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = () => {
    // Image picker logic will go here later
    // For now, just show a placeholder
    Alert.alert('Image Picker', 'Image picker will be implemented with functionality');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handlePost = () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert('Error', 'Please add some content or an image');
      return;
    }

    setLoading(true);
    // Post creation logic will go here later
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setSelectedImage(null);
    }, 1000);
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
          Post
        </Button>

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
    marginBottom: 24,
  },
  postButtonContent: {
    paddingVertical: 8,
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
