
import React, { useEffect, useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSubjects } from '@/hooks/useSubjects';

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  fieldId?: string;
  semester?: number;
  label?: string;
  includeAllOption?: boolean;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  value,
  onChange,
  fieldId,
  semester,
  label = "Subject",
  includeAllOption = true
}) => {
  const { subjects, isLoading } = useSubjects({ fieldId, semester });
  
  // If current selected subject is not in available subjects, reset it
  useEffect(() => {
    if (!isLoading && value && value !== 'all' && subjects.length > 0) {
      const subjectExists = subjects.some(s => s.name === value);
      if (!subjectExists && onChange) {
        onChange('all');
      }
    }
  }, [subjects, value, isLoading, onChange]);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select subject" />
        </SelectTrigger>
        <SelectContent>
          {includeAllOption && <SelectItem value="all">All Subjects</SelectItem>}
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubjectSelector;
