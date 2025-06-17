
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedBodyStyle: string | null;
  setSelectedBodyStyle: (value: string | null) => void;
  selectedDrivetrain: string | null;
  setSelectedDrivetrain: (value: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export function CarFilters({
  searchQuery,
  setSearchQuery,
  selectedBodyStyle,
  setSelectedBodyStyle,
  selectedDrivetrain,
  setSelectedDrivetrain,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy
}: CarFiltersProps) {
  const { t } = useLanguage();

  const bodyStyles = ["Sedan", "SUV", "Pickup", "Hatchback"];
  const drivetrains = ["FWD", "AWD", "4WD", "RWD"];
  const carMakes = ["Renault", "Dacia", "Chery", "Chevrolet", "Hyundai", "Peugeot", "Toyota", "Volkswagen", "Kia", "Citroën"];

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('cars.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select onValueChange={(value) => setSelectedCategory(value)} value={selectedCategory || undefined}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Car Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {carMakes.map(make => (
                <SelectItem key={make} value={make.toLowerCase()}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedBodyStyle(value)} value={selectedBodyStyle || undefined}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('cars.bodyStyle')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('cars.allBodyStyles')}</SelectItem>
              {bodyStyles.map(style => (
                <SelectItem key={style} value={style.toLowerCase()}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setSelectedDrivetrain(value)} value={selectedDrivetrain || undefined}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('cars.drivetrain')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('cars.allDrivetrains')}</SelectItem>
              {drivetrains.map(dt => (
                <SelectItem key={dt} value={dt.toLowerCase()}>{dt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('cars.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('cars.newest')}</SelectItem>
              <SelectItem value="oldest">{t('cars.oldest')}</SelectItem>
              <SelectItem value="price_low">{t('cars.priceLowHigh')}</SelectItem>
              <SelectItem value="price_high">{t('cars.priceHighLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
