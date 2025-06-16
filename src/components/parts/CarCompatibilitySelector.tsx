
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface CarCompatibilitySelectorProps {
  selectedCars: string[];
  onSelectionChange: (cars: string[]) => void;
}

export default function CarCompatibilitySelector({
  selectedCars,
  onSelectionChange,
}: CarCompatibilitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [carMakes, setCarMakes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarMakes();
  }, []);

  const fetchCarMakes = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('make')
        .order('make');

      if (error) throw error;

      // Get unique car makes
      const uniqueMakes = [...new Set(data.map(car => car.make))];
      setCarMakes(uniqueMakes);
    } catch (error) {
      console.error('Error fetching car makes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (carMake: string) => {
    if (!selectedCars.includes(carMake)) {
      onSelectionChange([...selectedCars, carMake]);
    }
    setOpen(false);
  };

  const handleRemove = (carMake: string) => {
    onSelectionChange(selectedCars.filter(car => car !== carMake));
  };

  return (
    <div className="space-y-2">
      <Label>Compatible Car Makes</Label>
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
        {selectedCars.map((car) => (
          <Badge key={car} variant="secondary" className="flex items-center gap-1">
            {car}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemove(car)}
            />
          </Badge>
        ))}
        
        {/* Add button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="h-7 px-2"
            >
              Add car make
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search car makes..." />
              <CommandList>
                <CommandEmpty>
                  {loading ? "Loading car makes..." : "No car makes found."}
                </CommandEmpty>
                <CommandGroup>
                  {carMakes
                    .filter(make => !selectedCars.includes(make))
                    .map((make) => (
                      <CommandItem
                        key={make}
                        value={make}
                        onSelect={() => handleSelect(make)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            "opacity-0"
                          )}
                        />
                        {make}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Select the car makes that this part is compatible with
      </p>
    </div>
  );
}
