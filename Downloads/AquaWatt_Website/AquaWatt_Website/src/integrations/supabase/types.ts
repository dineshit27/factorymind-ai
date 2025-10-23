export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          display_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          display_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          display_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      water_usage: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          usage_amount: number | null
          usage_type: string | null
          location: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          usage_amount?: number | null
          usage_type?: string | null
          location?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          usage_amount?: number | null
          usage_type?: string | null
          location?: string | null
          recorded_at?: string
          created_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          user_id: string
          device_name: string
          device_type: string | null
          location: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_name: string
          device_type?: string | null
          location?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_name?: string
          device_type?: string | null
          location?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      connected_devices: {
        Row: {
          id: string
          user_id: string
          device_name: string
          device_type: string
          location: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_name: string
          device_type: string
          location?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_name?: string
          device_type?: string
          location?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          owner_user_id: string
          member_email: string
          access_level: string | null
          status: string | null
          invited_at: string
          joined_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
            owner_user_id: string
            member_email: string
            access_level?: string | null
            status?: string | null
            invited_at?: string
            joined_at?: string | null
            created_at?: string
            updated_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          member_email?: string
          access_level?: string | null
          status?: string | null
          invited_at?: string
          joined_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      water_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: string | null
          target_amount: number | null
          current_amount: number | null
          start_date: string | null
          end_date: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type?: string | null
          target_amount?: number | null
          current_amount?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: string | null
          target_amount?: number | null
          current_amount?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string | null
          title: string | null
          description: string | null
          earned_at: string
          points: number | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type?: string | null
          title?: string | null
          description?: string | null
          earned_at?: string
          points?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string | null
          title?: string | null
          description?: string | null
          earned_at?: string
          points?: number | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          notification_type: string | null
          is_read: boolean | null
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          notification_type?: string | null
          is_read?: boolean | null
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          notification_type?: string | null
          is_read?: boolean | null
          action_url?: string | null
          created_at?: string
        }
      }
      billing: {
        Row: {
          id: string
          user_id: string
          billing_period_start: string
          billing_period_end: string
          total_usage: number | null
          base_rate: number | null
          tier_1_rate: number | null
          tier_1_limit: number | null
          tier_2_rate: number | null
          tier_2_limit: number | null
          tier_3_rate: number | null
          base_charge: number | null
          taxes: number | null
          total_amount: number | null
          status: string | null
          due_date: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          billing_period_start: string
          billing_period_end: string
          total_usage?: number | null
          base_rate?: number | null
          tier_1_rate?: number | null
          tier_1_limit?: number | null
          tier_2_rate?: number | null
          tier_2_limit?: number | null
          tier_3_rate?: number | null
          base_charge?: number | null
          taxes?: number | null
          total_amount?: number | null
          status?: string | null
          due_date: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          billing_period_start?: string
          billing_period_end?: string
          total_usage?: number | null
          base_rate?: number | null
          tier_1_rate?: number | null
          tier_1_limit?: number | null
          tier_2_rate?: number | null
          tier_2_limit?: number | null
          tier_3_rate?: number | null
          base_charge?: number | null
          taxes?: number | null
          total_amount?: number | null
          status?: string | null
          due_date?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      water_rates: {
        Row: {
          id: string
          user_id: string
          rate_name: string
          base_rate: number | null
          tier_1_rate: number | null
          tier_1_limit: number | null
          tier_2_rate: number | null
          tier_2_limit: number | null
          tier_3_rate: number | null
          base_charge: number | null
          taxes_percentage: number | null
          is_active: boolean | null
          effective_from: string
          effective_to: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rate_name: string
          base_rate?: number | null
          tier_1_rate?: number | null
          tier_1_limit?: number | null
          tier_2_rate?: number | null
          tier_2_limit?: number | null
          tier_3_rate?: number | null
          base_charge?: number | null
          taxes_percentage?: number | null
          is_active?: boolean | null
          effective_from: string
          effective_to?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rate_name?: string
          base_rate?: number | null
          tier_1_rate?: number | null
          tier_1_limit?: number | null
          tier_2_rate?: number | null
          tier_2_limit?: number | null
          tier_3_rate?: number | null
          base_charge?: number | null
          taxes_percentage?: number | null
          is_active?: boolean | null
          effective_from?: string
          effective_to?: string | null
          created_at?: string
        }
      }
      analytics_cache: {
        Row: {
          id: string
          user_id: string
          cache_key: string
          cache_data: any
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cache_key: string
          cache_data: any
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cache_key?: string
          cache_data?: any
          expires_at?: string
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          user_id: string
          setting_key: string
          setting_value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          setting_key: string
          setting_value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          setting_key?: string
          setting_value?: any
          created_at?: string
          updated_at?: string
        }
      }
      water_quality: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          ph_level: number | null
          temperature: number | null
          turbidity: number | null
          chlorine_level: number | null
          hardness: number | null
          tds: number | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          ph_level?: number | null
          temperature?: number | null
          turbidity?: number | null
          chlorine_level?: number | null
          hardness?: number | null
          tds?: number | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string | null
          ph_level?: number | null
          temperature?: number | null
          turbidity?: number | null
          chlorine_level?: number | null
          hardness?: number | null
          tds?: number | null
          recorded_at?: string
          created_at?: string
        }
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
  public: {
    Enums: {},
  },
} as const
