
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { Resource } from "@/types/resource";

interface ResourceTableProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (id: number) => void;
}

const ResourceTable = ({ resources, onEdit, onDelete }: ResourceTableProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Field</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="font-semibold">Semester</TableHead>
            <TableHead className="font-semibold">Date Added</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{resource.title}</TableCell>
              <TableCell>{resource.field || "BCA"}</TableCell>
              <TableCell>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full 
                  ${resource.type === "Notes" ? "bg-primary/10 text-primary" : 
                    resource.type === "Questions" ? "bg-secondary/10 text-secondary" : 
                    resource.type === "Syllabus" ? "bg-accent/10 text-accent" : 
                    "bg-gray-100 text-gray-600"}`}>
                  {resource.type}
                </span>
              </TableCell>
              <TableCell>{resource.subject}</TableCell>
              <TableCell>Semester {resource.semester}</TableCell>
              <TableCell>{resource.uploadDate}</TableCell>
              <TableCell>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(resource)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(resource.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResourceTable;
