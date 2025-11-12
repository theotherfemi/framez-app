import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const { session } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Give the auth state a moment to initialize from the root layout
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  console.log('📍 Index - Session exists:', !!session);

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}