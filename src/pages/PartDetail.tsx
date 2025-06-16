import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useEnhancedAuth } from "@/lib/securityAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PartDetailHeader } from "@/components/parts/PartDetailHeader";
import { RatingForm } from "@/components/parts/RatingForm";
import { ReviewsList } from "@/components/parts/ReviewsList";

interface Part {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  compatible_cars: string[];
  image_url: string;
  created_at: string;
  seller: {
    id: string;
    username: string;
    avatar_url: string;
    phone_number: string | null;
  };
}

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export default function PartDetail() {
  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user, isAuthenticated } = useEnhancedAuth();

  const fetchRatings = async () => {
    if (!id) return;

    try {
      // Fetch ratings
      const { data: ratingData, error: ratingError } = await supabase
        .from("ratings")
        .select(`
          id, 
          rating, 
          comment, 
          created_at,
          user_id
        `)
        .eq("item_type", "part")
        .eq("item_id", id);

      if (ratingError) throw ratingError;
      
      // Fetch user profiles for ratings
      const userIds = ratingData.map(rating => rating.user_id);
      
      let userProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .in("id", userIds);
          
        if (!profilesError) {
          userProfiles = profilesData || [];
        }
      }

      const formattedRatings = ratingData.map((rating) => {
        const userProfile = userProfiles.find(profile => profile.id === rating.user_id);
        
        return {
          id: rating.id,
          rating: rating.rating,
          comment: rating.comment,
          created_at: rating.created_at,
          user_id: rating.user_id,
          user: {
            username: userProfile?.username || "Unknown",
            avatar_url: userProfile?.avatar_url || "",
          },
        };
      });

      setRatings(formattedRatings);

      // If user is logged in, check if they have already rated
      if (user) {
        const { data: userRatingData } = await supabase
          .from("ratings")
          .select("rating, comment")
          .eq("item_type", "part")
          .eq("item_id", id)
          .eq("user_id", user.id)
          .single();

        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setComment(userRatingData.comment || "");
        }
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    async function fetchPartAndRatings() {
      if (!id) return;

      try {
        // Fetch part details
        const { data: partData, error: partError } = await supabase
          .from("parts")
          .select(`
            id, 
            title, 
            description, 
            price, 
            condition, 
            compatible_cars,
            image_url,
            created_at,
            seller_id
          `)
          .eq("id", id)
          .single();

        if (partError) throw partError;

        // Fetch seller profile with phone number
        const { data: sellerData, error: sellerError } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, phone_number")
          .eq("id", partData.seller_id)
          .single();
          
        if (sellerError) {
          console.error("Error fetching seller:", sellerError);
        }

        // If image_url is a storage path, get the public URL
        let imageUrl = partData.image_url;
        if (imageUrl && !imageUrl.startsWith('http')) {
          try {
            const { data: publicUrlData } = supabase.storage
              .from('parts')
              .getPublicUrl(imageUrl);
              
            if (publicUrlData && publicUrlData.publicUrl) {
              imageUrl = publicUrlData.publicUrl;
            }
          } catch (err) {
            console.error("Error getting image URL:", err);
          }
        }

        // Transform data into required format with proper type handling
        const formattedPart = {
          ...partData,
          image_url: imageUrl,
          seller: {
            id: partData.seller_id,
            username: sellerData?.username || "Unknown",
            avatar_url: sellerData?.avatar_url || "",
            phone_number: sellerData?.phone_number || null,
          },
        };

        setPart(formattedPart);

        // Fetch ratings
        await fetchRatings();
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load part details"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPartAndRatings();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 flex justify-center items-center h-[50vh]">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 flex flex-col justify-center items-center h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Part not found</h1>
          <Button asChild>
            <Link to="/parts">Back to Parts</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating = ratings.length 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PartDetailHeader 
        part={part} 
        averageRating={averageRating} 
        ratingsCount={ratings.length} 
      />

      {/* Reviews Section */}
      <div className="container mx-auto pb-12 px-4">
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          <RatingForm
            partId={id}
            userId={user?.id}
            isAuthenticated={isAuthenticated}
            onRatingSubmitted={fetchRatings}
            initialRating={userRating}
            initialComment={comment}
          />
          
          <ReviewsList ratings={ratings} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
