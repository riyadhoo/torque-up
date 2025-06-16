
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-automotive-blue py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content Side */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button asChild size="lg" className="bg-automotive-red hover:bg-automotive-red/90 text-white px-8 py-3">
                <Link to="/parts" className="flex items-center gap-2">
                  {t('home.hero.searchParts')}
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3 border-white text-automotive-blue bg-white hover:bg-automotive-blue hover:text-white group">
                <Link to="/cars" className="flex items-center gap-2">
                  <ArrowRight size={20} className="text-automotive-blue group-hover:text-white" />
                  {t('home.hero.browseCars')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3 border-white text-automotive-blue bg-white hover:bg-automotive-blue hover:text-white group">
                <Link to="/chat" className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-automotive-blue group-hover:text-white" />
                  {t('chat.aiAssistant')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/lovable-uploads/c2a66d83-4665-4553-adcb-46317ab38ac2.png" 
                alt="Automotive service illustration with car, mechanic, and parts" 
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
