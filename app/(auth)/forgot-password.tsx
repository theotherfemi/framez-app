import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email address',
      });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());

    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.message,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Email Sent! 📧',
        text2: 'Check your inbox for reset instructions',
      });
      setEmailSent(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="mail-outline" size={48} color="#667eea" />
            </View>
          </View>

          {!emailSent ? (
            <>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.description}>
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Text>

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

                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Send Reset Link
                </Button>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Remember your password? </Text>
                  <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.link}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
                </View>
                <Text style={styles.successTitle}>Check Your Email</Text>
                <Text style={styles.successDescription}>
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                </Text>

                <Button
                  mode="contained"
                  onPress={() => router.push('/login')}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Back to Login
                </Button>

                <TouchableOpacity 
                  onPress={() => setEmailSent(false)}
                  style={styles.resendContainer}
                >
                  <Text style={styles.resendText}>
                    Didn't receive the email? <Text style={styles.link}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});