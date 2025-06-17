
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CarProps } from '@/types/car';

export function useFloatingAssistant() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data: carsData, error } = await supabase
          .from('cars')
          .select('*');
          
        if (error) throw error;
        
        if (carsData) {
          setCars(carsData);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { cars, loading };
}
