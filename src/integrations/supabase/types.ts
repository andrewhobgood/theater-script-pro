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
      licenses: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          license_type: Database["public"]["Enums"]["license_type"]
          licensee_id: string
          performance_dates: Json | null
          purchase_price: number
          script_id: string
          signed_contract_url: string | null
          special_terms: string | null
          status: Database["public"]["Enums"]["license_status"] | null
          updated_at: string | null
          venue_capacity: number | null
          venue_name: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          license_type: Database["public"]["Enums"]["license_type"]
          licensee_id: string
          performance_dates?: Json | null
          purchase_price: number
          script_id: string
          signed_contract_url?: string | null
          special_terms?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          updated_at?: string | null
          venue_capacity?: number | null
          venue_name?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          license_type?: Database["public"]["Enums"]["license_type"]
          licensee_id?: string
          performance_dates?: Json | null
          purchase_price?: number
          script_id?: string
          signed_contract_url?: string | null
          special_terms?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          updated_at?: string | null
          venue_capacity?: number | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_licensee_id_fkey"
            columns: ["licensee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          awards: string[] | null
          bio: string | null
          company_name: string | null
          created_at: string | null
          department: string | null
          email: string
          first_name: string
          id: string
          is_educational: boolean | null
          is_verified: boolean | null
          last_name: string
          location: Json | null
          permissions: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          social_media: Json | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string
          venue_capacity: number | null
          website: string | null
          year_founded: number | null
        }
        Insert: {
          awards?: string[] | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          first_name: string
          id?: string
          is_educational?: boolean | null
          is_verified?: boolean | null
          last_name: string
          location?: Json | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          social_media?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id: string
          venue_capacity?: number | null
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          awards?: string[] | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_educational?: boolean | null
          is_verified?: boolean | null
          last_name?: string
          location?: Json | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          social_media?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string
          venue_capacity?: number | null
          website?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          rating: number
          reviewer_id: string
          script_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating: number
          reviewer_id: string
          script_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number
          reviewer_id?: string
          script_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts: {
        Row: {
          age_rating: string | null
          average_rating: number | null
          awards: string[] | null
          cast_size_max: number | null
          cast_size_min: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          duration_minutes: number | null
          educational_price: number | null
          file_url: string | null
          genre: string
          id: string
          is_featured: boolean | null
          language: string | null
          perusal_url: string | null
          playwright_id: string
          premiere_date: string | null
          premiere_venue: string | null
          premium_price: number | null
          sample_pages_url: string | null
          standard_price: number | null
          status: Database["public"]["Enums"]["script_status"] | null
          synopsis: string | null
          technical_requirements: Json | null
          themes: string[] | null
          title: string
          total_reviews: number | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          age_rating?: string | null
          average_rating?: number | null
          awards?: string[] | null
          cast_size_max?: number | null
          cast_size_min?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration_minutes?: number | null
          educational_price?: number | null
          file_url?: string | null
          genre: string
          id?: string
          is_featured?: boolean | null
          language?: string | null
          perusal_url?: string | null
          playwright_id: string
          premiere_date?: string | null
          premiere_venue?: string | null
          premium_price?: number | null
          sample_pages_url?: string | null
          standard_price?: number | null
          status?: Database["public"]["Enums"]["script_status"] | null
          synopsis?: string | null
          technical_requirements?: Json | null
          themes?: string[] | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          age_rating?: string | null
          average_rating?: number | null
          awards?: string[] | null
          cast_size_max?: number | null
          cast_size_min?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration_minutes?: number | null
          educational_price?: number | null
          file_url?: string | null
          genre?: string
          id?: string
          is_featured?: boolean | null
          language?: string | null
          perusal_url?: string | null
          playwright_id?: string
          premiere_date?: string | null
          premiere_venue?: string | null
          premium_price?: number | null
          sample_pages_url?: string | null
          standard_price?: number | null
          status?: Database["public"]["Enums"]["script_status"] | null
          synopsis?: string | null
          technical_requirements?: Json | null
          themes?: string[] | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scripts_playwright_id_fkey"
            columns: ["playwright_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          license_id: string | null
          metadata: Json | null
          script_id: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          license_id?: string | null
          metadata?: Json | null
          script_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          license_id?: string | null
          metadata?: Json | null
          script_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      license_status: "active" | "expired" | "cancelled"
      license_type: "standard" | "premium" | "educational"
      script_status: "draft" | "published" | "archived"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "playwright" | "theater_company" | "admin"
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
    Enums: {
      license_status: ["active", "expired", "cancelled"],
      license_type: ["standard", "premium", "educational"],
      script_status: ["draft", "published", "archived"],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["playwright", "theater_company", "admin"],
    },
  },
} as const
