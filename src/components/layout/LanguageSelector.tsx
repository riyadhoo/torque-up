
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Language, LanguageConfig } from "@/contexts/types/language";

const languages: LanguageConfig[] = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'ar' as Language, name: 'العربية', flag: '🇩🇿' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const isMobile = useIsMobile();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"} 
          className={`gap-1 ${isMobile ? 'h-8 px-2' : 'gap-2'}`}
        >
          <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
          {isMobile ? (
            <span className="text-xs">{currentLanguage?.flag}</span>
          ) : (
            <>
              <span className="hidden sm:inline text-xs">{currentLanguage?.flag} {currentLanguage?.name}</span>
              <span className="sm:hidden text-xs">{currentLanguage?.flag}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-background border shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`${language === lang.code ? "bg-accent" : ""} cursor-pointer`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
