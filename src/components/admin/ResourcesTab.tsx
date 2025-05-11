import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ResourceTable from "@/components/admin/ResourceTable";
import ResourceForm from "@/components/admin/ResourceForm";
import ResourceFilter from "@/components/admin/ResourceFilter";
import { Resource } from "@/types/resource";
import {
  createResource,
  updateResource,
  deleteResource,
} from "@/services/mongodb";
import { ALL_TYPES_VALUE } from "@/constants/resourceTypes";

interface ResourcesTabProps {
  resources: Resource[];
  isLoading: boolean;
}

const ResourcesTab = ({ resources, isLoading }: ResourcesTabProps) => {
  const { toast } = useToast();
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(resources);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);

  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "",
    subject: "",
    semester: 1,
    fileUrl: "#",
    file: null,
    field: "",
    field_id: "",
  });

  const [filters, setFilters] = useState({
    type: "",
    subject: "",
    semester: "" as number | "",
    search: "",
    field: "",
  });

  React.useEffect(() => {
    // Update filtered resources when the main resources array changes
    setFilteredResources(resources);
  }, [resources]);

  React.useEffect(() => {
    let result = [...resources];
    if (filters.field && filters.field !== "all") {
      // FIXED: Compare field_id with filters.field (which is the ID)
      // OR compare field name with proper field name from a lookup
      // console.log("Filtering by field ID:", filters.field);
      result = result.filter((resource) => resource.field_id === filters.field);

      // console.log("Filtered resource:", resources[0]);
      // console.log("Filtered data:", resources[0]);
      // console.log("Filtered by filter:", filters.field);
    }

    if (filters.type && filters.type !== ALL_TYPES_VALUE) {
      result = result.filter((resource) => resource.type === filters.type);
      // console.log("Filtered by type:", filters);
    }

    if (filters.subject && filters.subject !== "all") {
      result = result.filter(
        (resource) => resource.subject === filters.subject
      );
    }

    if (filters.semester !== "") {
      // Fix: Convert filters.semester to number for comparison when it's a string number
      const semesterValue =
        typeof filters.semester === "string"
          ? filters.semester === "all"
            ? "all"
            : parseInt(filters.semester)
          : filters.semester;

      if (semesterValue !== "all" && typeof semesterValue === "number") {
        result = result.filter(
          (resource) => resource.semester === semesterValue
        );
      }
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredResources(result);
  }, [resources, filters]);

  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      subject: "",
      semester: "",
      search: "",
      field: "",
    });
  };

  const handleEditClick = (resource: Resource) => {
    setCurrentResource({ ...resource });
    setIsEditModalOpen(true);
  };
  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentResource) return;

    try {
      // console.log("Attempting to update resource:", currentResource);
      // Check if we have a new file to upload
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      let fileUrl = currentResource.fileUrl;

      // Upload the file first if one was selected during edit
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Use the current resource ID for the file name
        const { uploadResourceFile } = await import("@/services/mongodb");
        fileUrl = await uploadResourceFile(file, currentResource.id.toString());

        // Update the fileUrl in the current resource
        currentResource.fileUrl = fileUrl;
        // Store file name for display purposes only (not for database)
        currentResource.fileName = file.name;
      }

      // CRITICAL FIX: Remove field_id, fields and other non-DB fields from the update data
      const { field_id, fields, fileName, fileSelected, ...cleanResource } =
        currentResource;

      // Use the cleaned resource data for the update
      const updated = await updateResource(currentResource.id, cleanResource);

      if (updated) {
        // Update the local state with the updated resource
        setFilteredResources((prevResources) =>
          prevResources.map((resource) =>
            resource.id === currentResource.id ? updated : resource
          )
        );

        toast({
          title: "Resource updated",
          description: "The resource has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    }

    setIsEditModalOpen(false);
    setCurrentResource(null);
  };
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if we have a file to upload
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      let fileUrl = newResource.fileUrl || "#";

      // Upload the file first if one was selected
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // Generate a temporary ID for the file name (will be replaced with the actual resource ID)
        const tempId = `temp_${Date.now()}`;

        // Import the upload function
        const { uploadResourceFile } = await import("@/services/mongodb");
        fileUrl = await uploadResourceFile(file, tempId);
      }

      // Create the resource with the file URL from Supabase
      const created = await createResource({
        title: newResource.title,
        description: newResource.description,
        type: newResource.type,
        subject: newResource.subject,
        semester: newResource.semester,
        fileUrl: fileUrl,
        field: newResource.field,
        field_id: newResource.field_id,
      });

      setFilteredResources([created, ...filteredResources]);

      toast({
        title: "Resource uploaded",
        description: "The resource has been successfully added.",
      });

      setIsUploadModalOpen(false);
      setNewResource({
        title: "",
        description: "",
        type: "Notes",
        subject: "Computer Programming",
        semester: 1,
        fileUrl: "#",
        file: null,
        field: "BCA",
        field_id: "",
      });
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResource(id);
      setFilteredResources(
        filteredResources.filter((resource) => resource.id !== id)
      );
      toast({
        title: "Resource deleted",
        description: "The resource has been removed.",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    }
  };

  const handleNewResourceChange = (name: string, value: any) => {
    setNewResource((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditResourceChange = (name: string, value: any) => {
    if (currentResource) {
      setCurrentResource((prev) => ({
        ...prev!,
        [name]: value,
      }));

      // For debugging
      // console.log(`Changed ${name} to:`, value);
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
            : 'No resources found. Add your first resource using the "Add Resource" button.'}
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
