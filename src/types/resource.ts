export interface Resource {
  id: number;
  title: string;
  description: string;
  subject: string;
  field: string;
  field_id: string;
  type: string;
  semester: number;
  fileUrl: string;
  uploadDate?: string;
  created_at?: string;
  
  // Client-side only properties (not stored in database)
  fileName?: string;
  fileSelected?: boolean;
  fields?: { id: string; name: string };
}
