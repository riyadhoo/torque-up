
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UserRating {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  rater_user_id: string;
  rater_profile: {
    username: string | null;
    avatar_url: string | null;
  };
}

interface UserRatingStats {
  total_ratings: number;
  average_rating: number;
}

interface UserRatingDisplayProps {
  userId: string;
}

export function UserRatingDisplay({ userId }: UserRatingDisplayProps) {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [stats, setStats] = useState<UserRatingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  const fetchRatings = async () => {
    try {
      setIsLoading(true);

      // Fetch user rating statistics
      const { data: statsData } = await supabase
        .from("user_rating_stats")
        .select("*")
        .eq("rated_user_id", userId)
        .single();

      setStats(statsData);

      // Fetch detailed ratings with rater profiles
      const { data: ratingsData, error } = await supabase
        .from("user_ratings")
        .select(`
          id,
          rating,
          comment,
          created_at,
          rater_user_id,
          profiles!user_ratings_rater_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("rated_user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching ratings:", error);
        return;
      }

      // Transform the data structure
      const transformedRatings = ratingsData?.map(rating => ({
        id: rating.id,
        rating: rating.rating,
        comment: rating.comment,
        created_at: rating.created_at,
        rater_user_id: rating.rater_user_id,
        rater_profile: {
          username: rating.profiles?.username || null,
          avatar_url: rating.profiles?.avatar_url || null
        }
      })) || [];

      setRatings(transformedRatings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`sm:w-4 sm:h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-muted-foreground text-sm sm:text-base">Loading ratings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl">
          <span>User Ratings</span>
          {stats && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-normal">
              {renderStars(Math.round(stats.average_rating))}
              <span className="text-muted-foreground">
                {stats.average_rating}/5 ({stats.total_ratings} {stats.total_ratings === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {!stats || stats.total_ratings === 0 ? (
          <div className="text-center text-muted-foreground py-4 text-sm sm:text-base">
            No ratings yet
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Link to={`/profile/${rating.rater_user_id}`} className="hover:opacity-80 transition-opacity flex-shrink-0">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={rating.rater_profile.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {rating.rater_profile.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <Link to={`/profile/${rating.rater_user_id}`} className="font-medium text-sm hover:underline truncate">
                        {rating.rater_profile.username || "Anonymous User"}
                      </Link>
                      <div className="flex items-center gap-2">
                        {renderStars(rating.rating)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground mt-1 break-words">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
