
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, LogIn } from "lucide-react";

interface UserProfileActionsProps {
  isOwnProfile: boolean;
  existingRating: any;
  onSendMessage: () => void;
  onToggleRatingForm: () => void;
}

export function UserProfileActions({ 
  isOwnProfile, 
  existingRating, 
  onSendMessage, 
  onToggleRatingForm 
}: UserProfileActionsProps) {
  if (isOwnProfile) return null;

  return (
    <div className="flex gap-2">
      <Button onClick={onSendMessage} className="flex items-center gap-2">
        <MessageCircle size={16} />
        Send Message
      </Button>
      
      <Button 
        onClick={onToggleRatingForm}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Star size={16} />
        {existingRating ? "Update Rating" : "Rate User"}
      </Button>
    </div>
  );
}
