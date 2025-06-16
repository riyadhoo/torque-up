import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PartFormFields from "@/components/parts/PartFormFields";
import PartImageUpload from "@/components/parts/PartImageUpload";
import { usePartSubmit } from "@/components/parts/hooks/usePartSubmit";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getPartImageUrl } from "@/components/parts/utils/partDataFormat";

export default function EditPart() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("New");
  const [compatibleCars, setCompatibleCars] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { submitPart, isSubmitting } = usePartSubmit();
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Fetch existing part data
  useEffect(() => {
    async function fetchPart() {
      if (!id || !user?.id) return;
      
      try {
        const { data: part, error } = await supabase
          .from('parts')
          .select('*')
          .eq('id', id)
          .eq('seller_id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching part:", error);
          toast({
            title: "Error",
            description: "Failed to load part data"
          });
          navigate("/profile");
          return;
        }
        
        if (part) {
          setTitle(part.title);
          setDescription(part.description || "");
          setPrice(part.price.toString());
          setCondition(part.condition);
          setCompatibleCars(part.compatible_cars || []);
          
          if (part.image_url) {
            const imageUrl = getPartImageUrl(part.image_url);
            setImagePreview(imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching part:", error);
        toast({
          title: "Error",
          description: "Failed to load part data"
        });
        navigate("/profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPart();
  }, [id, user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user?.id) return;
    
    try {
      let imageUrl = null;
      if (image) {
        // Upload new image if one is selected
        const { uploadPartImage } = await import("@/components/parts/utils/partImageUpload");
        imageUrl = await uploadPartImage(image);
      }
      
      const updateData: any = {
        title,
        description,
        price: parseFloat(price),
        condition,
        compatible_cars: compatibleCars,
        updated_at: new Date().toISOString()
      };
      
      // Only update image_url if a new image was uploaded
      if (imageUrl) {
        updateData.image_url = imageUrl;
      }
      
      const { error } = await supabase
        .from('parts')
        .update(updateData)
        .eq('id', id)
        .eq('seller_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your part listing has been updated"
      });
      
      navigate(`/parts/${id}`);
    } catch (error: any) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update listing"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-display font-bold mb-6">Edit Your Listing</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Part Details</CardTitle>
              <CardDescription>
                Update the details of your part listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <PartFormFields 
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  price={price}
                  setPrice={setPrice}
                  condition={condition}
                  setCondition={setCondition}
                  compatibleCars={compatibleCars}
                  setCompatibleCars={setCompatibleCars}
                />
                
                <PartImageUpload 
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                />
                
                <div className="pt-4 flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(`/parts/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update Listing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
