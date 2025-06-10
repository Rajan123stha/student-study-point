# Supabase Storage Setup Instructions

## Problem: "new row violates row-level security policy"

This error occurs when your Supabase RLS (Row Level Security) policies are preventing file uploads or other operations. Follow these steps to fix it:

## Step 1: Create the storage bucket

1. Log in to your Supabase dashboard: https://app.supabase.io/project/_
2. Navigate to Storage → Buckets
3. Create a new bucket called "study-resources"
4. Set the bucket to Public (for development) or Private (for production)

## Step 2: Add RLS Policies

Go to the "Policies" tab for your bucket and add these policies:

### Option 1: For development (less secure, but easier)

This allows anyone to read and upload files (good for development):

```sql
-- Policy to allow public reading of files
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'study-resources');

-- Policy to allow anyone to upload files
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
USING (bucket_id = 'study-resources');

-- Policy to allow file owners to update their files
CREATE POLICY "Allow owners to update files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'study-resources');

-- Policy to allow file owners to delete their files
CREATE POLICY "Allow owners to delete files"
ON storage.objects FOR DELETE
USING (bucket_id = 'study-resources');
```

### Option 2: For production (more secure)

This requires authentication to upload files (better for production):

```sql
-- Policy to allow public reading of files
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'study-resources');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
USING (bucket_id = 'study-resources' AND auth.role() = 'authenticated');

-- Policy to allow owners to update their files
CREATE POLICY "Allow owners to update files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'study-resources' AND auth.uid() = owner);

-- Policy to allow owners to delete their files
CREATE POLICY "Allow owners to delete files"
ON storage.objects FOR DELETE
USING (bucket_id = 'study-resources' AND auth.uid() = owner);
```

## Step 3: Update your application config

Make sure your application's configuration matches your Supabase settings:

```typescript
// In src/config/supabase.ts
export const RESOURCES_BUCKET = "study-resources";
export const IS_BUCKET_PUBLIC = true; // Set to match your bucket's privacy setting
```

After applying these changes, your file uploads should work correctly without any RLS policy violations.
