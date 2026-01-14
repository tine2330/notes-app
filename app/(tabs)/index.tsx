// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import AuthScreen from "../../AuthScreen";
import NotesScreen from "../../NotesScreen";
import { supabase } from "../../supabaseClient";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUser(data.session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) return <AuthScreen onSignIn={setUser} />;

  return <NotesScreen user={user} />;
}
