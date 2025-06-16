
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CarChatbot } from "@/components/chat/CarChatbot";
import { supabase } from "@/integrations/supabase/client";
import { CarProps } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";

const ChatPage = () => {
  const { t } = useLanguage();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8 px-4 mx-auto flex-grow pt-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('chat.title')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('chat.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p>{t('chat.loading')}</p>
          </div>
        ) : (
          <CarChatbot cars={cars} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;
