export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  native_language: string | null;
  target_goal: string | null;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  skill_focus: string;
  difficulty: string;
  estimated_minutes: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type OnboardingResponse = {
  id: string;
  user_id: string;
  native_language: string | null;
  current_level: string | null;
  primary_goal: string | null;
  profession: string | null;
  speaking_confidence: number | null;
  target_situations: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">> & {
          updated_at?: string;
        };
        Relationships: [];
      };
      onboarding_responses: {
        Row: OnboardingResponse;
        Insert: {
          id?: string;
          user_id: string;
          native_language?: string | null;
          current_level?: string | null;
          primary_goal?: string | null;
          profession?: string | null;
          speaking_confidence?: number | null;
          target_situations?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<OnboardingResponse, "id" | "user_id" | "created_at">
        >;
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Lesson, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
