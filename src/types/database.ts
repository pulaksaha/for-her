export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          stripe_customer_id: string | null;
          plan: "free" | "keeper" | "legacy";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          plan?: "free" | "keeper" | "legacy";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      worlds: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          cover_image_url: string | null;
          type: "couple" | "family" | "individual";
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          cover_image_url?: string | null;
          type?: "couple" | "family" | "individual";
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["worlds"]["Insert"]>;
      };
      world_members: {
        Row: {
          id: string;
          world_id: string;
          user_id: string;
          role: "owner" | "member" | "viewer";
          created_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          user_id: string;
          role?: "owner" | "member" | "viewer";
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["world_members"]["Insert"]
        >;
      };
      memories: {
        Row: {
          id: string;
          world_id: string;
          title: string;
          occurred_at: string;
          location: string | null;
          mood: string;
          caption: string | null;
          media: Json;
          story: Json | null;
          voice_note_url: string | null;
          music_track: string | null;
          is_highlight: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          title: string;
          occurred_at: string;
          location?: string | null;
          mood?: string;
          caption?: string | null;
          media?: Json;
          story?: Json | null;
          voice_note_url?: string | null;
          music_track?: string | null;
          is_highlight?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memories"]["Insert"]>;
      };
      timeline_chapters: {
        Row: {
          id: string;
          world_id: string;
          title: string;
          subtitle: string | null;
          start_date: string;
          end_date: string | null;
          memory_ids: string[];
          cover_memory_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          title: string;
          subtitle?: string | null;
          start_date: string;
          end_date?: string | null;
          memory_ids?: string[];
          cover_memory_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["timeline_chapters"]["Insert"]
        >;
      };
      anniversary_films: {
        Row: {
          id: string;
          world_id: string;
          title: string;
          status: string;
          preview_url: string | null;
          remotion_render_id: string | null;
          duration_seconds: number | null;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          title: string;
          status?: string;
          preview_url?: string | null;
          remotion_render_id?: string | null;
          duration_seconds?: number | null;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["anniversary_films"]["Insert"]
        >;
      };
      google_photos_tokens: {
        Row: {
          id: string;
          user_id: string;
          access_token: string;
          refresh_token: string | null;
          expires_at: string;
          scope: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_token: string;
          refresh_token?: string | null;
          expires_at: string;
          scope: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["google_photos_tokens"]["Insert"]
        >;
      };
      media_fingerprints: {
        Row: {
          id: string;
          world_id: string;
          user_id: string;
          google_media_item_id: string | null;
          sha256: string | null;
          memory_id: string | null;
          imported_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          user_id: string;
          google_media_item_id?: string | null;
          sha256?: string | null;
          memory_id?: string | null;
          imported_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["media_fingerprints"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
