// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { supabase } from '@/lib/supabase';
// import { useAuthStore } from '@/lib/store';
// import Toast from 'react-native-toast-message';

// export default function Login() {
//   const { setProfile } = useAuthStore();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fadeAnim] = useState(new Animated.Value(0));

//   React.useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Toast.show({
//         type: 'error',
//         text1: 'Missing Fields',
//         text2: 'Please fill in all fields',
//       });
//       return;
//     }

//     setLoading(true);
    
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email.trim().toLowerCase(),
//       password,
//     });

//     if (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: error.message,
//       });
//       setLoading(false);
//     } else {
//       // Fetch profile after login
//       if (data.user) {
//         const { data: profileData } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', data.user.id)
//           .single();
        
//         if (profileData) {
//           setProfile(profileData);
//         }
//       }

//       Toast.show({
//         type: 'success',
//         text1: 'Welcome Back! 👋',
//         text2: 'Login successful',
//       });
//       router.replace('/(tabs)');
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <Ionicons name="camera" size={48} color="#667eea" />
//             </View>
//             <Text style={styles.title}>Framez</Text>
//             <Text style={styles.subtitle}>Share your moments</Text>
//           </View>

//           <View style={styles.form}>
//             <TextInput
//               label="Email"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               mode="outlined"
//               style={styles.input}
//               disabled={loading}
//               left={<TextInput.Icon icon="email-outline" />}
//             />

//             <TextInput
//               label="Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               mode="outlined"
//               style={styles.input}
//               disabled={loading}
//               left={<TextInput.Icon icon="lock-outline" />}
//             />

//             <TouchableOpacity 
//               onPress={() => router.push('/forgot-password')}
//               style={styles.forgotPassword}
//             >
//               <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//             </TouchableOpacity>

//             <Button
//               mode="contained"
//               onPress={handleLogin}
//               loading={loading}
//               disabled={loading}
//               style={styles.button}
//               contentStyle={styles.buttonContent}
//             >
//               Login
//             </Button>

//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>OR</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <View style={styles.footer}>
//               <Text style={styles.footerText}>Don't have an account? </Text>
//               <TouchableOpacity onPress={() => router.push('/signup')}>
//                 <Text style={styles.link}>Sign up</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   content: {
//     width: '100%',
//     maxWidth: 400,
//     alignSelf: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   logoContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#f0f0ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 42,
//     fontWeight: 'bold',
//     color: '#667eea',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//   },
//   form: {
//     width: '100%',
//   },
//   input: {
//     marginBottom: 16,
//     backgroundColor: '#fff',
//   },
//   forgotPassword: {
//     alignSelf: 'flex-end',
//     marginBottom: 20,
//   },
//   forgotPasswordText: {
//     color: '#667eea',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   button: {
//     marginTop: 8,
//     backgroundColor: '#667eea',
//     borderRadius: 8,
//   },
//   buttonContent: {
//     paddingVertical: 8,
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#e0e0e0',
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     color: '#999',
//     fontSize: 14,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 8,
//   },
//   footerText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   link: {
//     color: '#667eea',
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
      });
      setLoading(false);
    } else {
      Toast.show({
        type: 'success',
        text1: 'Welcome Back! 👋',
        text2: 'Login successful',
      });
      // Auth state change will be handled by the root layout
      // Just navigate to tabs
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="camera" size={48} color="#667eea" />
            </View>
            <Text style={styles.title}>Framez</Text>
            <Text style={styles.subtitle}>Share your moments</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="email-outline" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="lock-outline" />}
            />

            <TouchableOpacity 
              onPress={() => router.push('/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Login
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 14,
  },
});