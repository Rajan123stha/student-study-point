
import { useState, useEffect, useMemo } from 'react';
import { Resource } from '@/types/resource';
import { useFields } from './useFields';
import { ALL_TYPES_VALUE } from '@/constants/resourceTypes';

interface FiltersState {
  semester: string | number;
  subject: string;
  type: string;
  searchQuery: string;
  field: string;
}

interface UseResourceFilteringProps {
  allResources: Resource[];
}

export const useResourceFiltering = ({ allResources }: UseResourceFilteringProps) => {
  const [filters, setFilters] = useState<FiltersState>({
    semester: "all",
    subject: "all",
    type: ALL_TYPES_VALUE,
    searchQuery: "",
    field: "all",
  });
  const [filteredResources, setFilteredResources] = useState<Resource[]>(allResources);
  const { fields } = useFields();

  // Apply filters
  useEffect(() => {
    let results = [...allResources];

    if (filters.field && filters.field !== 'all') {
      // Match against field name (not id)
      const fieldObj = fields.find(f => f.id === filters.field);
      if (fieldObj) {
        results = results.filter(
          (resource) => resource.field === fieldObj.name
        );
      }
    }

    if (filters.semester && filters.semester !== 'all') {
      results = results.filter(
        (resource) => resource.semester === parseInt(filters.semester.toString())
      );
    }

    if (filters.subject && filters.subject !== 'all') {
      results = results.filter(
        (resource) => resource.subject === filters.subject
      );
    }

    if (filters.type && filters.type !== ALL_TYPES_VALUE) {
      results = results.filter(
        (resource) => resource.type === filters.type
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
      );
    }

    setFilteredResources(results);
  }, [filters, allResources, fields]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      semester: "all",
      subject: "all",
      type: ALL_TYPES_VALUE,
      searchQuery: "",
      field: "all",
    });
  };

  return {
    filters,
    filteredResources,
    handleFilterChange,
    clearFilters
  };
};
