
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import { UserRatingForm } from "@/components/profile/UserRatingForm";
import { UserRatingDisplay } from "@/components/profile/UserRatingDisplay";
import { UserProfileHeader } from "@/components/profile/UserProfileHeader";
import { UserProfileActions } from "@/components/profile/UserProfileActions";
import { UserListings } from "@/components/profile/UserListings";
import { StoreView } from "@/components/profile/StoreView";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function UserProfile() {
  const navigate = useNavigate();
  const [showRatingForm, setShowRatingForm] = useState(false);
  
  const {
    userId,
    user,
    profile,
    listings,
    isLoading,
    avatarUrl,
    existingRating,
    userStats,
    refreshRatingData,
    isAuthenticated
  } = useUserProfile();

  const handleRatingSubmitted = () => {
    setShowRatingForm(false);
    refreshRatingData();
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!userId) return;
    navigate(`/messages?user=${userId}`);
  };

  const handleToggleRatingForm = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowRatingForm(!showRatingForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl py-10 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <UserProfileActions 
              isOwnProfile={false}
              existingRating={null}
              onSendMessage={() => navigate("/")}
              onToggleRatingForm={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = isAuthenticated && user?.id === userId;
  const isStoreProfile = profile?.user_type === 'store';

  // If viewing a store profile, show the store view
  if (isStoreProfile) {
    return <StoreView />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-10 pt-24">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <UserProfileHeader 
              profile={profile}
              avatarUrl={avatarUrl}
              userStats={userStats}
            />
            <div className="mt-6">
              <UserProfileActions
                isOwnProfile={isOwnProfile}
                existingRating={existingRating}
                onSendMessage={handleSendMessage}
                onToggleRatingForm={handleToggleRatingForm}
              />
            </div>
          </CardContent>
        </Card>

        {!isOwnProfile && isAuthenticated && showRatingForm && (
          <div className="mb-8">
            <UserRatingForm
              ratedUserId={userId!}
              onRatingSubmitted={handleRatingSubmitted}
              existingRating={existingRating}
            />
          </div>
        )}

        <div className="mb-8">
          <UserRatingDisplay userId={userId!} />
        </div>

        <UserListings listings={listings} />
      </div>
    </div>
  );
}
