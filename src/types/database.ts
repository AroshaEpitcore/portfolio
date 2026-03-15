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
      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          icon: string | null;
          price: string | null;
          features: string[] | null;
          is_featured: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          price?: string | null;
          features?: string[] | null;
          is_featured?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          icon?: string | null;
          price?: string | null;
          features?: string[] | null;
          is_featured?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          field_of_study: string | null;
          description: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          grade: string | null;
          logo_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          field_of_study?: string | null;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          grade?: string | null;
          logo_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string;
          field_of_study?: string | null;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          grade?: string | null;
          logo_url?: string | null;
          order_index?: number;
          created_at?: string;
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
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          company: string | null;
          avatar_url: string | null;
          content: string;
          rating: number;
          is_featured: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          company?: string | null;
          avatar_url?: string | null;
          content: string;
          rating?: number;
          is_featured?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          company?: string | null;
          avatar_url?: string | null;
          content?: string;
          rating?: number;
          is_featured?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          thumbnail_url: string | null;
          tags: string[] | null;
          is_published: boolean;
          is_featured: boolean;
          read_time: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          thumbnail_url?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          is_featured?: boolean;
          read_time?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          thumbnail_url?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          is_featured?: boolean;
          read_time?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
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
export type Education = Database["public"]["Tables"]["education"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export interface Achievement {
  id: string;
  title: string;
  issuer: string | null;
  description: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
  images: string[] | null;
  category: string;
  order_index: number;
  created_at: string;
}
