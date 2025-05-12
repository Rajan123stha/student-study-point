import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-lg md:text-xl font-bold ">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/register")}
            className="hidden sm:flex"
          >
            Register New Admin
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
