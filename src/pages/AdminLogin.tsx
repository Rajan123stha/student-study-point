import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authenticateAdmin } from "@/services/mongodb";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const isAuthenticated = await authenticateAdmin(email, password);

      if (isAuthenticated) {
        // Store authentication state in localStorage for persistence
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminEmail", email);

        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-14 px-6 sm:px-8 lg:px-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage resources
            </p>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-md flex items-start space-x-2 text-sm text-red-600 border border-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studypoint.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
                {!isLoading && <Lock className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            {/* <div className="text-center text-sm">
              <p className="text-gray-500">Demo Credentials:</p>
              <p className="text-gray-700">
                Email: admin@studypoint.com
                <br />
                Password: password123
              </p>
            </div> */}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
