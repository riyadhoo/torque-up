
import { useState } from "react";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarChatbot } from "./CarChatbot";
import { CarProps } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingAssistantProps {
  cars: CarProps[];
}

export function FloatingAssistant({ cars }: FloatingAssistantProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-16 right-4 z-50 sm:bottom-6 sm:right-6 md:bottom-6">
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg touch-manipulation active:scale-95 transition-transform"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Mobile: Full screen overlay */}
          {isMobile ? (
            <div className="fixed inset-0 z-50 bg-background safe-area-inset">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background">
                  <h3 className="font-semibold text-base sm:text-lg truncate mr-2">{t('chat.carAssistant')}</h3>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CarChatbot cars={cars} isFloating={true} />
                </div>
              </div>
            </div>
          ) : (
            /* Desktop: Floating window */
            <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[400px] sm:h-[500px] bg-background border rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                <h3 className="font-semibold text-sm sm:text-base truncate mr-2">{t('chat.carAssistant')}</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[calc(100%-48px)] sm:h-[calc(100%-60px)]">
                <CarChatbot cars={cars} isFloating={true} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
