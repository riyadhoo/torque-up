
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { getAvatarUrl } from "@/components/parts/utils/partDataFormat";
import { CarReviewProps } from "@/types/car";

interface CarReviewsProps {
  reviews?: CarReviewProps[];
}

export function CarReviews({ reviews = [] }: CarReviewsProps) {
  // Calculate average rating
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <Card className="w-full">
      <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm sm:text-base">out of 5</span>
              <span className="text-muted-foreground text-sm sm:text-base">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
            
            <Separator />
            
            <div className="space-y-4 sm:space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Link to={`/profile/${review.user_id}`} className="hover:opacity-80 transition-opacity flex-shrink-0">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage 
                            src={review.user.avatar_url ? getAvatarUrl(review.user.avatar_url) as string : undefined} 
                            alt={review.user.username} 
                          />
                          <AvatarFallback className="text-xs">{review.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/profile/${review.user_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                          {review.user.username}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start sm:justify-end">
                      <Badge className="text-xs">{review.rating} / 5</Badge>
                    </div>
                  </div>
                  <p className="text-sm break-words pl-8 sm:pl-10">{review.comment}</p>
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">No reviews yet</p>
            <Button className="w-full sm:w-auto">Add the First Review</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
