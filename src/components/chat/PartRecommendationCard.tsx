
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface PartRecommendationCardProps {
  part: PartProps;
}

export function PartRecommendationCard({ part }: PartRecommendationCardProps) {
  const { formatPrice } = useLanguage();
  
  const conditionColorMap: Record<string, string> = {
    "New": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Used": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    "Refurbished": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  };

  const getPartImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return imageUrl;
  };

  const displayImageUrl = getPartImageUrl(part.image_url);

  return (
    <Link to={`/parts/${part.id}`} className="block">
      <Card className="w-48 md:w-56 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 flex-shrink-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {displayImageUrl ? (
            <img 
              src={displayImageUrl} 
              alt={part.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground text-xs">No image</p>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className={`text-xs ${conditionColorMap[part.condition] || ""}`}>
              {part.condition}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-3">
          <h4 className="font-medium text-sm mb-1 line-clamp-1">{part.title}</h4>
          
          <div className="text-xs text-muted-foreground mb-1">
            Compatible: 
            <span className="font-medium ml-1 break-words">
              {part.compatible_cars && part.compatible_cars.length > 0
                ? `${part.compatible_cars.slice(0, 1).join(", ")}${part.compatible_cars.length > 1 ? ` +${part.compatible_cars.length - 1}` : ""}`
                : "Not specified"}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground mb-2">
            Seller: <span className="font-medium truncate">{part.seller.username}</span> 
          </div>
          <div className="font-bold text-sm text-primary break-words">{formatPrice(part.price)}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
