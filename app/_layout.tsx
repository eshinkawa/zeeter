import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import { supabase } from "../lib/supabase";

const RootLayout = () => {
  const router = useRouter();
  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      router.push("tweets");
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
