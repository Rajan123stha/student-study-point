
import React from 'react';

interface ResourcesHeaderProps {
  title?: string;
  description?: string;
}

const ResourcesHeader: React.FC<ResourcesHeaderProps> = ({
  title = "Academic Resources",
  description = "Browse and download study materials, past exam questions, notes, and syllabi across multiple fields of study."
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4 gradient-heading">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ResourcesHeader;
