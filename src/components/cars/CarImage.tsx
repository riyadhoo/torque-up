
import { Car } from "lucide-react";
import { CarDetailProps } from "@/types/car";

interface CarImageProps {
  car: CarDetailProps;
}

export function CarImage({ car }: CarImageProps) {
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    // If the URL starts with /uploads/, it's a local upload
    if (imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, assume it's a relative path
    return imageUrl;
  };

  const imageUrl = getImageUrl(car.image_url);

  return (
    <div className="rounded-lg overflow-hidden mb-8">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-auto object-cover max-h-[500px]"
          onError={(e) => {
            console.error('Failed to load image:', imageUrl);
            // Hide the broken image and show fallback
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className="w-full aspect-video bg-muted flex items-center justify-center"
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        <Car className="h-24 w-24 text-muted-foreground" />
      </div>
    </div>
  );
}
