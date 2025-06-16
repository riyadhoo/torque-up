
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Gauge, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CarProps } from "@/types/car";

const CarCard = ({ id, make, model, production_start_year, production_end_year, price, image_url, mileage, location }: CarProps) => {
  const getYearDisplay = () => {
    if (production_start_year === production_end_year) {
      return production_start_year.toString();
    }
    return `${production_start_year}-${production_end_year}`;
  };

  const getPriceRange = (basePrice: number) => {
    const startPrice = basePrice * 100;
    const endPrice = startPrice + 100000;
    return `${startPrice.toLocaleString()} - ${endPrice.toLocaleString()} DA`;
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

  const displayImageUrl = getImageUrl(image_url);

  return (
    <Link to={`/cars/${id}`}>
      <Card className="overflow-hidden h-full card-hover">
        <div className="aspect-video relative overflow-hidden">
          {displayImageUrl ? (
            <img 
              src={displayImageUrl} 
              alt={`${getYearDisplay()} ${make} ${model}`} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="h-full w-full bg-muted flex items-center justify-center absolute inset-0"
            style={{ display: displayImageUrl ? 'none' : 'flex' }}
          >
            <Car className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-semibold text-lg">
              {getYearDisplay()} {make} {model}
            </h3>
            <Badge className="bg-automotive-blue text-white">{getPriceRange(price)}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            {mileage && (
              <div className="flex items-center text-sm">
                <Gauge size={14} className="mr-1 text-muted-foreground" />
                <span>{mileage.toLocaleString()} km</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Calendar size={14} className="mr-1 text-muted-foreground" />
              <span>{getYearDisplay()}</span>
            </div>
          </div>
          
          {location && (
            <div className="flex items-center text-sm mb-3">
              <MapPin size={14} className="mr-1 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={12}
                    fill={i < 4 ? "currentColor" : "none"}
                    className={i < 4 ? "text-amber-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Rate & Review</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const FeaturedCars = () => {
  const [featuredCars, setFeaturedCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        
        const { data: carsData, error: carsError } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (carsError) throw carsError;
        
        if (carsData) {
          setFeaturedCars(carsData);
        }
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <p>Loading featured cars...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold">Featured Vehicles</h2>
            <p className="text-muted-foreground">Latest vehicles from our marketplace</p>
          </div>
          <Link to="/cars" className="text-primary font-medium hover:underline hidden md:block">
            View all vehicles
          </Link>
        </div>
        
        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cars available yet.</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/cars" 
            className="inline-block btn-primary"
          >
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
