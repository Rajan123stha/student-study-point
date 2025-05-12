import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import SearchInput from "./SearchInput";
import FieldSelector from "./FieldSelector";
import SubjectSelector from "./SubjectSelector";
import SemesterSelector from "./SemesterSelector";
import ResourceTypeSelector from "./ResourceTypeSelector";
import { ALL_TYPES_VALUE } from "@/constants/resourceTypes";

interface FiltersState {
  semester: string | number;
  subject: string;
  type: string;
  searchQuery: string;
  field: string;
}

interface ResourcesFiltersProps {
  filters: FiltersState;
  onFilterChange: (name: string, value: any) => void;
  onClearFilters: () => void;
}

const ResourcesFilters: React.FC<ResourcesFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="relative w-full md:w-1/2">
          <SearchInput
            value={filters.searchQuery}
            onChange={(value) => onFilterChange("searchQuery", value)}
          />
        </div>
        <div className="flex gap-2 self-end">
          <Button variant="default" onClick={onClearFilters} size="sm">
            Clear Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
            size="sm"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 ${
          showFilters ? "block" : "hidden md:grid"
        }`}
      >
        <FieldSelector
          value={filters.field}
          onChange={(value) => onFilterChange("field", value)}
        />

        <SemesterSelector
          value={filters.semester}
          onChange={(value) => onFilterChange("semester", value)}
        />

        <SubjectSelector
          value={filters.subject}
          onChange={(value) => onFilterChange("subject", value)}
          fieldId={filters.field !== "all" ? filters.field : undefined}
          semester={
            typeof filters.semester === "number" ? filters.semester : undefined
          }
        />

        <ResourceTypeSelector
          value={filters.type}
          onChange={(value) => onFilterChange("type", value)}
        />
      </div>
    </div>
  );
};

export default ResourcesFilters;
