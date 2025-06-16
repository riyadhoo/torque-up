
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Wrench, Car } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ChatHeader() {
  const { t } = useLanguage();
  
  return (
    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">{t('chat.title')}</CardTitle>
      </div>
      <div className="flex items-center space-x-1 ml-auto text-xs sm:text-sm text-muted-foreground flex-wrap">
        <div className="flex items-center space-x-1">
          <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="break-words">{t('chat.troubleshooting')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Car className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="break-words">{t('chat.recommendations')}</span>
        </div>
      </div>
    </CardHeader>
  );
}
