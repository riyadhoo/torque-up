import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

interface NavigationItem {
  path: string;
  label: string;
}

export function MobileMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigationItems: NavigationItem[] = [
    { path: "/", label: t('nav.home') },
    { path: "/parts", label: t('nav.parts') },
    { path: "/cars", label: t('nav.cars') },
    { path: "/chat", label: t('chat.aiAssistant') },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center space-x-1">
        <div className="flex items-center space-x-1">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-4 safe-area-inset-bottom">
              {/* Navigation Links */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-automotive-red transition-colors py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
              
              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-automotive-red transition-colors py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <Link
                    to="/messages"
                    className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-automotive-red transition-colors py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-automotive-red transition-colors w-full text-left py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-automotive-red transition-colors py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-automotive-red hover:bg-automotive-red/90 text-white py-3">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
