
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PartFormFields from "@/components/parts/PartFormFields";
import PartImageUpload from "@/components/parts/PartImageUpload";
import { toast } from "@/hooks/use-toast";
import { insertPartData } from "@/components/parts/utils/partDataAccess";
import { uploadPartImage } from "@/components/parts/utils/partImageUpload";
import { validatePartInput } from "@/components/parts/utils/enhancedPartValidation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreatePart() {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("New");
  const [compatibleCars, setCompatibleCars] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic file validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB"
        });
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPEG, PNG, WebP, and GIF files are allowed"
        });
        return;
      }
      
      console.log("Setting image file:", file.name, file.type, file.size);
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log("Image preview created");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    console.log("Form submission data:", {
      title,
      description,
      price,
      condition,
      compatibleCars,
      hasImage: !!image,
      imageInfo: image ? { name: image.name, type: image.type, size: image.size } : null
    });
    
    // Enhanced validation with all required parameters
    const validation = validatePartInput(
      user, 
      title, 
      description,
      price, 
      condition, 
      compatibleCars,
      image
    );
    
    if (!validation.isValid) {
      console.error("Validation failed:", validation.errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Starting part submission process");
      
      // Upload image if selected
      let imageUrl = null;
      if (image) {
        console.log("Processing image upload:", image.name, image.type, image.size);
        imageUrl = await uploadPartImage(image);
        console.log("Upload result:", imageUrl);
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
        console.log("Image uploaded successfully:", imageUrl);
      } else {
        console.log("No image to upload");
      }
      
      // Use sanitized data from validation
      const sanitizedData = validation.sanitizedData!;
      
      console.log("Inserting part data:", sanitizedData);
      
      // Insert part data with sanitized values
      const partData = await insertPartData(
        sanitizedData.title,
        sanitizedData.description || "",
        sanitizedData.price,
        sanitizedData.condition,
        sanitizedData.compatibleCars,
        imageUrl,
        user.id
      );
      
      console.log("Part data inserted successfully:", partData);
      
      toast({
        title: "Listing submitted!",
        description: "Your part listing has been submitted for review. It will be visible once approved."
      });
      
      navigate("/profile");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: t('common.error'),
        description: error.message || "Failed to create listing"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-display font-bold mb-6">{t('parts.create.title')}</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('parts.create.details')}</CardTitle>
              <CardDescription>
                {t('parts.create.subtitle')}
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
                    onClick={() => navigate("/parts")}
                  >
                    {t('parts.create.cancel')}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('parts.create.submitting') : t('parts.create.submit')}
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
