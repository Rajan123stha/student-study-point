
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X, ChevronLeft, ChevronRight, FileX, Loader } from 'lucide-react';
import { Resource } from "@/types/resource";

interface ResourcePreviewProps {
  resource: Resource;
  onClose: () => void;
}

const ResourcePreview = ({ resource, onClose }: ResourcePreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [previewAvailable, setPreviewAvailable] = useState(true);
  const [fileType, setFileType] = useState<string>('unknown');
  const MAX_PREVIEW_PAGES = 5;

  useEffect(() => {
    const checkFileDetails = async () => {
      try {
        setIsLoading(true);
        
        // Check if URL is a blob URL or placeholder
        const isBlobUrl = resource.fileUrl.startsWith('blob:');
        const isPlaceholder = resource.fileUrl === '#';
        
        // Determine file type from extension
        const url = resource.fileUrl.toLowerCase();
        let type = 'unknown';
        
        if (url.endsWith('.pdf')) type = 'pdf';
        else if (url.endsWith('.docx') || url.endsWith('.doc')) type = 'doc';
        else if (url.endsWith('.ppt') || url.endsWith('.pptx')) type = 'ppt';
        else if (url.endsWith('.txt')) type = 'txt';
        
        setFileType(type);
        
        // Skip fetch for blob URLs as they can't be fetched with HEAD requests
        if (!isBlobUrl && !isPlaceholder && !url.startsWith('data:')) {
          try {
            // Only attempt to fetch for URLs that are not blob:, #, or data: URLs
            const response = await fetch(resource.fileUrl, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');
            
            // Update file type based on content type if available
            if (contentType) {
              if (contentType.includes('pdf')) type = 'pdf';
              else if (contentType.includes('word') || contentType.includes('docx')) type = 'doc';
              else if (contentType.includes('powerpoint') || contentType.includes('pptx')) type = 'ppt';
              else if (contentType.includes('text')) type = 'txt';
              
              setFileType(type);
            }
          } catch (error) {
            console.error('Error fetching remote file details:', error);
            // Continue with the type determined from the URL
          }
        }
        
        // Determine if preview is available
        if (isPlaceholder) {
          setPreviewAvailable(false);
        } else if (type === 'pdf') {
          // For PDF files, we can try to show a preview
          setTotalPages(Math.min(MAX_PREVIEW_PAGES, 5)); // Default to 5 pages or max preview pages
          setPreviewAvailable(!isBlobUrl); // Only if not a blob URL
        } else if (type === 'txt') {
          setTotalPages(1);
          setPreviewAvailable(true);
        } else {
          setTotalPages(1);
          setPreviewAvailable(type !== 'unknown');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking file details:", error);
        setPreviewAvailable(false);
        setIsLoading(false);
      }
    };
    
    checkFileDetails();
  }, [resource.fileUrl]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading preview...</p>
        </div>
      );
    }

    if (!previewAvailable) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FileX className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Preview not available</h3>
          <p className="text-gray-600 mb-4 max-w-md">
            {resource.fileUrl.startsWith('blob:') ? 
              'Preview is not available for locally generated files.' :
              resource.fileUrl === '#' ?
              'This is a sample resource with no actual file attached.' :
              'This file type is not supported for online preview.'}
          </p>
          <p className="text-gray-600 mb-6">Please download to view the content.</p>
          <Button asChild variant="default">
            <a href={resource.fileUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download File
            </a>
          </Button>
        </div>
      );
    }

    if (fileType === 'pdf') {
      return (
        <iframe 
          src={`${resource.fileUrl}#toolbar=0&navpanes=0&page=${currentPage}`} 
          className="w-full h-full border-0"
          title={resource.title}
        />
      );
    } else if (fileType === 'doc') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-xl">
            <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
            <p className="mb-6 text-gray-600">{resource.description}</p>
            <div className="mb-6">
              <p className="font-medium">Document Information:</p>
              <p>Type: Word Document</p>
              <p>Subject: {resource.subject}</p>
              <p>Semester: {resource.semester}</p>
            </div>
            <p className="mb-4 text-amber-600">Preview for Word documents is limited. Please download for best experience.</p>
            <img 
              src="/placeholder.svg" 
              alt="Document preview" 
              className="w-1/3 mx-auto mb-4 opacity-50"
            />
          </div>
        </div>
      );
    } else if (fileType === 'ppt') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-xl">
            <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
            <p className="mb-6 text-gray-600">{resource.description}</p>
            <div className="mb-6">
              <p className="font-medium">Presentation Information:</p>
              <p>Type: PowerPoint Presentation</p>
              <p>Subject: {resource.subject}</p>
              <p>Semester: {resource.semester}</p>
            </div>
            <p className="mb-4 text-amber-600">Preview for PowerPoint presentations is limited. Please download for best experience.</p>
            <img 
              src="/placeholder.svg" 
              alt="Presentation preview" 
              className="w-1/3 mx-auto mb-4 opacity-50"
            />
          </div>
        </div>
      );
    } else if (fileType === 'txt') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-xl">
            <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
            <p className="mb-6 text-gray-600">{resource.description}</p>
            <div className="mb-6">
              <p className="font-medium">Text Document Information:</p>
              <p>Type: Text File</p>
              <p>Subject: {resource.subject}</p>
              <p>Semester: {resource.semester}</p>
            </div>
            <p className="mb-4">Plain text content is available after download.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-xl">
            <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
            <p className="mb-6 text-gray-600">{resource.description}</p>
            <div className="mb-6">
              <p className="font-medium">File Information:</p>
              <p>Type: {resource.type}</p>
              <p>Subject: {resource.subject}</p>
              <p>Semester: {resource.semester}</p>
            </div>
            <p className="mb-4 text-amber-600">Preview not available for this file type.</p>
            <img 
              src="/placeholder.svg" 
              alt="No preview" 
              className="w-1/3 mx-auto mb-4 opacity-50"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{resource.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-auto p-4 bg-gray-100">
            {renderPreviewContent()}
          </div>
          
          <div className="p-4 border-t flex justify-between items-center bg-white">
            {previewAvailable && !isLoading && totalPages > 1 ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                  {totalPages === MAX_PREVIEW_PAGES && ' (preview limit)'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div></div>
            )}
            
            <Button asChild>
              <a href={resource.fileUrl} download>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreview;
