
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { partValidationSchema, validateFileUpload } from "@/lib/validation";

// Enhanced validation with comprehensive security checks
export const validatePartInput = (
  user: User | null, 
  title: string, 
  description: string,
  price: string, 
  condition: string, 
  compatibleCars: string[],
  image?: File | null
): { isValid: boolean; sanitizedData?: any; errors?: string[] } => {
  const errors: string[] = [];
  
  if (!user) {
    toast({
      title: "Authentication required",
      description: "You need to be logged in to create a listing"
    });
    return { isValid: false, errors: ["Authentication required"] };
  }
  
  // Validate and sanitize input data
  try {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      errors.push("Price must be a valid number");
    }
    
    const validationResult = partValidationSchema.safeParse({
      title,
      description,
      price: numericPrice,
      condition,
      compatibleCars
    });
    
    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors.map(err => err.message);
      errors.push(...validationErrors);
    }
    
    // Validate image if provided
    if (image) {
      const fileValidation = validateFileUpload(image);
      if (!fileValidation.isValid) {
        errors.push(fileValidation.error || "Invalid file");
      }
    }
    
    if (errors.length > 0) {
      toast({
        title: "Validation failed",
        description: errors[0]
      });
      return { isValid: false, errors };
    }
    
    return { 
      isValid: true, 
      sanitizedData: validationResult.data 
    };
    
  } catch (error) {
    console.error("Validation error:", error);
    toast({
      title: "Validation error",
      description: "Please check your input and try again"
    });
    return { isValid: false, errors: ["Validation failed"] };
  }
};
