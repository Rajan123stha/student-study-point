import React, { useEffect, useState } from "react";
import ResourceTable from "@/components/admin/ResourceTable";
import ResourceForm from "@/components/admin/ResourceForm";
import { supabase } from "@/lib/supabase";
import { Resource } from "@/types/resource";
import { toast } from "@/components/ui/use-toast";

export default function ResourcesAdmin() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = () => {
    setEditingResource(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    // Initialize form data with resource values
    setFormData({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      subject: resource.subject,
      semester: resource.semester,
      fileUrl: resource.fileUrl,
      field: resource.field,
      field_id: resource.field_id,
    });
    setShowForm(true);
  };

  const handleFormChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingResource) {
        // Update existing resource
        const { data, error } = await supabase
          .from("resources")
          .update(formData)
          .eq("id", editingResource.id)
          .select();

        if (error) throw error;

        // IMPORTANT FIX: Update the resources list with the updated resource
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource.id === editingResource.id
              ? (data[0] as Resource)
              : resource
          )
        );

        toast({
          title: "Resource updated",
          description: "The resource has been updated successfully.",
        });
      } else {
        // Create new resource
        const { data, error } = await supabase
          .from("resources")
          .insert(formData)
          .select();

        if (error) throw error;

        // Add the new resource to the list
        setResources((prev) => [data[0] as Resource, ...prev]);

        toast({
          title: "Resource created",
          description: "The resource has been created successfully.",
        });
      }

      // Close the form
      setShowForm(false);
      setEditingResource(null);
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: "There was an error saving the resource.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      const { error } = await supabase.from("resources").delete().eq("id", id);

      if (error) throw error;

      // Remove the resource from the list
      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      );

      toast({
        title: "Resource deleted",
        description: "The resource has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the resource.",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Resources</h1>
        <button
          onClick={handleCreateResource}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Add New Resource
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading resources...</div>
      ) : (
        <ResourceTable
          resources={resources}
          onEdit={handleEditResource}
          onDelete={handleDeleteResource}
        />
      )}

      {showForm && (
        <ResourceForm
          resource={editingResource || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          onChange={handleFormChange}
          formTitle={editingResource ? "Edit Resource" : "Add New Resource"}
          submitLabel={editingResource ? "Update" : "Create"}
        />
      )}
    </div>
  );
}
