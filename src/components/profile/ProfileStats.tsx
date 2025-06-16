
import { Star } from "lucide-react";

interface UserStats {
  total_ratings: number;
  average_rating: number;
}

interface ProfileStatsProps {
  userStats: UserStats | null;
}

export function ProfileStats({ userStats }: ProfileStatsProps) {
  if (!userStats) return null;

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">
        {userStats.average_rating}/5
      </span>
      <span className="text-xs text-muted-foreground">
        ({userStats.total_ratings} {userStats.total_ratings === 1 ? 'rating' : 'ratings'})
      </span>
    </div>
  );
}
