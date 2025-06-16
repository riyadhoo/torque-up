
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { validateFileUpload } from "@/lib/validation";

// Enhanced image upload with comprehensive security checks
export const uploadPartImage = async (image: File): Promise<string | null> => {
  try {
    // Validate file before upload
    const fileValidation = validateFileUpload(image);
    if (!fileValidation.isValid) {
      throw new Error(fileValidation.error || "Invalid file");
    }
    
    // Generate secure filename with timestamp and random string
    const fileExt = image.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = `parts/${fileName}`;
    
    console.log(`Uploading image to 'parts' bucket: ${filePath}`);
    
    // Upload with security headers
    const { error: uploadError } = await supabase.storage
      .from('parts')
      .upload(filePath, image, {
        cacheControl: '3600',
        upsert: false, // Don't allow overwriting
        contentType: image.type
      });
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
    
    // Verify upload was successful
    const { data: publicUrlData } = supabase.storage
      .from('parts')
      .getPublicUrl(filePath);
      
    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Failed to get public URL for uploaded image");
      throw new Error("Failed to get URL for uploaded image");
    }
    
    console.log("Image path stored:", filePath);
    console.log("Public image URL for display:", publicUrlData.publicUrl);
    
    return filePath;
  } catch (error: any) {
    console.error("Image processing error:", error);
    toast({
      title: "Image upload failed",
      description: error.message || "Failed to upload image"
    });
    return null;
  }
};
