
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  route: string;
}

const CategoryCard = ({ title, description, icon, route }: CategoryCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Link to={route} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 card-hover">
      <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto overflow-hidden">
        <img 
          src={icon} 
          alt={`${title} logo`} 
          className="h-12 w-12 object-contain"
          onError={(e) => {
            // Fallback to a generic car icon if image fails to load
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.68-1.5-2.5l-.6-.4c-.6-.4-1.3-.6-2-.6H17'/%3E%3Cpath d='M5 17H3c-.6 0-1-.4-1-1v-3c0-.9.7-1.68 1.5-2.5l.6-.4c.6-.4 1.3-.6 2-.6H7'/%3E%3Cpath d='M6 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'/%3E%3Cpath d='M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'/%3E%3Cpath d='M8 17h8'/%3E%3Cpath d='M7 7h10l-1 10H8L7 7z'/%3E%3C/svg%3E";
          }}
        />
      </div>
      <h3 className="text-lg font-display font-semibold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center text-sm mb-4">{description}</p>
      <div className="flex items-center justify-center text-primary font-medium">
        <span>{t('home.categories.explore')}</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </Link>
  );
};

const Categories = () => {
  const { t } = useLanguage();
  
  const categories = [
    {
      title: "Renault",
      description: "Explore parts and vehicles from the French automotive brand",
      icon: "/lovable-uploads/e6e2ff38-e472-4c1b-9ea2-3dc7174c3845.png",
      route: "/cars?make=renault"
    },
    {
      title: "Dacia",
      description: "Affordable and reliable Romanian vehicles and parts",
      icon: "/lovable-uploads/94b1cb4b-045a-4946-a5d1-6c23cca50433.png",
      route: "/cars?make=dacia"
    },
    {
      title: "Chery",
      description: "Chinese automotive innovation and quality parts",
      icon: "/lovable-uploads/3537a6c5-d41b-451b-80b9-049ae1142a3b.png",
      route: "/cars?make=chery"
    },
    {
      title: "Chevrolet",
      description: "American muscle and performance vehicle components",
      icon: "/lovable-uploads/f34c3029-87bf-4849-9773-1aac5abe0681.png",
      route: "/cars?make=chevrolet"
    },
    {
      title: "Hyundai",
      description: "Korean engineering excellence in vehicles and parts",
      icon: "/lovable-uploads/f7e2eba6-49a4-4019-879b-1b3a94bbaccf.png",
      route: "/cars?make=hyundai"
    },
    {
      title: "Peugeot",
      description: "French elegance and automotive sophistication",
      icon: "/lovable-uploads/37155994-34e7-42ba-a12e-829503418f1d.png",
      route: "/cars?make=peugeot"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-3">{t('home.categories.title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('home.categories.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
