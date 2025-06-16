
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Upload image and get file path
export const uploadPartImage = async (image: File): Promise<string | null> => {
  try {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log(`Uploading image to 'parts' bucket: ${filePath}`);
    
    // Direct upload without checking bucket existence first
    const { error: uploadError } = await supabase.storage
      .from('parts')
      .upload(filePath, image, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
    
    // Get public URL for the image
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
