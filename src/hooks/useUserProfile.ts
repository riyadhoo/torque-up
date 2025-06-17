
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;
  user_type: 'individual' | 'store' | null;
}

interface PartListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  created_at: string;
}

export function useUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<PartListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    fetchUserProfile();
    if (isAuthenticated) {
      fetchUserRating();
    }
    fetchUserStats();
  }, [userId, isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile"
        });
        return;
      }

      setProfile(profileData);

      // Get avatar URL if exists
      if (profileData.avatar_url) {
        try {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(profileData.avatar_url);
          
          if (publicUrlData) {
            setAvatarUrl(publicUrlData.publicUrl);
          }
        } catch (err) {
          console.error("Error getting avatar URL:", err);
        }
      }

      // Fetch user's approved listings
      const { data: listingsData, error: listingsError } = await supabase
        .from("parts")
        .select("id, title, price, condition, image_url, created_at")
        .eq("seller_id", userId)
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });

      if (listingsError) {
        console.error("Error fetching listings:", listingsError);
      } else {
        // Convert image URLs to public URLs
        const enhancedListings = listingsData?.map(listing => {
          let publicImageUrl = listing.image_url;
          
          if (listing.image_url && !listing.image_url.startsWith('http')) {
            try {
              const { data: urlData } = supabase.storage
                .from("parts")
                .getPublicUrl(listing.image_url);
                
              if (urlData) {
                publicImageUrl = urlData.publicUrl;
              }
            } catch (err) {
              console.error(`Error getting URL for image ${listing.image_url}:`, err);
            }
          }
          
          return {
            ...listing,
            image_url: publicImageUrl
          };
        }) || [];

        setListings(enhancedListings);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRating = async () => {
    if (!user?.id || !userId || user.id === userId) return;

    try {
      const { data, error } = await supabase
        .from("user_ratings")
        .select("id, rating, comment")
        .eq("rated_user_id", userId)
        .eq("rater_user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user rating:", error);
        return;
      }

      setExistingRating(data);
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const fetchUserStats = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("user_rating_stats")
        .select("*")
        .eq("rated_user_id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user stats:", error);
        return;
      }

      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const refreshRatingData = () => {
    if (isAuthenticated) {
      fetchUserRating();
    }
    fetchUserStats();
  };

  return {
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
  };
}
