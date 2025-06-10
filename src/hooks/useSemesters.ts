
import { useMemo } from 'react';

export const useSemesters = (count: number = 8) => {
  const semesters = useMemo(() => {
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [count]);

  return semesters;
};
