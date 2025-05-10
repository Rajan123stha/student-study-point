import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { Resource } from "@/types/resource";
import { supabase } from "@/lib/supabase";
import FieldSelector from "@/components/resources/FieldSelector";
import ResourceTypeSelector from "@/components/resources/ResourceTypeSelector";
import SemesterSelector from "@/components/resources/SemesterSelector";
import SubjectSelector from "@/components/resources/SubjectSelector";

interface ResourceFormProps {
  resource?: Resource;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (name: string, value: any) => void;
  formTitle: string;
  submitLabel: string;
}

const ResourceForm = ({
  resource,
  onSubmit,
  onCancel,
  onChange,
  formTitle,
  submitLabel,
}: ResourceFormProps) => {
  const [formValues, setFormValues] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    type: resource?.type || "Notes",
    subject: resource?.subject || "",
    semester: resource?.semester || 1,
    fileUrl: resource?.fileUrl || "#",
    field: resource?.field || "",
    field_id: resource?.field_id || "",
  });

  // Important: Update form values when resource prop changes
  useEffect(() => {
    if (resource) {
      setFormValues({
        title: resource.title || "",
        description: resource.description || "",
        type: resource.type || "Notes",
        subject: resource.subject || "",
        semester: resource.semester || 1,
        fileUrl: resource.fileUrl || "#",
        field: resource.field || "",
        field_id: resource.field_id || "",
      });
    }
  }, [resource]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fields, setFields] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch fields once on component mount
    supabase
      .from("fields")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setFields(data || []);
        // If no initial value, set default
        if (!formValues.field_id && data && data[0]) {
          handleInputChange("field_id", data[0].id);
          handleInputChange("field", data[0].name);
        }
      });
    // eslint-disable-next-line
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // CRITICAL FIX: Don't set a blob URL, just mark that a file was selected
      // Actual upload will happen on form submission
      handleInputChange("fileSelected", true);
      handleInputChange("fileName", file.name);
    }
  };
  const handleInputChange = (name: string, value: any) => {
    console.log(`ResourceForm: Setting ${name} to:`, value);

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // CRITICAL FIX: Make sure the parent component knows about the change
    onChange(name, value);
  };

  const handleFieldChange = (fieldId: string) => {
    handleInputChange("field_id", fieldId);

    // Find field name and update it too
    const selectedField = fields.find((f) => f.id === fieldId);
    if (selectedField) {
      handleInputChange("field", selectedField.name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{formTitle}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onCancel}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title
              </label>
              <Input
                value={formValues.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                placeholder="Enter resource title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <Textarea
                className="min-h-[100px]"
                value={formValues.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
                placeholder="Enter resource description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FieldSelector
                value={formValues.field_id}
                onChange={handleFieldChange}
                label="Field of Study"
                includeAllOption={false}
              />

              <ResourceTypeSelector
                value={formValues.type}
                onChange={(value) => handleInputChange("type", value)}
                label="Type"
                includeAllOption={false}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SemesterSelector
                value={formValues.semester}
                onChange={(value) => handleInputChange("semester", value)}
                includeAllOption={false}
              />

              <SubjectSelector
                value={formValues.subject}
                onChange={(value) => handleInputChange("subject", value)}
                fieldId={formValues.field_id}
                semester={formValues.semester}
                includeAllOption={false}
              />
            </div>{" "}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-4">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {selectedFile
                  ? selectedFile.name
                  : resource?.fileUrl && resource.fileUrl !== "#"
                  ? "Current file: " + (resource.fileName || "Document")
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">PDF, DOCX, PPT up to 10MB</p>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx,.ppt,.pptx"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {resource?.fileUrl && resource.fileUrl !== "#" && !selectedFile
                  ? "Replace File"
                  : "Select File"}
              </Button>
              {resource?.fileUrl && resource.fileUrl !== "#" && (
                <div className="mt-2">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 underline"
                  >
                    View current file
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
