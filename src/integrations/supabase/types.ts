export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      baggage_segment_prices: {
        Row: {
          destination: string
          origin: string
          price_per_kg_usd: number
          updated_at: string
        }
        Insert: {
          destination: string
          origin: string
          price_per_kg_usd: number
          updated_at?: string
        }
        Update: {
          destination?: string
          origin?: string
          price_per_kg_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      block_library_overrides: {
        Row: {
          label: string
          preview_url: string
          section_id: string
          updated_at: string
        }
        Insert: {
          label?: string
          preview_url?: string
          section_id: string
          updated_at?: string
        }
        Update: {
          label?: string
          preview_url?: string
          section_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      component_types: {
        Row: {
          id: string
          label: string
          shared_style: Json | null
        }
        Insert: {
          id: string
          label: string
          shared_style?: Json | null
        }
        Update: {
          id?: string
          label?: string
          shared_style?: Json | null
        }
        Relationships: []
      }
      components: {
        Row: {
          content: Json
          created_at: string
          id: string
          position: number
          style: Json
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          position?: number
          style?: Json
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          position?: number
          style?: Json
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "components_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          label_ar: string
          label_en: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          label_ar: string
          label_en: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          label_ar?: string
          label_en?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_alt_texts: {
        Row: {
          alt_ar: string
          alt_en: string
          bucket_id: string
          object_path: string
          updated_at: string
        }
        Insert: {
          alt_ar?: string
          alt_en?: string
          bucket_id: string
          object_path: string
          updated_at?: string
        }
        Update: {
          alt_ar?: string
          alt_en?: string
          bucket_id?: string
          object_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          currency: string | null
          description_ar: string | null
          description_en: string | null
          details: Json
          discount_type: string
          discount_value: number
          ends_at: string | null
          expiry_type: string
          id: string
          max_passengers: number | null
          starts_at: string
          status: string
          title_ar: string
          title_en: string
          trip_type: string | null
          type: string
          updated_at: string
          updated_by: string | null
          used_passengers: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          details?: Json
          discount_type: string
          discount_value: number
          ends_at?: string | null
          expiry_type: string
          id?: string
          max_passengers?: number | null
          starts_at?: string
          status?: string
          title_ar: string
          title_en: string
          trip_type?: string | null
          type: string
          updated_at?: string
          updated_by?: string | null
          used_passengers?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          details?: Json
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          expiry_type?: string
          id?: string
          max_passengers?: number | null
          starts_at?: string
          status?: string
          title_ar?: string
          title_en?: string
          trip_type?: string | null
          type?: string
          updated_at?: string
          updated_by?: string | null
          used_passengers?: number
        }
        Relationships: []
      }
      page_components: {
        Row: {
          component_id: string
          created_at: string
          id: string
          lang: string
          page_id: string
          position: number
          updated_at: string
        }
        Insert: {
          component_id: string
          created_at?: string
          id?: string
          lang?: string
          page_id: string
          position?: number
          updated_at?: string
        }
        Update: {
          component_id?: string
          created_at?: string
          id?: string
          lang?: string
          page_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_components_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          lang: string | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          lang?: string | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          lang?: string | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pos_list: {
        Row: {
          airports: Json
          code: string
          created_at: string
          currency: string
          flag_url: string
          id: string
          is_active: boolean
          languages: string[]
          name_ar: string
          name_en: string
          position: number
          updated_at: string
        }
        Insert: {
          airports?: Json
          code: string
          created_at?: string
          currency: string
          flag_url?: string
          id?: string
          is_active?: boolean
          languages?: string[]
          name_ar: string
          name_en: string
          position?: number
          updated_at?: string
        }
        Update: {
          airports?: Json
          code?: string
          created_at?: string
          currency?: string
          flag_url?: string
          id?: string
          is_active?: boolean
          languages?: string[]
          name_ar?: string
          name_en?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_footer: {
        Row: {
          data: Json
          id: string
          lang: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          data: Json
          id?: string
          lang: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          data?: Json
          id?: string
          lang?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      site_header: {
        Row: {
          data: Json
          id: string
          lang: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          data: Json
          id?: string
          lang: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          data?: Json
          id?: string
          lang?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      component_is_public: { Args: { _component_id: string }; Returns: boolean }
      consume_offer_passengers: {
        Args: { p_offer_id: string; p_passengers: number }
        Returns: number
      }
      ensure_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      page_is_published: { Args: { _page_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
