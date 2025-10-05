// src/components/TestMap.tsx - TYMCZASOWY KOMPONENT TESTUJĄCY
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function TestMap() {
  useEffect(() => {
    const testConnection = async () => {
      console.log("🧪 Starting connection test...");

      // Test 1: Proste zapytanie do farms
      const { data: farms, error: farmsError } = await supabase
        .from("farms")
        .select("*")
        .limit(2);

      console.log("Test 1 - Farms:", farms, "Error:", farmsError);

      // Test 2: Zapytanie z joinem
      const { data: farmsWithProfiles, error: joinError } = await supabase
        .from("farms")
        .select(
          `
          *,
          profiles:farmer_id (
            username,
            full_name
          )
        `
        )
        .limit(2);

      console.log(
        "Test 2 - Farms with profiles:",
        farmsWithProfiles,
        "Error:",
        joinError
      );

      // Test 3: Sprawdź RLS
      const { data: policies, error: policiesError } = await supabase.rpc(
        "get_policies_info"
      ); // Ta funkcja może nie istnieć, to tylko test

      console.log(
        "Test 3 - Policies check:",
        policies,
        "Error:",
        policiesError
      );
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="font-bold">🧪 Test Component</h3>
      <p>Sprawdź konsolę przeglądarki dla wyników testów</p>
    </div>
  );
}
