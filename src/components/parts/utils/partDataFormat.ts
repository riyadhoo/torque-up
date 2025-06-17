import { supabase } from "@/integrations/supabase/client";

// Process compatible cars string into array
export const parseCompatibleCars = (compatibleCars: string): string[] => {
  return compatibleCars
    .split(',')
    .map(car => car.trim())
    .filter(car => car.length > 0);
};

// Format image URL from storage path to public URL
export const formatImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  
  // If the image URL is already a full URL, return it
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Otherwise, get the public URL from Supabase storage
  const { data } = supabase.storage.from('parts').getPublicUrl(imageUrl);
  return data.publicUrl;
};

export const getPartImageUrl = (image_url: string | null): string | null => {
  if (!image_url) {
    return null;
  }

  // Check if it's already a full URL
  if (image_url.startsWith('http')) {
    return image_url;
  }

  // Otherwise, get the public URL from Supabase storage
  const { data } = supabase.storage.from('parts').getPublicUrl(image_url);
  return data.publicUrl;
};

// Get avatar URL for profile picture
export const getAvatarUrl = (avatar_url: string | null): string | null => {
  if (!avatar_url) {
    return null;
  }

  // Check if it's already a full URL
  if (avatar_url.startsWith('http')) {
    return avatar_url;
  }

  // Otherwise, get the public URL from Supabase storage
  const { data } = supabase.storage.from('avatars').getPublicUrl(avatar_url);
  return data.publicUrl;
};
