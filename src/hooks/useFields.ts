
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Field {
  id: string;
  name: string;
}

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('fields')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setFields(data || []);
      } catch (err) {
        console.error('Error fetching fields:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, []);

  return { fields, isLoading, error };
};
