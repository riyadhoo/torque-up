
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, Star, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-automotive-blue text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            {t('home.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/parts">
              <Button size="lg" className="bg-automotive-red hover:bg-automotive-red/90 text-white w-full sm:w-auto">
                {t('home.hero.searchParts')} <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/sell">
              <Button size="lg" variant="outline" className="border-white text-automotive-blue bg-white hover:bg-automotive-blue hover:text-white w-full sm:w-auto">
                {t('parts.listPart')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Parts Marketplace</h3>
              <p className="text-blue-100 text-sm">
                Find the exact automotive parts you need with our advanced search system
              </p>
            </div>
            
            <div>
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star size={32} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Cars Ratings</h3>
              <p className="text-blue-100 text-sm">
                Browse and purchase quality pre-owned vehicles from verified sellers
              </p>
            </div>
            
            <div>
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">AI Assistant</h3>
              <p className="text-blue-100 text-sm">
                Get expert help with car troubleshooting and personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
