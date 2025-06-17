
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CarProps } from "@/types/car";
import { CarCard } from "./CarCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarGridProps {
  cars: CarProps[];
  loading: boolean;
  error: string | null;
}

export function CarGrid({ cars, loading, error }: CarGridProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p>{t('cars.loading')}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert>
        <AlertTitle>{t('cars.error')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (cars.length === 0) {
    return (
      <Alert>
        <AlertTitle>{t('cars.noResults')}</AlertTitle>
        <AlertDescription>{t('cars.adjustSearch')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
