import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useMongoDBContext } from "@/contexts/MongoDBContext";
import { getResources } from "@/services/mongodb";
import { Resource } from "@/types/resource";

// Import our new components
import ResourcesHeader from "@/components/resources/ResourcesHeader";
import ResourcesFilters from "@/components/resources/ResourcesFilters";
import ResourcesGrid from "@/components/resources/ResourcesGrid";
import ResourcesPagination from "@/components/resources/ResourcesPagination";
import { useResourceFiltering } from "@/hooks/useResourceFiltering";
import { usePagination } from "@/hooks/usePagination";
import { ALL_TYPES_VALUE } from "@/constants/resourceTypes";

const Resources = () => {
  const { toast } = useToast();
  const { refreshResources } = useMongoDBContext();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Custom hooks for filtering and pagination
  const { filters, filteredResources, handleFilterChange, clearFilters } =
    useResourceFiltering({ allResources: resources });

  const resourcesPerPage = 20;
  const {
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    handlePageChange,
  } = usePagination({
    totalItems: filteredResources.length,
    itemsPerPage: resourcesPerPage,
  });

  // Current resources to display
  const currentResources = filteredResources.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await getResources();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast({
          title: "Error",
          description: "Failed to load resources",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 sm:px-8 lg:px-12 py-16 mt-4">
        <ResourcesHeader />

        <ResourcesFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <div className="mb-6">
          {isLoading ? (
            <p className="text-center py-8">Loading resources...</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {filteredResources.length}{" "}
                {filteredResources.length === 1 ? "Resource" : "Resources"}{" "}
                Found
              </h2>
              {totalPages > 0 && (
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredResources.length)} of{" "}
                  {filteredResources.length} resources
                </p>
              )}
            </>
          )}
        </div>

        <ResourcesGrid
          resources={currentResources}
          isLoading={isLoading}
          onClearFilters={clearFilters}
        />

        <ResourcesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
