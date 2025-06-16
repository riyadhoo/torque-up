
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarProps } from "@/types/car";

export function useCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<string | null>(null);
  const [selectedDrivetrain, setSelectedDrivetrain] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        const { data: carsData, error: carsError } = await supabase.from('cars').select('*');
          
        if (carsError) throw carsError;
        
        if (!carsData) {
          setCars([]);
          return;
        }

        setCars(carsData);
      } catch (err: any) {
        console.error("Error fetching cars:", err);
        setError(err.message || "Failed to load cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredAndSortedCars = useMemo(() => {
    const filteredCars = cars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.model.toLowerCase().includes(searchQuery.toLowerCase());
                          
      const matchesBodyStyle = !selectedBodyStyle || selectedBodyStyle === "all" || 
                              car.body_style?.toLowerCase() === selectedBodyStyle.toLowerCase();
      const matchesDrivetrain = !selectedDrivetrain || selectedDrivetrain === "all" || 
                                car.drivetrain?.toLowerCase() === selectedDrivetrain.toLowerCase();
      const matchesMake = !selectedCategory || selectedCategory === "all" || 
                         car.make?.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesBodyStyle && matchesDrivetrain && matchesMake;
    });

    return [...filteredCars].sort((a, b) => {
      if (sortBy === "price_low") {
        return a.price - b.price;
      } else if (sortBy === "price_high") {
        return b.price - a.price;
      } else if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });
  }, [cars, searchQuery, selectedBodyStyle, selectedDrivetrain, selectedCategory, sortBy]);

  return {
    cars: filteredAndSortedCars,
    loading,
    error,
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
  };
}
