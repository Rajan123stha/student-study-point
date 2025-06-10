
import { createClient } from '@supabase/supabase-js';

// Use direct values from the Supabase integration
const supabaseUrl = "https://hseqfpfamgdqocueewco.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZXFmcGZhbWdkcW9jdWVld2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjA3NjMsImV4cCI6MjA2MDI5Njc2M30.7FV4o8qu-_yZt4nDnRghvFULFMDq3uAb3Pxinmlq8dg";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ResourceInsert = Omit<Resource, 'id' | 'uploadDate'>;

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  semester: number;
  uploadDate: string;
  fileUrl: string;
  field: string;
  created_at?: string;
}

// Type for admin users
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at?: string;
}
