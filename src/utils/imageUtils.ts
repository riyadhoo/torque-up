
export const getImageUrl = (imagePath: string | null, fallbackUrl?: string): string => {
  if (!imagePath) {
    return fallbackUrl || '/placeholder.svg';
  }
  
  // Handle Lovable uploads
  if (imagePath.startsWith('/lovable-uploads/')) {
    return imagePath;
  }
  
  // Handle Supabase storage URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle relative paths
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  return fallbackUrl || '/placeholder.svg';
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== '/placeholder.svg') {
    target.src = '/placeholder.svg';
  }
};
