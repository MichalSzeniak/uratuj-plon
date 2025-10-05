// src/lib/supabase.ts - DODAJMY TEST POŁĄCZENIA
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔑 Supabase config check:", {
  url: supabaseUrl ? "✅ Set" : "❌ Missing",
  key: supabaseAnonKey ? "✅ Set" : "❌ Missing",
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test połączenia
supabase
  .from("farms")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    console.log(
      "🧪 Supabase connection test - farms count:",
      count,
      "error:",
      error
    );
  })
  .catch((err) => {
    console.error("🧪 Supabase connection test failed:", err);
  });
