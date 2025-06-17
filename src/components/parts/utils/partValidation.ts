import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { validatePartInput } from "./enhancedPartValidation";

// Re-export the enhanced validation for backwards compatibility
export { validatePartInput };

// Keep the original function for any existing imports
export const validatePartInputLegacy = (user: User | null, title: string, price: string, condition: string): boolean => {
  if (!user) {
    toast({
      title: "Authentication required",
      description: "You need to be logged in to create a listing"
    });
    return false;
  }
  
  if (!title || !price || !condition) {
    toast({
      title: "Missing fields",
      description: "Please fill in all required fields"
    });
    return false;
  }
  
  return true;
};
