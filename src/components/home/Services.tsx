
import { Car, Wrench, MessageCircle, Search, ShoppingCart, Bot, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();

  const services = [{
    icon: <Car className="h-8 w-8 text-automotive-red" />,
    title: t('cars.title'),
    description: "Browse and discover your perfect vehicle from our extensive collection of quality cars.",
    features: ["Detailed specifications", "High-quality images", "Customer reviews"],
    link: "/cars"
  }, {
    icon: <Wrench className="h-8 w-8 text-automotive-red" />,
    title: t('parts.title'),
    description: "Find genuine auto parts for any make and model. Sell your spare parts to other enthusiasts.",
    features: ["Genuine parts", "Competitive pricing", "Easy selling platform"],
    link: "/parts"
  }, {
    icon: <Bot className="h-8 w-8 text-automotive-red" />,
    title: t('chat.aiAssistant'),
    description: "Get personalized recommendations and expert automotive advice from our intelligent assistant.",
    features: ["Car recommendations", "Part suggestions", "24/7 availability"],
    link: "/chat"
  }];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-automotive-blue dark:text-white mb-4">
            {t('home.services.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From finding your dream car to sourcing quality parts and getting expert advice, 
            our platform combines the power of technology with automotive expertise to serve all your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="card-hover border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-automotive-blue dark:text-white mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="mb-6 space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-automotive-red rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild className="bg-automotive-red hover:bg-automotive-red/90 text-white">
                    <Link to={service.link}>
                      {t('home.categories.explore')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full width platform section */}
      <div className="w-full mt-12 bg-automotive-blue dark:bg-gray-800 text-white dark:text-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Why Choose Our Platform?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center">
                <Star className="h-5 w-5 mr-3 text-automotive-red" />
                <span>Cars ratings</span>
              </div>
              <div className="flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 mr-3 text-automotive-red" />
                <span>Parts marketplace</span>
              </div>
              <div className="flex items-center justify-center">
                <MessageCircle className="h-5 w-5 mr-3 text-automotive-red" />
                <span>Expert support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
