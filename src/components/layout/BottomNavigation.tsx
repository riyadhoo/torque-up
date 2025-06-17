
import { Link, useLocation } from "react-router-dom";
import { Home, Car, Wrench, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/parts",
      label: "Parts",
      icon: Wrench,
    },
    {
      path: "/cars",
      label: "Cars",
      icon: Car,
    },
    {
      path: "/chat",
      label: "Chat",
      icon: MessageCircle,
    },
    {
      path: isAuthenticated ? "/profile" : "/login",
      label: isAuthenticated ? "Profile" : "Login",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden pb-1">
      <div className="flex items-center justify-around h-12 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-1 py-0.5 min-w-0 flex-1 transition-colors",
                isActive 
                  ? "text-automotive-red" 
                  : "text-gray-600 dark:text-gray-400 hover:text-automotive-red"
              )}
            >
              <Icon size={18} className="mb-0.5" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
