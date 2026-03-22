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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      achievements: {
        Row: {
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
        };
        Insert: {
          id?: string;
          title: string;
          issuer?: string | null;
          description?: string | null;
          issue_date?: string | null;
          expiry_date?: string | null;
          credential_url?: string | null;
          images?: string[] | null;
          category?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string | null;
          description?: string | null;
          issue_date?: string | null;
          expiry_date?: string | null;
          credential_url?: string | null;
          images?: string[] | null;
          category?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          avatar_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          whatsapp_url: string | null;
          is_active: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          bio?: string | null;
          avatar_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          whatsapp_url?: string | null;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          bio?: string | null;
          avatar_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          whatsapp_url?: string | null;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      cv_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          generations_used: number;
          is_paid: boolean;
          payment_reference: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          generations_used?: number;
          is_paid?: boolean;
          payment_reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          generations_used?: number;
          is_paid?: boolean;
          payment_reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cv_generations: {
        Row: {
          id: string;
          user_id: string;
          cv_data: Record<string, unknown>;
          generated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cv_data: Record<string, unknown>;
          generated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cv_data?: Record<string, unknown>;
          generated_at?: string;
        };
        Relationships: [];
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
    CompositeTypes: {
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
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

// ── CV Generator types ─────────────────────────────────────────────────────

export interface CVUser {
  id: string;
  email: string;
  full_name: string | null;
  generations_used: number;
  is_paid: boolean;
  payment_reference: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CVGeneration {
  id: string;
  user_id: string;
  cv_data: CVFormData;
  generated_at: string;
}

export interface CVStyles {
  fontFamily: "helvetica" | "times" | "courier";
  accentColor: string;
}

export interface CVFormData {
  styles: CVStyles;
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    grade: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    techStack: string;
    url: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
}
