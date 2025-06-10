
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useFields } from '@/hooks/useFields';

interface FieldSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  includeAllOption?: boolean;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  value,
  onChange,
  label = "Field of Study",
  includeAllOption = true
}) => {
  const { fields, isLoading } = useFields();
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {includeAllOption && <SelectItem value="all">All Fields</SelectItem>}
          {fields.map((field) => (
            <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FieldSelector;
