import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Layers } from "lucide-react";
import { Resource } from "@/types/resource";
import { getResources } from "@/services/mongodb";

import AdminHeader from "@/components/admin/AdminHeader";
import ResourcesTab from "@/components/admin/ResourcesTab";
import FieldsManager from "@/components/admin/FieldsManager";
import SubjectsManager from "@/components/admin/SubjectsManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
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

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-2 md:px-6 py-4">
        <Tabs
          defaultValue="resources"
          className="bg-white rounded-lg shadow-md p-4 md:p-8 mx-4 sm:mx-4"
        >
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="resources" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              <span>Fields</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Subjects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <ResourcesTab resources={resources} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="fields">
            <FieldsManager />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
