export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_call_log: {
        Row: {
          created_at: string
          function_name: string
          id: string
          model_version: string
          prompt_hash: string
          response_summary: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          function_name: string
          id?: string
          model_version: string
          prompt_hash: string
          response_summary?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          function_name?: string
          id?: string
          model_version?: string
          prompt_hash?: string
          response_summary?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_call_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sessions: {
        Row: {
          candidate_id: string
          completed_at: string | null
          discipline_id: string
          id: string
          started_at: string
          status: string
        }
        Insert: {
          candidate_id: string
          completed_at?: string | null
          discipline_id: string
          id?: string
          started_at?: string
          status?: string
        }
        Update: {
          candidate_id?: string
          completed_at?: string | null
          discipline_id?: string
          id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_sessions_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      discipline_requests: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          requested_by: string
          requested_name: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          requested_by: string
          requested_name: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          requested_by?: string
          requested_name?: string
          status?: string
        }
        Relationships: []
      }
      discipline_skill_weights: {
        Row: {
          discipline_id: string
          id: string
          question_count: number
          skill_domain_id: string
          weight_pct: number
        }
        Insert: {
          discipline_id: string
          id?: string
          question_count: number
          skill_domain_id: string
          weight_pct: number
        }
        Update: {
          discipline_id?: string
          id?: string
          question_count?: number
          skill_domain_id?: string
          weight_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "discipline_skill_weights_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipline_skill_weights_skill_domain_id_fkey"
            columns: ["skill_domain_id"]
            isOneToOne: false
            referencedRelation: "skill_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplines: {
        Row: {
          created_at: string
          id: string
          name: string
          program_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          program_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          program_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "disciplines_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          base_text: string
          created_at: string
          difficulty: string | null
          id: string
          options_json: Json | null
          rubric_json: Json | null
          scoring_key_json: Json | null
          skill_domain_id: string
          status: string
          type: string
        }
        Insert: {
          base_text: string
          created_at?: string
          difficulty?: string | null
          id?: string
          options_json?: Json | null
          rubric_json?: Json | null
          scoring_key_json?: Json | null
          skill_domain_id: string
          status?: string
          type: string
        }
        Update: {
          base_text?: string
          created_at?: string
          difficulty?: string | null
          id?: string
          options_json?: Json | null
          rubric_json?: Json | null
          scoring_key_json?: Json | null
          skill_domain_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_skill_domain_id_fkey"
            columns: ["skill_domain_id"]
            isOneToOne: false
            referencedRelation: "skill_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          domain_scores_json: Json | null
          generated_at: string | null
          growth_areas_json: Json | null
          id: string
          narrative_text: string | null
          pdf_storage_path: string | null
          session_id: string
          strengths_json: Json | null
        }
        Insert: {
          domain_scores_json?: Json | null
          generated_at?: string | null
          growth_areas_json?: Json | null
          id?: string
          narrative_text?: string | null
          pdf_storage_path?: string | null
          session_id: string
          strengths_json?: Json | null
        }
        Update: {
          domain_scores_json?: Json | null
          generated_at?: string | null
          growth_areas_json?: Json | null
          id?: string
          narrative_text?: string | null
          pdf_storage_path?: string | null
          session_id?: string
          strengths_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          ai_justification: string | null
          id: string
          raw_response: string
          score: number | null
          scored_at: string | null
          session_question_id: string
        }
        Insert: {
          ai_justification?: string | null
          id?: string
          raw_response: string
          score?: number | null
          scored_at?: string | null
          session_question_id: string
        }
        Update: {
          ai_justification?: string | null
          id?: string
          raw_response?: string
          score?: number | null
          scored_at?: string | null
          session_question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_session_question_id_fkey"
            columns: ["session_question_id"]
            isOneToOne: true
            referencedRelation: "session_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_questions: {
        Row: {
          generated_scenario_text: string | null
          id: string
          options_json: Json | null
          question_bank_id: string
          sequence_no: number
          session_id: string
          skill_domain_name: string
          type: string
        }
        Insert: {
          generated_scenario_text?: string | null
          id?: string
          options_json?: Json | null
          question_bank_id: string
          sequence_no: number
          session_id: string
          skill_domain_name: string
          type: string
        }
        Update: {
          generated_scenario_text?: string | null
          id?: string
          options_json?: Json | null
          question_bank_id?: string
          sequence_no?: number
          session_id?: string
          skill_domain_name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_questions_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_domains: {
        Row: {
          description: string | null
          id: string
          is_universal: boolean
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_universal?: boolean
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          is_universal?: boolean
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      discipline_questions: {
        Args: { p_discipline_id: string }
        Returns: {
          base_text: string
          options_json: Json
          question_id: string
          sequence_no: number
          skill_domain_name: string
          type: string
        }[]
      }
      discipline_summary: {
        Args: { p_discipline_id: string }
        Returns: {
          domain_names: string[]
          estimated_minutes_high: number
          estimated_minutes_low: number
          total_questions: number
        }[]
      }
      is_admin_or_sme: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

