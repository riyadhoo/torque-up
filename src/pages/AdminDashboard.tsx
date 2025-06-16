
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminStatsOverview } from "@/components/admin/AdminStatsOverview";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { AdminPartsManager } from "@/components/admin/AdminPartsManager";
import { AdminCarsManager } from "@/components/admin/AdminCarsManager";
import { AdminMessagesViewer } from "@/components/admin/AdminMessagesViewer";
import { NavbarLogo } from "@/components/layout/NavbarLogo";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Users, Car, MessageSquare, Package, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, loading, createAdminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [hasTriedBootstrap, setHasTriedBootstrap] = useState(false);

  // Auto-assign admin role to torqueup.contact@gmail.com
  useEffect(() => {
    if (user && user.email === "torqueup.contact@gmail.com" && !isAdmin && !loading && !hasTriedBootstrap) {
      setHasTriedBootstrap(true);
      createAdminUser();
    }
  }, [user, isAdmin, loading, createAdminUser, hasTriedBootstrap]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Shield className="h-6 w-6 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {user?.email === 'torqueup.contact@gmail.com' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Admin setup is required. Click the button below to create your admin role.
                </p>
                <Button 
                  onClick={() => {
                    setHasTriedBootstrap(false);
                    createAdminUser();
                  }}
                  className="w-full"
                >
                  Create Admin Role
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  To become an admin, please sign up with: <strong>torqueup.contact@gmail.com</strong>
                </p>
                <Button onClick={() => window.location.href = "/login"}>
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "parts", label: "Parts", icon: Package },
    { id: "cars", label: "Cars", icon: Car },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminStatsOverview />;
      case "users":
        return <AdminUsersManager />;
      case "parts":
        return <AdminPartsManager />;
      case "cars":
        return <AdminCarsManager />;
      case "messages":
        return <AdminMessagesViewer />;
      default:
        return <AdminStatsOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <NavbarLogo />
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-semibold">Admin Dashboard</h2>
                <Badge variant="destructive" className="text-xs">Admin</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Welcome, {user?.email}
            </p>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          onClick={() => setActiveTab(item.id)}
                          isActive={activeTab === item.id}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="ml-auto">
              <h1 className="text-lg font-semibold">
                {menuItems.find(item => item.id === activeTab)?.label || "Overview"}
              </h1>
            </div>
          </header>
          
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
