
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { CarDetailProps } from "@/types/car";

interface CarHeaderProps {
  car: CarDetailProps;
}

export function CarHeader({ car }: CarHeaderProps) {
  const getYearDisplay = () => {
    if (car.production_start_year === car.production_end_year) {
      return car.production_start_year.toString();
    }
    return `${car.production_start_year}-${car.production_end_year}`;
  };

  const getPriceRange = (basePrice: number) => {
    const startPrice = basePrice * 100; // Add two zeros
    const endPrice = startPrice + 100000; // Add 100,000 DA
    return `${startPrice.toLocaleString()} - ${endPrice.toLocaleString()} DA`;
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{getYearDisplay()} {car.make} {car.model}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge>{car.body_style}</Badge>
        <Badge variant="outline">{car.drivetrain}</Badge>
        <Badge variant="outline">{car.transmission_type}</Badge>
        {car.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {car.location}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-4">{getPriceRange(car.price)}</div>
    </div>
  );
}
