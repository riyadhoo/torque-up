
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileStats } from "./ProfileStats";

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;
}

interface UserProfileHeaderProps {
  profile: UserProfile;
  avatarUrl: string | null;
  userStats: any;
}

export function UserProfileHeader({ profile, avatarUrl, userStats }: UserProfileHeaderProps) {
  return (
    <div className="flex items-start gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
        <AvatarFallback className="bg-muted text-muted-foreground text-lg">
          {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{profile.username || "Anonymous User"}</h1>
          <ProfileStats userStats={userStats} />
        </div>
        
        {profile.bio && (
          <p className="text-muted-foreground mb-2">{profile.bio}</p>
        )}
        
        {profile.phone_number && (
          <p className="text-sm text-muted-foreground">📞 {profile.phone_number}</p>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
