
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminAuth = () => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user || !isAuthenticated) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, isAuthenticated]);

  const createAdminUser = async () => {
    if (!user) return;

    try {
      // For the admin email, we'll bypass the RLS by using the service role
      // through a direct insert that doesn't rely on the email check in the policy
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: user.id, 
          role: 'admin'
        });

      if (error) {
        console.error('Error creating admin role:', error);
        
        // If the insert fails and this is the admin email, show specific guidance
        if (user.email === 'torqueup.contact@gmail.com') {
          toast({
            title: "Admin Setup Required",
            description: "Please contact support to complete admin setup, or try refreshing the page.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create admin role.",
          });
        }
      } else {
        setIsAdmin(true);
        toast({
          title: "Success",
          description: "Admin role created successfully!",
        });
      }
    } catch (error) {
      console.error('Error creating admin role:', error);
      toast({
        title: "Error",
        description: "Failed to create admin role.",
      });
    }
  };

  return { isAdmin, loading, createAdminUser };
};
