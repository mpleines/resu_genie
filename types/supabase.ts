export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      education: {
        Row: {
          created_at: string
          degree: string | null
          end_date: string | null
          id: number
          institute_name: string | null
          resume_id: number | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          degree?: string | null
          end_date?: string | null
          id?: number
          institute_name?: string | null
          resume_id?: number | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          degree?: string | null
          end_date?: string | null
          id?: number
          institute_name?: string | null
          resume_id?: number | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resume"
            referencedColumns: ["id"]
          },
        ]
      }
      job_advertisement: {
        Row: {
          created_at: string
          id: number
          link: string | null
          resume_id: number | null
          text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          link?: string | null
          resume_id?: number | null
          text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          link?: string | null
          resume_id?: number | null
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_advertisement_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: true
            referencedRelation: "resume"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_information: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          highest_education: number | null
          id: number
          linkedin: string | null
          name: string | null
          phone_1: string | null
          professional_experience_in_years: number | null
          resume_id: number | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          highest_education?: number | null
          id?: number
          linkedin?: string | null
          name?: string | null
          phone_1?: string | null
          professional_experience_in_years?: number | null
          resume_id?: number | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          highest_education?: number | null
          id?: number
          linkedin?: string | null
          name?: string | null
          phone_1?: string | null
          professional_experience_in_years?: number | null
          resume_id?: number | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_information_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: true
            referencedRelation: "resume"
            referencedColumns: ["id"]
          },
        ]
      }
      resume: {
        Row: {
          chat_gpt_response_raw: Json | null
          created_at: string
          id: number
          last_updated: string | null
          payment_successful: boolean | null
          user_id: string | null
        }
        Insert: {
          chat_gpt_response_raw?: Json | null
          created_at?: string
          id?: number
          last_updated?: string | null
          payment_successful?: boolean | null
          user_id?: string | null
        }
        Update: {
          chat_gpt_response_raw?: Json | null
          created_at?: string
          id?: number
          last_updated?: string | null
          payment_successful?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      resume_job: {
        Row: {
          created_at: string
          id: number
          resume_id: number | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: number
          resume_id?: number | null
          status: string
        }
        Update: {
          created_at?: string
          id?: number
          resume_id?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_job_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resume"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: number
          resume_id: number | null
          skill_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          resume_id?: number | null
          skill_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          resume_id?: number | null
          skill_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resume"
            referencedColumns: ["id"]
          },
        ]
      }
      welcome_emails: {
        Row: {
          created_at: string
          id: number
          sent_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          sent_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          sent_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          job_description: string | null
          organisation_name: string | null
          profile: string | null
          resume_id: number | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          job_description?: string | null
          organisation_name?: string | null
          profile?: string | null
          resume_id?: number | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          job_description?: string | null
          organisation_name?: string | null
          profile?: string | null
          resume_id?: number | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_experience_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resume"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
