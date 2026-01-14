import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "./supabaseClient";

export default function NotesScreen({ user }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    const { data } = await supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setNotes(data || []);
  };

  const handleSave = async () => {
    if (!title) return;
    if (editingId) {
      await supabase.from("notes").update({ title, content }).eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase.from("notes").insert([{ title, content, user_id: user.id }]);
    }
    setTitle(""); setContent(""); fetchNotes();
  };

  const deleteNote = async (id) => {
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes();
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Notes</Text>
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <TextInput 
            placeholder="Title" 
            value={title} 
            onChangeText={setTitle} 
            style={styles.titleInput} 
          />
          <TextInput 
            placeholder="Write something..." 
            value={content} 
            onChangeText={setContent} 
            style={styles.contentInput} 
            multiline 
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{editingId ? "Update Note" : "Add Note"}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteText} numberOfLines={3}>{item.content}</Text>
              </View>
              <View style={styles.noteActions}>
                <TouchableOpacity onPress={() => { setTitle(item.title); setContent(item.content); setEditingId(item.id); }}>
                  <Text style={styles.editBtn}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 20 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  logoutText: { color: "#EF4444", fontWeight: "600" },
  inputCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 },
  titleInput: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#1E293B" },
  contentInput: { fontSize: 16, color: "#64748B", minHeight: 60, textAlignVertical: 'top' },
  saveButton: { backgroundColor: "#6366f1", borderRadius: 12, padding: 14, marginTop: 15, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  noteCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: "#6366f1" },
  noteTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 6 },
  noteText: { fontSize: 15, color: "#64748B", lineHeight: 22 },
  noteActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 15, borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 10 },
  editBtn: { color: "#6366f1", fontWeight: "600", marginRight: 20 },
  deleteBtn: { color: "#EF4444", fontWeight: "600" }
});