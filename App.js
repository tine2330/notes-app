import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AuthScreen from "./AuthScreen";
import NotesScreen from "./NotesScreen";
import { supabase } from "./supabaseClient";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // 1. Check initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setLoading(false);
  });

  // 2. Listen for login/logout events
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log("Auth Event:", _event); // Check your terminal to see this
    setSession(session);
    setLoading(false);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return session ? <NotesScreen user={session.user} /> : <AuthScreen />;
}