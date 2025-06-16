
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, User, Clock } from "lucide-react";
import { getPartImageUrl, getAvatarUrl } from "@/components/parts/utils/partDataFormat";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

interface PartCardProps {
  part: {
    id: string;
    title: string;
    price: number;
    condition: string;
    image_url: string | null;
    created_at?: string;
    seller?: {
      id: string;
      username: string | null;
      avatar_url: string | null;
    };
  };
  showSellerInfo?: boolean;
}

export function PartCard({ part, showSellerInfo = true }: PartCardProps) {
  const { formatPrice } = useLanguage();
  const displayImageUrl = getPartImageUrl(part.image_url);
  const displayAvatarUrl = getAvatarUrl(part.seller?.avatar_url || null);

  const formatListingTime = (createdAt: string | undefined) => {
    if (!createdAt) return "Recently";
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <Link to={`/parts/${part.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-video relative overflow-hidden">
          {displayImageUrl ? (
            <img 
              src={displayImageUrl} 
              alt={part.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">{part.condition}</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              <Clock size={12} className="mr-1" />
              {formatListingTime(part.created_at)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{part.title}</h3>
          <p className="text-2xl font-bold mb-2">{formatPrice(part.price)}</p>
          
          {showSellerInfo && part.seller && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={displayAvatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {part.seller.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span>{part.seller.username || "Anonymous"}</span>
              </div>
              
              <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/profile/${part.seller.id}`}>
                    <User size={14} />
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/messages?user=${part.seller.id}`}>
                    <MessageCircle size={14} />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
