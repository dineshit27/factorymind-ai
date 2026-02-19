import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types (extend as needed)
export interface Database {
  public: {
    Tables: {
      diagnoses: {
        Row: {
          id: string;
          user_id: string;
          factory_name: string;
          machine_name: string;
          machine_type: string;
          diagnosis_data: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['diagnoses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['diagnoses']['Insert']>;
      };
      calibrations: {
        Row: {
          id: string;
          user_id: string;
          predicted_bill: number;
          actual_bill: number;
          month: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['calibrations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['calibrations']['Insert']>;
      };
    };
  };
}
