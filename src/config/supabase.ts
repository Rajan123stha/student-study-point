/**
 * Supabase Configuration
 * This file contains configuration constants for Supabase services
 */

// The URL of your Supabase project - get this from your Supabase dashboard
export const SUPABASE_URL = 'https://hseqfpfamgdqocueewco.supabase.co';

// The URL for Supabase Storage - used for file storage
export const SUPABASE_STORAGE_URL = 'https://hseqfpfamgdqocueewco.supabase.co/storage/v1/object/public';

// The bucket name for storing resource files - IMPORTANT: this must exist in your Supabase project
export const RESOURCES_BUCKET = 'study-resources'; // Changed from 'resources' to a more specific name

// Whether the bucket is public or private - public is easier for development
export const IS_BUCKET_PUBLIC = true; // Set to true for easier development

/**
 * Get a fully qualified Supabase storage URL
 * @param path The path within the bucket
 * @param bucket The storage bucket (default: resources)
 * @returns Full URL to the file
 */
export function getStorageUrl(path: string, bucket: string = RESOURCES_BUCKET): string {
  // Handle case when path already has the full URL
  if (path.startsWith('http')) return path;
  
  // Clean the path by removing any leading slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Construct and return the full URL
  return `${SUPABASE_STORAGE_URL}/${bucket}/${cleanPath}`;
}