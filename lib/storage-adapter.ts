import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Fallback in-memory storage for when SecureStore isn't available
class MemoryStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

const memoryStorage = new MemoryStorage();

// Hybrid storage that tries SecureStore first, falls back to memory
export const hybridStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      // Try SecureStore first (works in production builds)
      if (Platform.OS !== 'web') {
        const item = await SecureStore.getItemAsync(key);
        return item;
      }
      // Fall back to memory storage
      return await memoryStorage.getItem(key);
    } catch (error) {
      // If SecureStore fails (like in Expo Go), use memory storage
      console.log('SecureStore not available, using memory storage');
      return await memoryStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      // Try SecureStore first
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value);
        // Also save to memory as backup
        await memoryStorage.setItem(key, value);
        return;
      }
      // Fall back to memory storage
      await memoryStorage.setItem(key, value);
    } catch (error) {
      // If SecureStore fails, use memory storage
      console.log('SecureStore not available, using memory storage');
      await memoryStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      // Try SecureStore first
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
        await memoryStorage.removeItem(key);
        return;
      }
      // Fall back to memory storage
      await memoryStorage.removeItem(key);
    } catch (error) {
      // If SecureStore fails, use memory storage
      console.log('SecureStore not available, using memory storage');
      await memoryStorage.removeItem(key);
    }
  },
};