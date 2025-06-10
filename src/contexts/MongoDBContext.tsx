
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Resource } from '@/types/resource';
import { MOCK_RESOURCES } from '@/data/mockData';

interface MongoDBContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  refreshResources: () => Promise<void>;
}

const MongoDBContext = createContext<MongoDBContextType>({
  isConnected: false,
  isLoading: true,
  error: null,
  refreshResources: async () => {}
});

export const useMongoDBContext = () => useContext(MongoDBContext);

interface MongoDBProviderProps {
  children: ReactNode;
}

export const MongoDBProvider = ({ children }: MongoDBProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initDatabase = async () => {
    try {
      // Check if Supabase tables exist, if not create them
      const { data, error: tablesError } = await supabase
        .from('resources')
        .select('id')
        .limit(1);

      // If the table exists but is empty, seed it with mock data
      if (!tablesError && (!data || data.length === 0)) {
        // console.log('Setting up initial data in Supabase');
        
        // Seed the database with mock data
        for (const resource of MOCK_RESOURCES) {
          await supabase
            .from('resources')
            .insert({
              id: resource.id.toString(),
              title: resource.title,
              description: resource.description,
              type: resource.type,
              subject: resource.subject,
              semester: resource.semester,
              uploadDate: resource.uploadDate,
              fileUrl: resource.fileUrl
            });
        }
      } else if (tablesError) {
        console.error('Error checking resources table:', tablesError);
      } else {
        // console.log('Supabase resources table already exists with data');
      }

      // Check admin users table
      const { data: adminData, error: adminsError } = await supabase
        .from('admins')
        .select('id')
        .limit(1);

      // If admin table exists but is empty, add default admin
      if (!adminsError && (!adminData || adminData.length === 0)) {
        // console.log('Setting up default admin user');
        // Create default admin user
        await supabase
          .from('admins')
          .insert({
            email: 'admin@studypoint.com',
            full_name: 'Admin User',
            password_hash: 'password123' // In a real app, use proper password hashing
          });
      } else if (adminsError) {
        console.error('Error checking admins table:', adminsError);
      } else {
        // console.log('Admins table already exists with data');
      }
      
      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to initialize Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  // Function to refresh resources
  const refreshResources = async () => {
    try {
      await initDatabase();
    } catch (err) {
      console.error('Failed to refresh resources:', err);
    }
  };

  const value = {
    isConnected,
    isLoading,
    error,
    refreshResources
  };

  return (
    <MongoDBContext.Provider value={value}>
      {children}
    </MongoDBContext.Provider>
  );
};
