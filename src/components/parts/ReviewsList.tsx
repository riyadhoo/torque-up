
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
  user_id?: string;
}

interface ReviewsListProps {
  ratings: Rating[];
}

export function ReviewsList({ ratings }: ReviewsListProps) {
  if (ratings.length === 0) {
    return (
      <div className="text-center py-6 px-4">
        <p className="text-muted-foreground text-sm sm:text-base">No reviews yet. Be the first to review this part!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2 sm:px-4 sm:space-y-6">
      {ratings.map((rating) => (
        <Card key={rating.id} className="w-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <Link to={`/profile/${rating.user_id}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted overflow-hidden mr-2 sm:mr-3 hover:opacity-80 transition-opacity flex-shrink-0">
                  {rating.user.avatar_url ? (
                    <img
                      src={rating.user.avatar_url}
                      alt={rating.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-xs sm:text-sm">
                      {rating.user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/profile/${rating.user_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                    {rating.user.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-start sm:justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`sm:w-4 sm:h-4 ${star <= rating.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            
            {rating.comment && (
              <p className="text-muted-foreground text-sm sm:text-base break-words">
                {rating.comment}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
