
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserRatingFormProps {
  ratedUserId: string;
  onRatingSubmitted: () => void;
  existingRating?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

export function UserRatingForm({ ratedUserId, onRatingSubmitted, existingRating }: UserRatingFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to rate users."
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from("user_ratings")
          .update({
            rating,
            comment: comment.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingRating.id);

        if (error) throw error;

        toast({
          title: "Rating updated",
          description: "Your rating has been updated successfully."
        });
      } else {
        // Create new rating
        const { error } = await supabase
          .from("user_ratings")
          .insert({
            rated_user_id: ratedUserId,
            rater_user_id: user.id,
            rating,
            comment: comment.trim() || null
          });

        if (error) throw error;

        toast({
          title: "Rating submitted",
          description: "Your rating has been submitted successfully."
        });
      }

      onRatingSubmitted();
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {existingRating ? "Update Your Rating" : "Rate This User"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Rating (1-5 stars)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="text-sm font-medium mb-2 block">
              Comment (optional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this user..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
