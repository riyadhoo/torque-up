
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gauge, BarChart3, Car, User, Fuel, Box, Ruler } from "lucide-react";
import { CarDetailProps } from "@/types/car";

interface CarSpecificationsProps {
  car: CarDetailProps;
}

export function CarSpecifications({ car }: CarSpecificationsProps) {
  const getYearDisplay = () => {
    if (car.production_start_year === car.production_end_year) {
      return car.production_start_year.toString();
    }
    return `${car.production_start_year}-${car.production_end_year}`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Year</div>
                <div className="text-muted-foreground">{getYearDisplay()}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Gauge className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Engine</div>
                <div className="text-muted-foreground">{car.engine_type}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Transmission</div>
                <div className="text-muted-foreground">{car.transmission_type}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Drivetrain</div>
                <div className="text-muted-foreground">{car.drivetrain}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Seating Capacity</div>
                <div className="text-muted-foreground">{car.seating_capacity} seats</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Fuel className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Fuel Consumption</div>
                <div className="text-muted-foreground">{car.fuel_consumption}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Box className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Cargo Capacity</div>
                <div className="text-muted-foreground">{car.cargo_capacity}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Ruler className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Dimensions</div>
                <div className="text-muted-foreground">{car.dimensions}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
