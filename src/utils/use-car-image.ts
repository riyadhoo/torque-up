import { supabase } from "@/integrations/supabase/client";

export const useCarImage = () => {
  const getCarImageUrl = (image_url: string | null): string | null => {
    if (!image_url) {
      return null;
    }

    // Check if it's already a full URL
    if (image_url.startsWith('http')) {
      return image_url;
    }

    // Otherwise, get the public URL from Supabase storage
    const { data } = supabase.storage.from('cars').getPublicUrl(image_url);
    return data.publicUrl;
  };
  
  return { getCarImageUrl };
};
