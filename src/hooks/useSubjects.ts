
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface Subject {
  id: string;
  name: string;
  field_id: string;
  semester: number;
}

interface UseSubjectsOptions {
  fieldId?: string;
  semester?: number;
}

export const useSubjects = (options?: UseSubjectsOptions) => {
  const { fieldId, semester } = options || {};
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('subjects')
          .select('*')
          .order('name');
        
        if (fieldId) {
          query = query.eq('field_id', fieldId);
        }
        
        if (semester) {
          query = query.eq('semester', semester);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setSubjects(data || []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [fieldId, semester]);

  return { subjects, isLoading, error };
};
