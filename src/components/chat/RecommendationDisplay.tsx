
import { CarRecommendationCard } from "./CarRecommendationCard";
import { PartRecommendationCard } from "./PartRecommendationCard";
import { CarProps } from "@/types/car";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PartProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  compatible_cars: string[] | null;
  seller: {
    username: string;
  };
}

interface RecommendationDisplayProps {
  type: 'cars' | 'parts';
  items: CarProps[] | PartProps[];
  title: string;
}

export function RecommendationDisplay({ type, items, title }: RecommendationDisplayProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-4">
      <h4 className="text-sm font-semibold mb-3 text-gray-700 break-words leading-tight">
        {title}
      </h4>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-3 p-3 md:p-4">
          {type === 'cars' ? (
            (items as CarProps[]).map((car) => (
              <CarRecommendationCard key={car.id} car={car} />
            ))
          ) : (
            (items as PartProps[]).map((part) => (
              <PartRecommendationCard key={part.id} part={part} />
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
