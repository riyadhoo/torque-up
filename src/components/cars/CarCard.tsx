
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Star } from "lucide-react";
import { CarProps } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: CarProps;
}

export function CarCard({ car }: CarCardProps) {
  const { t, formatPrice } = useLanguage();

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
    const startPrice = basePrice * 100; // Add two zeros
    const endPrice = startPrice + 100000; // Add 100,000 DA
    return `${startPrice.toLocaleString()} - ${endPrice.toLocaleString()} DA`;
  };

  const imageUrl = getImageUrl(car.image_url);
  
  return (
    <Link to={`/cars/${car.id}`} className="h-full">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${car.make} ${car.model}`} 
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error('Failed to load image:', imageUrl);
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
            <Car className="h-12 w-12 text-muted-foreground" />
          </div>
          <Badge className="absolute top-2 right-2 bg-primary">
            {getYearDisplay(car)}
          </Badge>
        </div>
        
        <CardContent className="flex-grow py-4">
          <div className="font-semibold text-lg mb-2">{car.make} {car.model}</div>
          <div className="flex gap-2 mb-3 flex-wrap">
            {car.category && (
              <Badge variant="default">{car.category}</Badge>
            )}
            <Badge variant="secondary">{car.body_style || t('common.unknown')}</Badge>
            <Badge variant="outline">{car.drivetrain || t('common.unknown')}</Badge>
          </div>
          <div className="text-muted-foreground text-sm mb-2">
            {car.engine_type || t('common.unknown')} • {car.transmission_type || t('common.unknown')}
          </div>
          {car.mileage && (
            <div className="text-sm text-muted-foreground mb-2">
              {car.mileage.toLocaleString()} {t('cars.miles')}
            </div>
          )}
          {car.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {car.location}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 border-t flex justify-between items-center">
          <div className="text-xl font-bold text-primary">{getPriceRange(car.price)}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
            <span>{t('cars.rateReview')}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
