// src/types/database.ts
export type Database = {
  public: {
    Tables: {
      farms: {
        Row: {
          id: string;
          farmer_id: string;
          name: string;
          description: string | null;
          location: {
            type: "Point";
            coordinates: [number, number]; // [longitude, latitude]
            crs: {
              type: "name";
              properties: {
                name: string;
              };
            };
          };
          address: string | null;
          contact_phone: string | null;
          images: string[] | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          name: string;
          description?: string | null;
          location: unknown; // Używamy PostGIS geometry
          address?: string | null;
          contact_phone?: string | null;
          images?: string[] | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          name?: string;
          description?: string | null;
          location?: unknown;
          address?: string | null;
          contact_phone?: string | null;
          images?: string[] | null;
          is_verified?: boolean;
          updated_at?: string;
        };
      };

      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "farmer" | "customer" | "collector";
          bio: string | null;
          phone: string | null;
          address: {
            street?: string;
            city?: string;
            zip?: string;
            country?: string;
          } | null;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "farmer" | "customer" | "collector";
          bio?: string | null;
          phone?: string | null;
          address?: {
            street?: string;
            city?: string;
            zip?: string;
            country?: string;
          } | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "farmer" | "customer" | "collector";
          bio?: string | null;
          phone?: string | null;
          address?: {
            street?: string;
            city?: string;
            zip?: string;
            country?: string;
          } | null;
          rating?: number;
          review_count?: number;
          updated_at?: string;
        };
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
