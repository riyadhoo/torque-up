
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PartProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  compatible_cars: string[] | null;
  created_at: string;
  seller: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useParts = () => {
  const [parts, setParts] = useState<PartProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParts = async () => {
    try {
      setLoading(true);
      console.log("Fetching approved parts...");
      
      // Fetch approved parts from the approved_parts table
      const { data: partsData, error: partsError } = await supabase
        .from('approved_parts')
        .select('id, title, price, condition, image_url, compatible_cars, seller_id, created_at')
        .order('created_at', { ascending: false });
        
      if (partsError) {
        console.error("Parts fetch error:", partsError);
        throw partsError;
      }
      
      console.log("Parts data received:", partsData);
      
      // Get profiles in a separate query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url');
        
      if (profilesError) {
        console.error("Profiles fetch error:", profilesError);
        throw profilesError;
      }
      
      console.log("Profiles data received:", profilesData);
      
      // Match parts with seller profiles
      const formattedParts = partsData.map((part) => {
        const sellerProfile = profilesData.find((profile) => profile.id === part.seller_id);
        
        return {
          id: part.id,
          title: part.title,
          price: part.price,
          condition: part.condition,
          image_url: part.image_url,
          compatible_cars: part.compatible_cars,
          created_at: part.created_at,
          seller: {
            id: part.seller_id,
            username: sellerProfile?.username || null,
            avatar_url: sellerProfile?.avatar_url || null,
          }
        };
      });
      
      console.log("Formatted parts:", formattedParts);
      setParts(formattedParts);
    } catch (error) {
      console.error("Error fetching parts:", error);
      toast({
        title: "Error",
        description: "Failed to load parts"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return { parts, loading, refetch: fetchParts };
};
