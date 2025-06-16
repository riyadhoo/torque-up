
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PartsFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  conditions: Record<string, boolean>;
  handleConditionChange: (condition: string, checked: boolean) => void;
  carMakes: Record<string, boolean>;
  handleCarMakeChange: (make: string, checked: boolean) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const PartsFilters = ({
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
  conditions,
  handleConditionChange,
  carMakes,
  handleCarMakeChange,
  applyFilters,
  resetFilters
}: PartsFiltersProps) => {
  const { t } = useLanguage();
  const conditionOptions = ["New", "Used", "Refurbished"];
  const carMakeOptions = ["Renault", "Dacia", "Toyota", "Peugeot", "Hyundai", "Volkswagen", "Chevrolet", "Chery", "Kia", "Citroën"];

  return (
    <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden'} md:block`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-24">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{t('parts.filters')}</h3>
          {showFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFilters(false)}
              className="md:hidden"
            >
              <X size={16} />
            </Button>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">{t('parts.priceRange')}</h4>
            <div className="text-xs text-muted-foreground">
              {priceRange[0]} - {priceRange[1]} DA
            </div>
          </div>
          <Slider
            defaultValue={[0, 50000]}
            max={50000}
            step={100}
            onValueChange={(value) => setPriceRange(value)}
            value={priceRange}
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="condition">
            <AccordionTrigger className="text-sm font-medium">
              {t('parts.condition')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {conditionOptions.map((condition, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`condition-${i}`}
                      checked={conditions[condition] || false}
                      onCheckedChange={(checked) => 
                        handleConditionChange(condition, checked === true)
                      }
                    />
                    <label htmlFor={`condition-${i}`} className="text-sm">
                      {t(`common.${condition.toLowerCase()}`)}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="car-make">
            <AccordionTrigger className="text-sm font-medium">
              Car Make
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {carMakeOptions.map((make, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`car-make-${i}`}
                      checked={carMakes[make.toLowerCase()] || false}
                      onCheckedChange={(checked) => 
                        handleCarMakeChange(make.toLowerCase(), checked === true)
                      }
                    />
                    <label htmlFor={`car-make-${i}`} className="text-sm">
                      {make}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-6 space-y-2">
          <Button className="w-full" onClick={applyFilters}>{t('parts.applyFilters')}</Button>
          <Button variant="outline" className="w-full" onClick={resetFilters}>{t('parts.reset')}</Button>
        </div>
      </div>
    </div>
  );
};

export default PartsFilters;
