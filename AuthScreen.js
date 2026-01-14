import React, { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "./supabaseClient";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Login Error", error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert("Signup Error", error.message);
    } else {
      setIsSignedUp(true); // Show the confirmation message
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>✍️ NoteFlow</Text>
        <Text style={styles.subtitle}>Simplify your thoughts.</Text>

        {isSignedUp ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📬 <Text style={{fontWeight: 'bold'}}>Check your inbox!</Text>{"\n\n"}
              To complete your registration, please click the confirmation link sent to <Text style={{fontStyle: 'italic'}}>{email}</Text>.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => setIsSignedUp(false)}>
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />

            {loading ? (
              <ActivityIndicator color="#6366f1" style={{ marginVertical: 20 }} />
            ) : (
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSignIn}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp}>
                  <Text style={styles.secondaryButtonText}>Create an account</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 32, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  logo: { fontSize: 32, fontWeight: "800", textAlign: "center", color: "#1E293B", letterSpacing: -1 },
  subtitle: { fontSize: 16, color: "#64748B", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "#F1F5F9", borderRadius: 12, padding: 16, marginBottom: 15, fontSize: 16, color: "#1E293B" },
  buttonGroup: { marginTop: 10 },
  button: { backgroundColor: "#6366f1", borderRadius: 12, padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryButton: { marginTop: 15, alignItems: "center" },
  secondaryButtonText: { color: "#6366f1", fontSize: 14, fontWeight: "500" },
  infoBox: { backgroundColor: "#EEF2FF", padding: 20, borderRadius: 12, marginBottom: 20 },
  infoText: { color: "#4338CA", fontSize: 15, lineHeight: 22, textAlign: "center" }
});