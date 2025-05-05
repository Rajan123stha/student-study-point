
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ResourceTable from '@/components/admin/ResourceTable';
import ResourceForm from '@/components/admin/ResourceForm';
import ResourceFilter from '@/components/admin/ResourceFilter';
import { Resource } from '@/types/resource';
import { createResource, updateResource, deleteResource } from '@/services/mongodb';
import { ALL_TYPES_VALUE } from '@/constants/resourceTypes';

interface ResourcesTabProps {
  resources: Resource[];
  isLoading: boolean;
}

const ResourcesTab = ({ resources, isLoading }: ResourcesTabProps) => {
  const { toast } = useToast();
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'Notes',
    subject: 'Computer Programming',
    semester: 1,
    fileUrl: '#',
    file: null,
    field: 'BCA'
  });

  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    semester: '' as number | '',
    search: '',
    field: '',
  });

  React.useEffect(() => {
    // Update filtered resources when the main resources array changes
    setFilteredResources(resources);
  }, [resources]);

  React.useEffect(() => {
    let result = [...resources];
    
    if (filters.field && filters.field !== 'all') {
      result = result.filter(resource => resource.field === filters.field);
      console.log('Filtered by field:', resources[0]);
    }
    
    if (filters.type && filters.type !== ALL_TYPES_VALUE) {
      result = result.filter(resource => resource.type === filters.type);
      console.log('Filtered by type:', filters);
    }
    
    if (filters.subject && filters.subject !== 'all') {
      result = result.filter(resource => resource.subject === filters.subject);
    }
    
    if (filters.semester !== '') {
      // Fix: Convert filters.semester to number for comparison when it's a string number
      const semesterValue = typeof filters.semester === 'string' ? 
        filters.semester === 'all' ? 'all' : parseInt(filters.semester) : 
        filters.semester;
        
      if (semesterValue !== 'all' && typeof semesterValue === 'number') {
        result = result.filter(resource => resource.semester === semesterValue);
      }
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredResources(result);
  }, [resources, filters]);

  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      subject: '',
      semester: '',
      search: '',
      field: '',
    });
  };

  const handleEditClick = (resource: Resource) => {
    setCurrentResource({...resource});
    setIsEditModalOpen(true);
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentResource) return;
    
    try {
      const updated = await updateResource(currentResource.id, currentResource);
      
      if (updated) {
        setFilteredResources(filteredResources.map(resource => 
          resource.id === currentResource.id ? {...currentResource} : resource
        ));
        
        toast({
          title: "Resource updated",
          description: "The resource has been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive"
      });
    }
    
    setIsEditModalOpen(false);
    setCurrentResource(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const created = await createResource({
        title: newResource.title,
        description: newResource.description,
        type: newResource.type,
        subject: newResource.subject,
        semester: newResource.semester,
        fileUrl: newResource.fileUrl || "#",
        field: newResource.field
      });
      
      setFilteredResources([created, ...filteredResources]);
      
      toast({
        title: "Resource uploaded",
        description: "The resource has been successfully added.",
      });
      
      setIsUploadModalOpen(false);
      setNewResource({
        title: '',
        description: '',
        type: 'Notes',
        subject: 'Computer Programming',
        semester: 1,
        fileUrl: '#',
        file: null,
        field: 'BCA'
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResource(id);
      setFilteredResources(filteredResources.filter(resource => resource.id !== id));
      toast({
        title: "Resource deleted",
        description: "The resource has been removed.",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      });
    }
  };

  const handleNewResourceChange = (name: string, value: any) => {
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditResourceChange = (name: string, value: any) => {
    if (currentResource) {
      setCurrentResource(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Manage Resources</h2>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <ResourceFilter 
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={resetFilters}
        filters={filters}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading resources...</div>
      ) : filteredResources.length > 0 ? (
        <ResourceTable 
          resources={filteredResources} 
          onEdit={handleEditClick} 
          onDelete={handleDelete} 
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          {resources.length > 0 
            ? "No resources found with the current filters."
            : "No resources found. Add your first resource using the \"Add Resource\" button."
          }
        </div>
      )}

      {isUploadModalOpen && (
        <ResourceForm
          onSubmit={handleUpload}
          onCancel={() => setIsUploadModalOpen(false)}
          onChange={handleNewResourceChange}
          formTitle="Upload New Resource"
          submitLabel="Upload Resource"
        />
      )}

      {isEditModalOpen && currentResource && (
        <ResourceForm
          resource={currentResource}
          onSubmit={handleUpdateResource}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentResource(null);
          }}
          onChange={handleEditResourceChange}
          formTitle="Edit Resource"
          submitLabel="Update Resource"
        />
      )}
    </>
  );
};

export default ResourcesTab;
