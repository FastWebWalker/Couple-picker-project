export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          supabase_id: string;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          supabase_id: string;
          role?: "user" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          supabase_id?: string;
          role?: "user" | "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      roulettes: {
        Row: {
          id: string;
          owner_id: string | null;
          is_prebuilt: boolean;
          title: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          is_prebuilt?: boolean;
          title: string;
          description: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          is_prebuilt?: boolean;
          title?: string;
          description?: string;
          icon?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      options: {
        Row: {
          id: string;
          roulette_id: string;
          label: string;
          weight: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          roulette_id: string;
          label: string;
          weight?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          roulette_id?: string;
          label?: string;
          weight?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      proposals: {
        Row: {
          id: string;
          roulette_id: string;
          label: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          roulette_id: string;
          label: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          roulette_id?: string;
          label?: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
