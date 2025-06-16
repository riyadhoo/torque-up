
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationItem {
  path: string;
  label: string;
}

export function NavbarNavigation() {
  const { t } = useLanguage();

  const navigationItems: NavigationItem[] = [
    { path: "/", label: t('nav.home') },
    { path: "/parts", label: t('nav.parts') },
    { path: "/cars", label: t('nav.cars') },
    { path: "/chat", label: t('chat.aiAssistant') },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="text-gray-700 dark:text-gray-300 hover:text-automotive-red transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
