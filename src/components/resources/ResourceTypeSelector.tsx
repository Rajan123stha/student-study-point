
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RESOURCE_TYPES, ALL_TYPES_VALUE } from "@/constants/resourceTypes";

interface ResourceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  includeAllOption?: boolean;
}

const ResourceTypeSelector: React.FC<ResourceTypeSelectorProps> = ({ 
  value, 
  onChange, 
  label = "Type",
  includeAllOption = true
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {includeAllOption && <SelectItem value={ALL_TYPES_VALUE}>All Types</SelectItem>}
          {RESOURCE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ResourceTypeSelector;
