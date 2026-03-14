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
          name: string | null;
          title: string | null;
          bio: string | null;
          avatar_url: string | null;
          resume_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          icon: string | null;
          proficiency: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          icon?: string | null;
          proficiency?: number;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          icon?: string | null;
          proficiency?: number;
          order_index?: number;
          created_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          company: string;
          position: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          position?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          long_description: string | null;
          thumbnail_url: string | null;
          images: string[] | null;
          tech_stack: string[] | null;
          live_url: string | null;
          github_url: string | null;
          is_featured: boolean;
          is_published: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          long_description?: string | null;
          thumbnail_url?: string | null;
          images?: string[] | null;
          tech_stack?: string[] | null;
          live_url?: string | null;
          github_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string | null;
          long_description?: string | null;
          thumbnail_url?: string | null;
          images?: string[] | null;
          tech_stack?: string[] | null;
          live_url?: string | null;
          github_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          location: string | null;
          availability: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          availability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          availability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Experience = Database["public"]["Tables"]["experiences"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
export type ContactInfo = Database["public"]["Tables"]["contact_info"]["Row"];
export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];
