// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { PaperProvider } from 'react-native-paper';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import Toast from 'react-native-toast-message';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <PaperProvider>
//       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="index" />
//           <Stack.Screen name="login" />
//           <Stack.Screen name="signup" />
//           <Stack.Screen name="forgot-password" />
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         </Stack>
//         <StatusBar style="auto" />
//         <Toast />
//       </ThemeProvider>
//     </PaperProvider>
//   );
// }

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setSession, setProfile } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🟢 Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🟡 Auth state changed:', _event, session?.user?.id);
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('❌ Profile fetch error:', error);
        return;
      }

      if (data) {
        console.log('✅ Profile fetched:', data.full_name);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Profile fetch exception:', error);
    }
  };

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
    </PaperProvider>
  );
}