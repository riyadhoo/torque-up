
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

interface CarRatingFormProps {
  carId: string;
  onRatingSubmitted: () => Promise<void>;
}

export function CarRatingForm({ carId, onRatingSubmitted }: CarRatingFormProps) {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const submitRating = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to log in to rate cars"
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
          item_type: "car",
          item_id: carId,
          rating: userRating,
          comment: comment,
          user_id: user.id,
        }, {
          onConflict: "user_id, item_type, item_id",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your rating has been submitted"
      });

      setUserRating(0);
      setComment("");
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

  if (!user) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to rate this car
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Rate This Car</CardTitle>
      </CardHeader>
      <CardContent>
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
            placeholder="Share your thoughts about this car..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={4}
          />
        </div>
        
        <Button 
          onClick={submitRating} 
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
}
