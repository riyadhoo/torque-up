
import { Link } from "react-router-dom";
import { Star, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAvatarUrl } from "@/components/parts/utils/partDataFormat";

interface PartDetailHeaderProps {
  part: {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    compatible_cars: string[];
    image_url: string;
    created_at: string;
    seller: {
      id: string;
      username: string;
      avatar_url: string;
      phone_number: string | null;
    };
  };
  averageRating: number;
  ratingsCount: number;
}

export function PartDetailHeader({ part, averageRating, ratingsCount }: PartDetailHeaderProps) {
  const sellerAvatarUrl = getAvatarUrl(part?.seller?.avatar_url);

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="mb-4 sm:mb-6">
        <Link to="/parts" className="text-primary hover:underline mb-4 inline-block text-sm sm:text-base">
          &larr; Back to parts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Image */}
        <div className="rounded-lg overflow-hidden border bg-card">
          {part?.image_url ? (
            <img 
              src={part.image_url} 
              alt={part.title} 
              className="w-full h-auto object-cover aspect-video"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm sm:text-base">No image available</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">{part?.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`sm:w-[18px] sm:h-[18px] ${star <= Math.round(averageRating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({ratingsCount} {ratingsCount === 1 ? "review" : "reviews"})
            </span>
          </div>
          
          <div className="text-xl sm:text-2xl font-bold">{part?.price?.toFixed(2)} Da</div>
          
          {part?.condition && <Badge className="text-xs sm:text-sm">{part.condition}</Badge>}
          
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
            <p className="text-muted-foreground text-sm sm:text-base break-words">{part?.description || "No description provided."}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Compatible with</h3>
            <div className="flex flex-wrap gap-2">
              {part?.compatible_cars && part.compatible_cars.length > 0 ? (
                part.compatible_cars.map((car, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{car}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Compatibility information not available</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Seller</h3>
            <div className="flex items-center">
              <Link to={`/profile/${part.seller.id}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted overflow-hidden mr-2 sm:mr-3 hover:opacity-80 transition-opacity flex-shrink-0">
                {sellerAvatarUrl ? (
                  <img
                    src={sellerAvatarUrl}
                    alt={part.seller.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-xs sm:text-sm">
                    {part?.seller?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/profile/${part.seller.id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                  {part?.seller?.username}
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Listed on {part && new Date(part.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact seller section */}
          <div className="space-y-3">
            <Button className="w-full flex items-center justify-center gap-2 text-sm sm:text-base" asChild>
              <Link to={`/messages?user=${part?.seller?.id}`}>
                <MessageCircle size={16} />
                Message Seller
              </Link>
            </Button>
            
            {part?.seller?.phone_number ? (
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-sm sm:text-base" asChild>
                <a href={`tel:${part.seller.phone_number}`}>
                  <Phone size={16} />
                  <span className="truncate">Call: {part.seller.phone_number}</span>
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="w-full text-sm sm:text-base" disabled>
                No phone number available
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
