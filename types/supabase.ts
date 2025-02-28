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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
