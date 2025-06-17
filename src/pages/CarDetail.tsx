
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CarDetailProps } from "@/types/car";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CarHeader } from "@/components/cars/CarHeader";
import { CarImage } from "@/components/cars/CarImage";
import { CarDetailTabs } from "@/components/cars/CarDetailTabs";
import { CarActions } from "@/components/cars/CarActions";
import { CarMeta } from "@/components/cars/CarMeta";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Fetch car details
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
        
      if (carError) throw carError;
      if (!carData) throw new Error("Car not found");
      
      // Fetch reviews for this car
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('ratings')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('item_type', 'car')
        .eq('item_id', id);
      
      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      }
      
      // Transform reviews data
      const transformedReviews = reviewsData?.map(review => ({
        id: review.id,
        car_id: id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment || '',
        created_at: review.created_at,
        user: {
          username: review.profiles?.username || 'Anonymous',
          avatar_url: review.profiles?.avatar_url || null
        }
      })) || [];
      
      // Transform data to match our CarDetailProps type
      const carWithData: CarDetailProps = {
        ...carData,
        reviews: transformedReviews
      };
      
      setCar(carWithData);
    } catch (err: any) {
      console.error("Error fetching car details:", err);
      setError(err.message || "Failed to load car details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarData();
  }, [id]);

  const handleReviewUpdate = async () => {
    await fetchCarData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 px-4 mx-auto flex justify-center flex-grow pt-20 sm:pt-24">
          <p>Loading car details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 px-4 mx-auto flex-grow pt-20 sm:pt-24">
          <Alert>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Car not found"}</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8 px-4 mx-auto flex-grow pt-20 sm:pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <CarHeader car={car} />
            <CarImage car={car} />
            <CarDetailTabs car={car} onReviewUpdate={handleReviewUpdate} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <CarActions car={car} />
            <CarMeta car={car} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDetail;
