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

export type LessonStep = {
  id: string;
  lesson_id: string;
  step_type: string;
  title: string;
  body: string | null;
  practice_text: string | null;
  reference_text: string | null;
  sort_order: number;
  created_at: string;
};

export type PracticePrompt = {
  id: string;
  lesson_id: string | null;
  prompt_type: string;
  title: string;
  prompt_text: string;
  target_sound: string | null;
  difficulty: string;
  created_at: string;
};

export type Recording = {
  id: string;
  user_id: string;
  lesson_id: string | null;
  prompt_id: string | null;
  recording_type: "diagnostic" | "lesson" | "shadowing" | "roleplay";
  storage_path: string;
  duration_seconds: number | null;
  transcript: string | null;
  status: "uploaded" | "analysing" | "complete" | "failed";
  created_at: string;
  updated_at: string;
};

export type SpeechAnalysisResult = {
  id: string;
  recording_id: string;
  user_id: string;
  overall_score: number | null;
  pronunciation_score: number | null;
  rhythm_score: number | null;
  intonation_score: number | null;
  pace_score: number | null;
  clarity_score: number | null;
  word_feedback: Json;
  sound_feedback: Json;
  missed_words: Json;
  suggested_correction: string | null;
  ai_summary: string | null;
  one_thing_done_well: string | null;
  one_thing_to_improve: string | null;
  next_exercise: string | null;
  confidence_note: string | null;
  provider: string;
  is_mock: boolean;
  raw_provider_response: Json | null;
  created_at: string;
};

export type DiagnosticResult = {
  id: string;
  user_id: string;
  overall_score: number | null;
  pronunciation_score: number | null;
  rhythm_score: number | null;
  intonation_score: number | null;
  pace_score: number | null;
  clarity_score: number | null;
  summary: string | null;
  focus_areas: Json;
  strengths: Json;
  recommended_lessons: Json;
  practice_plan: Json;
  recording_ids: string[];
  created_at: string;
};

export type FocusAreaRow = {
  id: string;
  user_id: string;
  label: string;
  category: string;
  description: string | null;
  priority: number;
  source: string | null;
  related_lesson_slug: string | null;
  created_at: string;
  resolved_at: string | null;
};

export type RoleplaySession = {
  id: string;
  user_id: string;
  scenario_key: string;
  title: string;
  status: "active" | "complete" | "abandoned";
  summary: string | null;
  created_at: string;
  ended_at: string | null;
};

export type RoleplayMessage = {
  id: string;
  session_id: string;
  user_id: string;
  sender: "user" | "assistant" | "system";
  message_text: string | null;
  recording_id: string | null;
  audio_storage_path: string | null;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  lesson_id: string | null;
  status: "not_started" | "in_progress" | "complete";
  completion_percent: number;
  last_score: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
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
  current_challenge: string | null;
  allow_ai_processing: boolean;
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  user_id: string;
  retain_recordings_days: number;
  allow_ai_processing: boolean;
  email_reminders: boolean;
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
          current_challenge?: string | null;
          allow_ai_processing?: boolean;
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
      lesson_steps: {
        Row: LessonStep;
        Insert: Omit<LessonStep, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<LessonStep, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "lesson_steps_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      practice_prompts: {
        Row: PracticePrompt;
        Insert: Omit<PracticePrompt, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<PracticePrompt, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "practice_prompts_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      recordings: {
        Row: Recording;
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          prompt_id?: string | null;
          recording_type: Recording["recording_type"];
          storage_path: string;
          duration_seconds?: number | null;
          transcript?: string | null;
          status?: Recording["status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Recording, "id" | "user_id" | "created_at" | "updated_at">
        > & {
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recordings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recordings_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recordings_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "practice_prompts";
            referencedColumns: ["id"];
          },
        ];
      };
      speech_analysis_results: {
        Row: SpeechAnalysisResult;
        Insert: {
          id?: string;
          recording_id: string;
          user_id: string;
          overall_score?: number | null;
          pronunciation_score?: number | null;
          rhythm_score?: number | null;
          intonation_score?: number | null;
          pace_score?: number | null;
          clarity_score?: number | null;
          word_feedback?: Json;
          sound_feedback?: Json;
          missed_words?: Json;
          suggested_correction?: string | null;
          ai_summary?: string | null;
          one_thing_done_well?: string | null;
          one_thing_to_improve?: string | null;
          next_exercise?: string | null;
          confidence_note?: string | null;
          provider?: string;
          is_mock?: boolean;
          raw_provider_response?: Json | null;
          created_at?: string;
        };
        Update: Partial<
          Omit<
            SpeechAnalysisResult,
            "id" | "recording_id" | "user_id" | "created_at"
          >
        >;
        Relationships: [
          {
            foreignKeyName: "speech_analysis_results_recording_id_fkey";
            columns: ["recording_id"];
            isOneToOne: false;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "speech_analysis_results_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      diagnostic_results: {
        Row: DiagnosticResult;
        Insert: {
          id?: string;
          user_id: string;
          overall_score?: number | null;
          pronunciation_score?: number | null;
          rhythm_score?: number | null;
          intonation_score?: number | null;
          pace_score?: number | null;
          clarity_score?: number | null;
          summary?: string | null;
          focus_areas?: Json;
          strengths?: Json;
          recommended_lessons?: Json;
          practice_plan?: Json;
          recording_ids?: string[];
          created_at?: string;
        };
        Update: Partial<
          Omit<DiagnosticResult, "id" | "user_id" | "created_at">
        >;
        Relationships: [
          {
            foreignKeyName: "diagnostic_results_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_progress: {
        Row: UserProgress;
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          status?: UserProgress["status"];
          completion_percent?: number;
          last_score?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<UserProgress, "id" | "user_id" | "created_at" | "updated_at">
        > & {
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      focus_areas: {
        Row: FocusAreaRow;
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          category: string;
          description?: string | null;
          priority?: number;
          source?: string | null;
          related_lesson_slug?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<Omit<FocusAreaRow, "id" | "user_id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "focus_areas_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      roleplay_sessions: {
        Row: RoleplaySession;
        Insert: {
          id?: string;
          user_id: string;
          scenario_key: string;
          title: string;
          status?: RoleplaySession["status"];
          summary?: string | null;
          created_at?: string;
          ended_at?: string | null;
        };
        Update: Partial<Omit<RoleplaySession, "id" | "user_id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "roleplay_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      roleplay_messages: {
        Row: RoleplayMessage;
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          sender: RoleplayMessage["sender"];
          message_text?: string | null;
          recording_id?: string | null;
          audio_storage_path?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Omit<RoleplayMessage, "id" | "session_id" | "user_id" | "created_at">
        >;
        Relationships: [
          {
            foreignKeyName: "roleplay_messages_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "roleplay_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "roleplay_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "roleplay_messages_recording_id_fkey";
            columns: ["recording_id"];
            isOneToOne: false;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          },
        ];
      };
      user_settings: {
        Row: UserSettings;
        Insert: {
          user_id: string;
          retain_recordings_days?: number;
          allow_ai_processing?: boolean;
          email_reminders?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserSettings, "user_id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
