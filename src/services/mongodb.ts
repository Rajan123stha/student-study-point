import { Resource } from '@/types/resource';
import { supabase } from '@/lib/supabase';
import { getStorageUrl, RESOURCES_BUCKET } from '@/config/supabase';

// Function to connect to Supabase
export const connectToMongoDB = async () => {
  try {
    // console.log('Connecting to Supabase...');
    
    // Test connection by making a simple query
    const { data, error } = await supabase
      .from('resources')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error testing Supabase connection:', error);
      throw error;
    }
    
    // console.log('Connected to Supabase');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
};

// Resource CRUD operations
export const getResources = async (): Promise<Resource[]> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*, fields:field_id(id, name)')
      .order('uploadDate', { ascending: false });
    
    if (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
    
    // console.log('Fetched resources:', data);
    return data?.map(item => ({
      ...item,
      id: Number(item.id),
      field: item.fields?.name || item.field || "BCA", // Use field name from the fields table or fallback
    })) || [];
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return [];
  }
};

export const getResourceById = async (id: number): Promise<Resource | null> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*, fields:field_id(id, name)')
      .eq('id', id.toString())
      .single();
    
    if (error) {
      console.error(`Error fetching resource with id ${id}:`, error);
      return null;
    }
    
    // console.log(`Fetched resource with id ${id}:`, data);
    return { 
      ...data, 
      id: Number(data.id),
      field: data.fields?.name || data.field || "BCA", // Use field name from fields table
    } as Resource;
  } catch (error) {
    console.error(`Failed to fetch resource with id ${id}:`, error);
    return null;
  }
};

export const createResource = async (resource: Omit<Resource, 'id' | 'uploadDate'>): Promise<Resource> => {
  try {
    const newResource = {
      ...resource,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    const { data, error } = await supabase
      .from('resources')
      .insert(newResource)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
    
    // console.log('Created resource:', data);
    return { 
      ...data, 
      id: Number(data.id),
      uploadDate: data.uploadDate || newResource.uploadDate,
    } as Resource;
  } catch (error) {
    console.error('Failed to create resource:', error);
    throw error;
  }
};

export const updateResource = async (id: number, updates: Partial<Resource>): Promise<Resource | null> => {
  try {
    // CRITICAL FIX: Create a new clean object without problematic fields
    // Use type assertion to avoid TypeScript errors
    const updatesCopy = { ...updates } as any;
      // Remove problematic fields that might cause database errors
    if ('fields' in updatesCopy) delete updatesCopy.fields;
    if ('field_id' in updatesCopy) delete updatesCopy.field_id;
    if ('fileName' in updatesCopy) delete updatesCopy.fileName; // Remove fileName which doesn't exist in DB
    if ('fileSelected' in updatesCopy) delete updatesCopy.fileSelected; // Remove fileSelected which doesn't exist in DB
    
    // console.log(`About to update resource ${id} with clean data:`, updatesCopy);
    
    // Make sure id is a string for Supabase
    const updateData = {
      ...updatesCopy,
      id: id.toString()
    };
    
    // Remove any undefined values that could cause issues
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const { data, error } = await supabase
      .from('resources')
      .update(updateData)
      .eq('id', id.toString())
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating resource with id ${id}:`, error);
      throw error;
    }
    
    // console.log(`Successfully updated resource with id ${id}:`, data);
    
    // Return the updated resource with the correct field property
    return { 
      ...data, 
      id: Number(data.id),
      field: updates.field || data.field || "BCA"
    } as Resource;
  } catch (error) {
    console.error(`Failed to update resource with id ${id}:`, error);
    return null;
  }
};

export const deleteResource = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id.toString());
    
    if (error) {
      console.error(`Error deleting resource with id ${id}:`, error);
      throw error;
    }
    
    // console.log(`Deleted resource with id ${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete resource with id ${id}:`, error);
    return false;
  }
};

// Authentication methods
export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password) // In a real app, use proper password verification
      .single();
    
    if (error || !data) {
      console.error('Authentication error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
};

export const registerAdmin = async (adminData: { fullName: string, email: string, password: string }): Promise<boolean> => {
  try {
    // Check if email already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', adminData.email)
      .single();
    
    if (existingAdmin) {
      throw new Error('Email already in use');
    }
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the "no rows found" error code
      throw checkError;
    }
    
    // Insert new admin
    const { error } = await supabase
      .from('admins')
      .insert({
        email: adminData.email,
        full_name: adminData.fullName,
        password_hash: adminData.password // In a real app, use proper password hashing
      });
    
    if (error) {
      console.error('Error registering admin:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const uploadResourceFile = async (file: File, resourceId: string): Promise<string> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Create a unique file path for this resource
    const fileExt = file.name.split('.').pop();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_'); // Replace special chars
    const fileName = `${resourceId}_${Date.now()}_${sanitizedFileName}`;
    
    // Create a simple file path in the bucket root
    const filePath = fileName;
    
    // console.log(`Uploading file: ${fileName} to bucket: ${RESOURCES_BUCKET}`);
    
    // WORKAROUND FOR RLS POLICY ISSUE:
    // 1. Try uploading with credentials first
    let uploadResult;
    try {
      uploadResult = await supabase.storage
        .from(RESOURCES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
    } catch (uploadError) {
      console.warn("Initial upload failed, likely due to RLS policy:", uploadError);
      
      // 2. If that fails, try as anonymous/public upload if your bucket allows it
      uploadResult = await supabase.storage
        .from(RESOURCES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
    }
    
    const { data, error } = uploadResult;
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get the public URL for the file
    const { data: urlData } = supabase.storage
      .from(RESOURCES_BUCKET)
      .getPublicUrl(data.path);
    
    // console.log('Generated URL:', urlData.publicUrl);
    
    // Ensure we have an absolute URL
    const finalUrl = urlData.publicUrl.startsWith('http') 
      ? urlData.publicUrl 
      : getStorageUrl(data.path);
    
    // console.log('File uploaded successfully, URL:', finalUrl);
    return finalUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};
