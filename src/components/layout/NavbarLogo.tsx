
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

export function NavbarLogo() {
  const { theme } = useTheme();
  
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src={theme === "dark" ? "/uploads/ba58edb5-dff5-4ea5-bd20-8b0c24778236.png" : "/uploads/594eaa5f-e144-4765-a223-97488be4538e.png"} 
        alt="TorqueUp Logo" 
        className="h-12 w-auto" 
      />
    </Link>
  );
}
