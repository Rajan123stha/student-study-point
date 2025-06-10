import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  BookMarked,
  Calendar,
  Eye,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Resource } from "@/types/resource";
import ResourcePreview from "./ResourcePreview";

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const [showPreview, setShowPreview] = useState(false);

  // Get icon based on resource type
  const getIcon = () => {
    switch (resource.type) {
      case "Notes":
        return <BookOpen className="h-5 w-5" />;
      case "Questions":
        return <FileText className="h-5 w-5" />;
      case "Syllabus":
        return <BookMarked className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Get color based on resource type
  const getColorClass = () => {
    switch (resource.type) {
      case "Notes":
        return "bg-primary/10 text-primary";
      case "Questions":
        return "bg-secondary/10 text-secondary";
      case "Syllabus":
        return "bg-accent/10 text-accent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
        <div className="p-4 border-b flex justify-between items-start">
          <div className={`p-2 rounded-lg ${getColorClass()}`}>{getIcon()}</div>
          <span
            className={`text-xs font-medium py-1 px-2 rounded-full ${getColorClass()}`}
          >
            {resource.type}
          </span>
        </div>

        <CardContent className="flex-grow p-4">
          <Link to={`/resources/${resource.id}`} className="block">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
              {resource.title}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {resource.description}
          </p>

          <div className="mt-auto">
            <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
              <span className="flex items-center">{resource.field}</span>
              <span>•</span>
              <span>{resource.subject}</span>
              <span>•</span>
              <span>Semester {resource.semester}</span>
            </div>

            <div className="text-xs text-gray-500 mt-2 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(resource.uploadDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Button variant="default" size="sm" className="w-full" asChild>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </CardFooter>
      </Card>

      {showPreview && (
        <ResourcePreview
          resource={resource}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default ResourceCard;
