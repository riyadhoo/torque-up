
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin } from "lucide-react";
import { CarProps } from "@/types/car";

interface CarRecommendationCardProps {
  car: CarProps;
}

export function CarRecommendationCard({ car }: CarRecommendationCardProps) {
  const getYearDisplay = (car: CarProps) => {
    if (car.production_start_year === car.production_end_year) {
      return car.production_start_year.toString();
    }
    return `${car.production_start_year}-${car.production_end_year}`;
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return imageUrl;
  };

  const getPriceRange = (basePrice: number) => {
    const startPrice = basePrice * 100;
    const endPrice = startPrice + 100000;
    return `${startPrice.toLocaleString()} - ${endPrice.toLocaleString()} DA`;
  };

  const imageUrl = getImageUrl(car.image_url);
  
  return (
    <Link to={`/cars/${car.id}`} className="block flex-shrink-0">
      <Card className="w-64 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 cursor-pointer">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${car.make} ${car.model}`} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="h-full w-full bg-muted flex items-center justify-center absolute inset-0"
            style={{ display: imageUrl ? 'none' : 'flex' }}
          >
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <Badge className="absolute top-2 right-2 bg-primary text-xs font-semibold">
            {getYearDisplay(car)}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="font-semibold text-base mb-2 truncate text-gray-800">
            {car.make} {car.model}
          </div>
          <div className="flex gap-1 mb-3 flex-wrap">
            <Badge variant="secondary" className="text-xs">{car.body_style}</Badge>
            <Badge variant="outline" className="text-xs">{car.drivetrain}</Badge>
          </div>
          {car.location && (
            <div className="flex items-center text-xs text-muted-foreground mb-3">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{car.location}</span>
            </div>
          )}
          <div className="text-sm font-bold text-primary break-words leading-tight">
            {getPriceRange(car.price)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
