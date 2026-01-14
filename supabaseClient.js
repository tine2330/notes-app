import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://vywoxpuvxueizgmwnwud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d294cHV2eHVlaXpnbXdud3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzI1OTYsImV4cCI6MjA4MzgwODU5Nn0.37tkGKtriSkNhBZ0xsMGkVyoZRR6ZX6rXRZzE8ZVfsA';

// This check prevents the "window is not defined" error during SSR
const isWeb = Platform.OS === 'web';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isWeb ? (typeof window !== 'undefined' ? AsyncStorage : undefined) : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});