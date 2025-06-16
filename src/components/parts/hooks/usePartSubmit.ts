
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useEnhancedAuth } from "@/lib/securityAuth";
import { validatePartInput } from "../utils/enhancedPartValidation";
import { uploadPartImage } from "../utils/securePartImageUpload";
import { insertPartData } from "../utils/partDataAccess";

export const usePartSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useEnhancedAuth();
  const navigate = useNavigate();

  const submitPart = async (
    title: string,
    description: string,
    price: string,
    condition: string,
    compatibleCars: string[],
    image: File | null
  ) => {
    setIsSubmitting(true);
    
    try {
      // Enhanced validation with security checks
      const validation = validatePartInput(
        user, 
        title, 
        description, 
        price, 
        condition, 
        compatibleCars, 
        image
      );
      
      if (!validation.isValid) {
        console.log("Validation failed:", validation.errors);
        return false;
      }

      console.log("Part validation passed:", validation.sanitizedData);
      
      // Secure image upload
      let imageUrl: string | null = null;
      if (image) {
        console.log("Uploading image with security checks...");
        imageUrl = await uploadPartImage(image);
        if (!imageUrl) {
          console.log("Image upload failed");
          return false;
        }
      }

      // Use sanitized data from validation
      const sanitizedData = validation.sanitizedData!;
      
      // Insert part data with sanitized inputs
      await insertPartData(
        sanitizedData.title,
        sanitizedData.description || "",
        sanitizedData.price,
        sanitizedData.condition,
        sanitizedData.compatibleCars,
        imageUrl,
        user!.id
      );

      toast({
        title: "Success",
        description: "Part listing created successfully! It will be reviewed before being published."
      });

      navigate("/parts");
      return true;
    } catch (error: any) {
      console.error("Error creating part:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create part listing"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPart, isSubmitting };
};
