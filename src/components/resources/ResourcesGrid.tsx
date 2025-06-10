
import React from 'react';
import { Button } from "@/components/ui/button";
import ResourceCard from "@/components/ResourceCard";
import { Resource } from "@/types/resource";

interface ResourcesGridProps {
  resources: Resource[];
  isLoading: boolean;
  onClearFilters: () => void;
}

const ResourcesGrid: React.FC<ResourcesGridProps> = ({
  resources,
  isLoading,
  onClearFilters
}) => {
  if (isLoading) {
    return <div className="text-center py-12">Loading resources...</div>;
  }
  
  if (resources.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg mb-8">
        <p className="text-gray-500 mb-4">No matching resources found.</p>
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourcesGrid;
