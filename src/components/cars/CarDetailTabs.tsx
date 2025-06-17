
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CarSpecifications } from "./CarSpecifications";
import { CarReviews } from "./CarReviews";
import { CarRatingForm } from "./CarRatingForm";
import { CarDetailProps } from "@/types/car";

interface CarDetailTabsProps {
  car: CarDetailProps;
  onReviewUpdate?: () => Promise<void>;
}

export function CarDetailTabs({ car, onReviewUpdate }: CarDetailTabsProps) {
  return (
    <Tabs defaultValue="specs" className="mb-8">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews
          {car.reviews && car.reviews.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {car.reviews.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="rate">Rate & Review</TabsTrigger>
      </TabsList>
      
      <TabsContent value="specs" className="mt-4">
        <CarSpecifications car={car} />
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-4">
        <CarReviews reviews={car.reviews} />
      </TabsContent>
      
      <TabsContent value="rate" className="mt-4">
        <CarRatingForm 
          carId={car.id} 
          onRatingSubmitted={onReviewUpdate || (() => Promise.resolve())}
        />
      </TabsContent>
    </Tabs>
  );
}
