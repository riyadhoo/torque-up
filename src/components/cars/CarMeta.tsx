
import { CarDetailProps } from "@/types/car";
import { formatDistanceToNow } from "date-fns";

interface CarMetaProps {
  car: CarDetailProps;
}

export function CarMeta({ car }: CarMetaProps) {
  const formattedDate = formatDistanceToNow(
    new Date(car.created_at),
    { addSuffix: true }
  );
  
  return (
    <div className="text-sm text-muted-foreground">
      <p>Listed {formattedDate}</p>
      <p>ID: {car.id.substring(0, 8)}</p>
      {car.mileage && <p>Mileage: {car.mileage.toLocaleString()} miles</p>}
    </div>
  );
}
