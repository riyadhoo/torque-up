
import { supabase } from "@/integrations/supabase/client";

// Insert part data into database
export const insertPartData = async (
  title: string,
  description: string,
  price: number,
  condition: string,
  compatibleCars: string[],
  imageUrl: string | null,
  userId: string
) => {
  console.log("Inserting part data:", {
    title,
    price,
    condition,
    compatible_cars: compatibleCars,
    image_url: imageUrl,
    seller_id: userId
  });
  
  try {
    // Check if user profile exists first
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (profileError || !profileData) {
      console.log("Profile not found, creating one...");
      
      // Create profile if doesn't exist
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (createProfileError) {
        console.error("Failed to create profile:", createProfileError);
        throw new Error(`Failed to create user profile: ${createProfileError.message}`);
      }
    }
  
    // Insert the part data with pending approval status
    const { data: partData, error } = await supabase
      .from('parts')
      .insert({
        title,
        description,
        price,
        condition,
        compatible_cars: compatibleCars,
        image_url: imageUrl,
        seller_id: userId,
        approval_status: 'pending'
      })
      .select();
      
    if (error) {
      console.error("Database insert error:", error);
      throw new Error(`Failed to create listing: ${error.message}`);
    }
    
    if (!partData || partData.length === 0) {
      console.error("No part data returned after insert");
      throw new Error("Failed to create listing: No data returned");
    }
    
    console.log("Part created successfully:", partData[0]);
    
    return partData[0];
  } catch (error: any) {
    console.error("Error in insertPartData:", error);
    throw error;
  }
};
