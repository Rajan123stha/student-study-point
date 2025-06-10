
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSemesters } from '@/hooks/useSemesters';

interface SemesterSelectorProps {
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  includeAllOption?: boolean;
}

const SemesterSelector: React.FC<SemesterSelectorProps> = ({
  value,
  onChange,
  label = "Semester",
  includeAllOption = true
}) => {
  const semesters = useSemesters();
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <Select
        value={String(value)}
        onValueChange={(val) => {
          const newValue = val === 'all' ? 'all' : parseInt(val);
          onChange(newValue);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select semester" />
        </SelectTrigger>
        <SelectContent>
          {includeAllOption && <SelectItem value="all">All Semesters</SelectItem>}
          {semesters.map((semester) => (
            <SelectItem key={semester} value={String(semester)}>
              Semester {semester}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SemesterSelector;
