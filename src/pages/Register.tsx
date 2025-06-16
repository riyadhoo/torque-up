
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "next-themes";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Navbar from "@/components/layout/Navbar";

export default function Register() {
  const {
    isAuthenticated,
    loading,
    user
  } = useAuth();
  const {
    theme
  } = useTheme();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    // Redirect admin users to dashboard, others to home
    if (user?.email === 'torqueup.contact@gmail.com') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4 pt-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src={theme === "dark" ? "/lovable-uploads/ba58edb5-dff5-4ea5-bd20-8b0c24778236.png" : "/lovable-uploads/594eaa5f-e144-4765-a223-97488be4538e.png"} 
                alt="TorqueUp Logo" 
                className="h-16 w-auto" 
              />
            </div>
            <p className="text-muted-foreground">Create your TorqueUp account</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
