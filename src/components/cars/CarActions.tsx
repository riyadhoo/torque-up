
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle } from "lucide-react";
import { CarDetailProps } from "@/types/car";

interface CarActionsProps {
  car: CarDetailProps;
}

export function CarActions({ car }: CarActionsProps) {
  const getYearDisplay = () => {
    if (car.production_start_year === car.production_end_year) {
      return car.production_start_year.toString();
    }
    return `${car.production_start_year}-${car.production_end_year}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${getYearDisplay()} ${car.make} ${car.model}`,
        text: `Check out this ${getYearDisplay()} ${car.make} ${car.model}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share This Car
        </Button>
        <Button className="w-full" variant="outline">
          <Heart className="h-4 w-4 mr-2" />
          Add to Wishlist
        </Button>
        <Button className="w-full" variant="outline">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Us
        </Button>
      </CardContent>
    </Card>
  );
}
