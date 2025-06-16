
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getPartImageUrl } from "@/components/parts/utils/partDataFormat";

interface PartProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  compatible_cars: string[] | null;
  seller: {
    username: string;
  };
}

const PartCard = ({ id, title, price, condition, image_url, compatible_cars, seller }: PartProps) => {
  const conditionColorMap = {
    New: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Used: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    Refurbished: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  };

  const displayImageUrl = getPartImageUrl(image_url);

  return (
    <Link to={`/parts/${id}`}>
      <Card className="h-full card-hover overflow-hidden">
        <div className="aspect-square relative overflow-hidden">
          {displayImageUrl ? (
            <img 
              src={displayImageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground text-sm">No image</p>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className={conditionColorMap[condition as keyof typeof conditionColorMap] || ""}>
              {condition}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  size={14}
                  fill={i < 4 ? "currentColor" : "none"}
                  className={i < 4 ? "text-amber-500" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
          </div>
          
          <div className="text-xs text-muted-foreground mb-1">
            Compatible with: 
            <span className="font-medium">
              {compatible_cars && compatible_cars.length > 0
                ? `${compatible_cars.slice(0, 2).join(", ")}${compatible_cars.length > 2 ? ` +${compatible_cars.length - 2} more` : ""}`
                : "Not specified"}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Seller: <span className="font-medium">{seller.username}</span> 
            <span className="inline-flex items-center ml-1">
              <Star size={10} fill="currentColor" className="text-amber-500" /> 
              4.8
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="font-display font-bold text-lg">${price.toFixed(2)}</div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            View Details
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

const FeaturedParts = () => {
  const [featuredParts, setFeaturedParts] = useState<PartProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedParts = async () => {
      try {
        setLoading(true);
        
        // Get the latest 4 approved parts only
        const { data: partsData, error: partsError } = await supabase
          .from('parts')
          .select('id, title, price, condition, image_url, compatible_cars, seller_id')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (partsError) throw partsError;
        
        // Get profiles for sellers
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username');
          
        if (profilesError) throw profilesError;
        
        // Match parts with seller profiles
        const formattedParts = partsData.map((part) => {
          const sellerProfile = profilesData.find((profile) => profile.id === part.seller_id);
          
          return {
            id: part.id,
            title: part.title,
            price: part.price,
            condition: part.condition,
            image_url: part.image_url,
            compatible_cars: part.compatible_cars,
            seller: {
              username: sellerProfile?.username || "Unknown seller",
            }
          };
        });
        
        setFeaturedParts(formattedParts);
      } catch (error) {
        console.error("Error fetching featured parts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedParts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <p>Loading featured parts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold">Featured Parts</h2>
            <p className="text-muted-foreground">Latest quality components for your vehicle</p>
          </div>
          <Link to="/parts" className="text-primary font-medium hover:underline hidden md:block">
            View all parts
          </Link>
        </div>
        
        {featuredParts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredParts.map((part) => (
              <PartCard key={part.id} {...part} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No approved parts available yet.</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/parts" 
            className="inline-block btn-primary"
          >
            View All Parts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedParts;
