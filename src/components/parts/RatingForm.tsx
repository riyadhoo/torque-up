
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface RatingFormProps {
  partId: string | undefined;
  userId: string | undefined;
  isAuthenticated: boolean;
  onRatingSubmitted: () => Promise<void>;
  initialRating?: number;
  initialComment?: string;
}

export function RatingForm({
  partId,
  userId,
  isAuthenticated,
  onRatingSubmitted,
  initialRating = 0,
  initialComment = ""
}: RatingFormProps) {
  const [userRating, setUserRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);

  const submitRating = async () => {
    if (!isAuthenticated || !userId) {
      toast({
        title: "Authentication required",
        description: "You need to log in to rate parts"
      });
      return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating"
      });
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from("ratings")
        .upsert({
          item_type: "part",
          item_id: partId,
          rating: userRating,
          comment: comment,
          user_id: userId,
        }, {
          onConflict: "user_id, item_type, item_id",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your rating has been submitted"
      });

      await onRatingSubmitted();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Leave a Review</h3>
        
        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                onClick={() => setUserRating(star)}
                className={`cursor-pointer ${
                  star <= userRating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <Textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={4}
          />
        </div>
        
        <Button 
          onClick={submitRating} 
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
}
